// *REQUESTs and SOCKETs
const socket = io()

socket.on("message",(message)=>toastMessage(message))