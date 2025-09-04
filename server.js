const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let tasks = [
  { id: 1, title: "Setup project", status: "todo" },
  { id: 2, title: "Build backend", status: "inprogress" },
  { id: 3, title: "Design UI", status: "done" }
];

io.on("connection", (socket) => {
  socket.emit("init", tasks);

  socket.on("add", (title) => {
    const t = { id: Date.now(), title, status: "todo" };
    tasks.push(t);
    io.emit("update", tasks);
  });

  socket.on("move", ({ id, status }) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      io.emit("update", tasks);
    }
  });

  socket.on("delete", (id) => {
    tasks = tasks.filter((t) => t.id !== id);
    io.emit("update", tasks);
  });
});

const page = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Task Manager</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { margin:0; font-family:system-ui,Arial; background:#0b0f14; color:#e6e6e6; }
    header { padding:16px; background:#111827; display:flex; justify-content:space-between; align-items:center; }
    #progress { font-size:.9rem; opacity:.8; }
    main { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; padding:16px; height:calc(100vh - 64px); }
    section { background:#0f172a; border:1px solid #1e293b; border-radius:12px; display:flex; flex-direction:column; }
    h2 { margin:0; padding:12px; border-bottom:1px solid #1e293b; font-size:1.1rem; }
    .tasks { flex:1; padding:12px; display:flex; flex-direction:column; gap:10px; overflow-y:auto; }
    .task { background:#1e293b; padding:10px 12px; border-radius:8px; cursor:grab; }
    .task:active { opacity:.7; }
    footer { padding:12px; border-top:1px solid #1e293b; }
    input { width:80%; padding:8px; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#e6e6e6; }
    button { padding:8px 12px; border:none; border-radius:8px; background:#2563eb; color:#fff; cursor:pointer; }
  </style>
</head>
<body>
  <header>
    <strong>📋 Task Manager</strong>
    <span id="progress"></span>
  </header>
  <main>
    <section ondrop="drop(event,'todo')" ondragover="allow(event)">
      <h2>To Do</h2>
      <div id="todo" class="tasks"></div>
      <footer>
        <input id="newTask" placeholder="New task"/>
        <button onclick="addTask()">Add</button>
      </footer>
    </section>
    <section ondrop="drop(event,'inprogress')" ondragover="allow(event)">
      <h2>In Progress</h2>
      <div id="inprogress" class="tasks"></div>
    </section>
    <section ondrop="drop(event,'done')" ondragover="allow(event)">
      <h2>Done</h2>
      <div id="done" class="tasks"></div>
    </section>
  </main>

  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    let tasks=[];

    socket.on("init", data=>{ tasks=data; render(); });
    socket.on("update", data=>{ tasks=data; render(); });

    function render(){
      ["todo","inprogress","done"].forEach(id=>{
        document.getElementById(id).innerHTML="";
      });
      tasks.forEach(t=>{
        const div=document.createElement("div");
        div.className="task";
        div.textContent=t.title;
        div.draggable=true;
        div.ondragstart=e=> e.dataTransfer.setData("id",t.id);
        div.ondblclick=()=> socket.emit("delete",t.id);
        document.getElementById(t.status).appendChild(div);
      });
      const done=tasks.filter(t=>t.status==="done").length;
      document.getElementById("progress").textContent=\`\${done}/\${tasks.length} Done\`;
    }

    function allow(e){ e.preventDefault(); }
    function drop(e,status){ e.preventDefault(); socket.emit("move",{id:+e.dataTransfer.getData("id"),status}); }
    function addTask(){ 
      const v=document.getElementById("newTask").value.trim();
      if(!v) return;
      socket.emit("add",v);
      document.getElementById("newTask").value="";
    }
  </script>
</body>
</html>
`;

app.get("/",(_,res)=>res.send(page));

const PORT=3000;
server.listen(PORT,()=>console.log("Task Manager running at http://localhost:"+PORT));
