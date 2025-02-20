// File: /src/services/websocket.ts
// Description: Provides WebSocket connection management for Geaux Academy in development mode.
// Author: GitHub Copilot
// Created: 2023-10-24

const socket = new WebSocket("wss://localhost:3000");

socket.onopen = () => {
  console.log("WebSocket connection established");
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

export default socket;
