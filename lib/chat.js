let socket = io.connect("http://localhost:3001");
let joinButton = document.getElementById("join");
let roomInput = document.getElementById("roomName");
let divVideoChatLobby = document.getElementById("video-chat-lobby");
let userVideo = document.getElementById("user-video");
let roomName;
let creator = false;
let userStream;
let rtcPeerConnection;

let iceServers = {
    iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.l.google.com:19302" },
    ]
};

joinButton.addEventListener("click", () => {
    if (roomInput.value == "") {
        alert("Please enter a room name!");
    }
    else {
        roomName = roomInput.value;
        socket.emit("join", roomName);
    }
});

socket.on("created", () => {
    creator = true;

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 },
    }).then((stream) => {
        userStream = stream;
        divVideoChatLobby.style = "display:none";
        userVideo.srcObject = stream;
        userVideo.onloadedmetadata = (e) => {
            userVideo.play();
        };
    })
        .catch((err) => {
            alter("Couldnt access your media!!");
        });
});


socket.on("joined", () => {
    creator = false;

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 },
    }).then((stream) => {
        userStream = stream;
        divVideoChatLobby.style = "display:none";
        userVideo.srcObject = stream;
        userVideo.onloadedmetadata = (e) => {
            userVideo.play();
        };
    })
        .catch((err) => {
            alter("Couldnt access your media!!");
        });

});

socket.on("full", () => {
    alert("Room is full!");
});

socket.on("ready", () => {
    if (creator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OnTrackFunction;
        rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
        rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
        rtcPeerConnection.setRemoteDescription(offer);
        rtcPeerConnection
            .createAnswer()
            .then((answer) => {
                rtcPeerConnection.setLocalDescription(answer);
                socket.emit("answer", answer, roomName);
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

socket.on("amswer", (answer) => {
    rtcPeerConnection.setRemoteDescription(answer);
});

function OnIceCandidateFunction(event) {
    console.log("Candidate");
    if (event.candidate) {
        socket.emit("candidate", event.candidate, roomName);
    }
}

function OnTrackFunction(event) {
    peerVide.srcObject = event.streams[0];
    peerVide.onloadedmetadata = (e) => {
        peerVide.play();
    }
}