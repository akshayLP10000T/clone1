import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    },
});

const userSocketMap = {};

export const getReceiverSocketId = (id)=>{
    return userSocketMap[id];
}

io.on('connection', (socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
        console.log(`User connected: ${userId}, socketId = ${socket.id}`);
    };

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', ()=>{
        if(userId){
            console.log(`User disconnected: ${userId}, socketId = ${socket.id}`);
            delete userSocketMap[userId];
        };
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export {app, server, io};