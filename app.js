const express = require("express");
const socket = require("socket.io");
const app = express();
const port = 3001;


let server = app.listen(port, () => {
    console.log(`Server running on 127.0.0.1:${port}`);
});

app.use(express.static("lib"));

io = socket(server);

io.on("connection", (socket) => {
    console.log("User " + socket.id + "connected");


    socket.on("join", (roomName) => {
        let rooms = io.socket.adapter.room;
        let room = rooom.get(roomName);

        if (room == undefined) {
            socket.join(roomName);
            socket.emit("created")
        } else if (rooom.size == 1) {
            socket.join(roomName);
            socket.emit("joined");
        } else {
            socket.emit("full");
        }

        console.log(rooms);
    });

    socket.on("ready", (roomName) => {
        socket.broadcast.to(roomName).emit(ready);
    });

    socket.on("candidate", (roomName, candidate) => {
        console.log(candidate);
        socket.broadcast.to(roomName).emit("candidate", candidate);
    });

    socket.on("offer", (roomName, offer) => {
        console.log(offer);
        socket.broadcast.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (roomName, answer) => {
        console.log(answer);
        socket.broadcast.to(roomName).emit("answer", answer);
    });
});

io.on("disconnect", (stock) => {
    console.log("Disconnected" + stock.id);
});