const socket = io("http://localhost:3000"); // replace with your server URL later

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let players = {};
let myId = null;

socket.on("connect", () => {
  myId = socket.id;
  players[myId] = { x: 100, y: 100, color: "blue" };
});

socket.on("playerJoined", (id) => {
  players[id] = { x: 200, y: 200, color: "red" };
});

socket.on("playerMoved", (data) => {
  if (players[data.id]) {
    players[data.id].x = data.x;
    players[data.id].y = data.y;
  }
});

socket.on("playerLeft", (id) => {
  delete players[id];
});

document.addEventListener("keydown", (e) => {
  if (!players[myId]) return;
  let speed = 5;
  if (e.key === "ArrowUp") players[myId].y -= speed;
  if (e.key === "ArrowDown") players[myId].y += speed;
  if (e.key === "ArrowLeft") players[myId].x -= speed;
  if (e.key === "ArrowRight") players[myId].x += speed;

  socket.emit("move", { x: players[myId].x, y: players[myId].y });
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let id in players) {
    ctx.fillStyle = players[id].color;
    ctx.fillRect(players[id].x, players[id].y, 20, 20);
  }
  requestAnimationFrame(draw);
}
draw();
