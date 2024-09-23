import sharp from 'sharp';
import cloudinary from 'cloudinary';
import {Post} from '../models/post.js';
import {User} from '../models/user.js';
import { Comment } from '../models/comment.js'
import { getReceiverSocketId, io } from '../socket/socket.js';

export const addNewPost = async (req, res)=>{
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        
        if(!image){
            return res.status(400).json({
                message: "Image required",
            });
        };

        const optimizedImageBuffer = await sharp(image.buffer).resize({
            width: 800,
            height: 800,
            fit: "inside",
        }).toFormat('jpeg', {
            quality: 80,
        }).toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption: caption,
            image: cloudResponse.secure_url,
            author: authorId,
        });
        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }
        else{
            return res.status(400).json({
                message: "Something went wrong, please try again later",
                success: false,
            });
        }

        await post.populate({
            path: 'author',
            select: '-password'
        });

        return res.status(201).json({
            message: "New post added",
            success: true,
            post,
        })

    } catch (error) {
        console.error(error);
    }
}

export const getAllPosts = async (req, res)=>{
    try {
        const posts = await Post.find().sort({
            createdAt: -1
        }).populate({
            path: 'author',
            select: 'username profilePicture',
        }).populate({
            path: 'comments',
            sort: {createdAt: -1},
            populate: {
                path: 'author',
                select: 'username profilePicture',
            }
        });

        res.status(200).json({
            posts,
            success: true,
        })
    } catch (error) {
        console.error(error)
    }
};

export const getUserPost = async (req, res)=>{
    try {
        const authorId = req.id;
        const posts = await Post.find({author: authorId}).sort({createdAt: -1}).populate({
            path: 'author',
            select: 'username profilePicture'
        }).populate({
            path: 'comments',
            sort: {createdAt: -1},
            populate: {
                path: 'author',
                select: 'username profilePicture',
            }
        });

        res.status(200).json({
            posts,
            success: true,
        })

    } catch (error) {
        console.error(error);
    }
}

export const likePost = async (req, res)=>{
    try {
        const likingUser = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        
        if(!post) return res.status(404).json({
            message: "No post found",
            success: false,
        });

        await post.updateOne({
            $addToSet: {
                likes: likingUser
            }
        });

        await post.save();

        const user = await User.findById(likingUser).select('username profilePicture');
        const ownerId = post.author.toString();

        if(ownerId !== likingUser){
            const notification = {
                type: 'like',
                userId: likingUser,
                userDetails: user,
                postId: postId,
                message: 'Your post was liked',
            }

            const postOwnerSocketId = getReceiverSocketId(ownerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            message: 'Post liked',
            success: true,
        })

    } catch (error) {
        console.error(error)
    }
}

export const dislikePost = async (req, res)=>{
    try {
        const likingUser = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        
        if(!post) return res.status(404).json({
            message: "No post found",
            success: false,
        });

        await post.updateOne({
            $pull: {
                likes: likingUser
            }
        });

        await post.save();

        const user = await User.findById(likingUser).select('username profilePicture');
        const ownerId = post.author.toString();

        if(ownerId !== likingUser){
            const notification = {
                type: 'dislike',
                userId: likingUser,
                userDetails: user,
                postId: postId,
                message: 'Your post was liked',
            }

            const postOwnerSocketId = getReceiverSocketId(ownerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            message: 'Post disliked',
            success: true,
        })

    } catch (error) {
        console.error(error)
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentingUser = req.id;
        
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: "Text is required",
                success: false,
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        const comment = await Comment.create({
            text: text,
            author: commentingUser,
            post: postId,
        });

        await comment.populate({
            path: 'author',
            select: 'username profilePicture',
        });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: "Comment Added",
            comment: comment,
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};


export const getCommentsOfPosts = async (req, res)=>{
    try {
        const postId = req.params.id;
        const comments = await Comment.find({
            post: postId,
        }).populate('author', 'username profilePicture');

        if(!comments) return res.status(404).json({
            message: "No comments found",
            success: false,
        });

        return res.status(200).json({
            comments,
            success: true,
        })

    } catch (error) {
        console.error(error);
    }
}

export const deletePost = async (req, res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({
            message: "Post not found",
            success: false,
        });

        if(post.author.toString() !== authorId) return res.status(403).json({
            message: "Unauthorized",
            success: false,
        });

        await Post.findByIdAndDelete(postId);
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);

        await user.save();

        await Comment.deleteMany({
            post: postId,
        });

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });

    } catch (error) {
        console.error(error);
    }
};

export const bookmarkPost = async (req, res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({
            message: "Post not found",
            success: false,
        });

        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            await user.updateOne({$pull: {bookmarks: post._id}});
            await user.save();

            return res.status(200).json({
                type: "unsaved",
                message: "Post removed from bookmark",
                success: true,
            })
        }
        else{
            await user.updateOne({$addToSet: {bookmarks: post._id}});
            await user.save();

            return res.status(200).json({
                type: "saved",
                message: "Post bookmarked",
                success: true,
            })
        }

    } catch (error) {
        console.error(error);
    }
}