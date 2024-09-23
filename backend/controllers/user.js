import { User } from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/data-uri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.js";

export const register = async (req, res)=>{
    try{
        const { username, email, password, confirmPassword, gender } = req.body;
        if(!username || !email || !password || !confirmPassword || !gender){
            return res.status(400).json({
                message: "Something went wrong, Check all fields",
                success: false,
            });
        };

        if(password !== confirmPassword){
            return res.status(400).json({
                message: "Both password doesn't match",
                success: false,
            })
        }
        
        const user = await User.findOne({email});
        const checkUsername = await User.findOne({username});

        if(checkUsername){
            return res.status(400).json({
                message: "Username already taken, please try another",
                success: false
            })
        }

        if(user){
            return res.status(400).json({
                message: "E-mail ID already registered",
                success: false,
            });
        };
        
        const maleProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const femaleProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const profilePicture = gender === "male" ? maleProfilePicture : femaleProfilePicture;

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
            profilePicture: profilePicture,
            gender: gender,
        });
        
        return res.status(201).json({
            message: "Account created successfully, Please login to continue...",
            success: true,
        })
    }
    catch(err){
        console.error(err)
    }
}

export const login = async (req, res)=>{
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                message: "Something is missing, Check all field",
                success: false,
            });
        };

        let user = await User.findOne({email});
        
        if(!user){
            return res.status(401).json({
                message: "User not registered",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1d'});
        
        await Promise.all(user.posts.map(async (postId)=>{
            const post = await Post.findById(postId);

            if(post?.author.equals(user._id)){
                return post;
            }
            return null;
        }))

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
        }

        return res.cookie("token", token, {httpOnly: true, sameSite: 'strict', maxAge: 1*24*60*60*1000}).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
    }
}

export const logout = async (req, res)=>{
    try {
        return res.cookie("token", "", {maxAge: 0}).json({
            message: "Logged Out Successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);
    }
}

export const getProfile = async (req, res)=>{
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path: 'posts', createdAt: -1}).populate('bookmarks');

        return res.status(200).json({
            user: user,
            success: true
        });

    } catch (error) {
        console.error(error)
    }
}

export const editProfile = async (req, res)=>{
    try {
        const userId = req.id;
        
        let cloudResponse;
        const { bio, username } = req.body;
        const profilePicture = req.file;

        if(!username){
            res.status(404).json({
                message: "Username connot be blank",
                success: false
            });
        };

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
            })
        };

        if(bio) user.bio = bio;
        if(username) user.username = username;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: "Profile Updated",
            success: true,
            user: user,
        })

    } catch (error) {
        console.error(error);
    }
}

export const suggestedUsers = async (req, res)=>{
    try {
        const suggestedUsers = await User.find({_id: {$ne: req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(400).json({
                message: "No Suggestions",
            });
        };

        return res.status(200).json({
            success: true,
            suggestedUsers: suggestedUsers,
        });
    } catch (error) {
        console.error(error)
    }
}

export const followOrUnfollow = async (req, res)=>{
    try {
        const userFollowing = req.id;
        const userFollowed = req.params.id;

        if(user === userRequested){
            return res.status(400).json({
                message: "You cannot follow or unfollow yourself",
                success: false,
            });
        };

        const user = await User.findById(userFollowing);
        const targetUser = await User.findById(userFollowed);

        if(!user || !targetUser){
            return res.status(400).json({
                message: "Some Error Occured",
                success: false,
            });
        };

        const idFollowing = user.following.includes(userFollowed);

        if(idFollowing){
            await Promise.all([
                User.updateOne({_id: userFollowing}, {$pull: {following: userFollowed}}),
                User.updateOne({_id: userFollowed}, {$pull: {followers: userFollowing}}),
            ])

            return res.status(200).json({
                message: "Unfollow Successfully",
                success: true,
            })
        }
        else{
            await Promise.all([
                User.updateOne({_id: userFollowing}, {$push: {following: userFollowed}}),
                User.updateOne({_id: userFollowed}, {$push: {followers: userFollowing}}),
            ])

            return res.status(200).json({
                message: "Follow Successfully",
                success: false,
            })
        }
    } catch (error) {
        console.error(error);
    }
}