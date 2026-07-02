import { io } from "socket.io-client";
import SERVER_URL from "./serverURL"; 

const socket = io(SERVER_URL, {
  transports: ["websocket", "polling"], 
  withCredentials: true, 
  autoConnect: false, 
});

export default socket;