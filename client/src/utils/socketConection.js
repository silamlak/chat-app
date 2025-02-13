import { io } from "socket.io-client";

const socket = io("http://localhost:5500");

socket.on('connection', () => {
    console.log('socket connected')
})

export default socket