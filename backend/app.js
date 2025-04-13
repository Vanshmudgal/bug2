const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const { Server } = require("socket.io");

const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});


app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",  // Adjust according to your frontend port
    methods: ["GET", "POST"],
    credentials: true,
  },
});


app.get('/home',(req,res)=>{
    res.send('welcome to express')
})


let socketsConnected = new Set()

io.on("connection", onConnected)
 

function onConnected(socket)
{
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total',socketsConnected.size)


    socket.on('disconnect', () => {
        console.log("Disconnected:", socket.id);
        socketsConnected.delete(socket.id);       // 🔴 Remove disconnected client
         io.emit('clients-total',socketsConnected.size)// 🔁 Broadcast new count
      });


      socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message',data)
      })
}