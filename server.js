// ============================
// Backend (Node + Express)
// ============================
const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// In-memory todo list
let todos = [
  { id: 1, task: "Learn Node.js" },
  { id: 2, task: "Learn React" }
];

// CRUD Routes
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const newTodo = { id: Date.now(), task: req.body.task };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.json({ success: true });
});

// ============================
// Frontend (React)
// ============================
const reactApp = `
<!DOCTYPE html>
<html>
  <head>
    <title>To-Do App</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script crossorigin src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

    <script type="text/babel">
      const { useState, useEffect } = React;

      function App() {
        const [todos, setTodos] = useState([]);
        const [task, setTask] = useState("");

        // Fetch todos
        useEffect(() => {
          fetch("/api/todos")
            .then(res => res.json())
            .then(data => setTodos(data));
        }, []);

        // Add todo
        const addTodo = async () => {
          if (!task) return;
          const res = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task })
          });
          const newTodo = await res.json();
          setTodos([...todos, newTodo]);
          setTask("");
        };

        // Delete todo
        const deleteTodo = async (id) => {
          await fetch("/api/todos/" + id, { method: "DELETE" });
          setTodos(todos.filter(t => t.id !== id));
        };

        return (
          <div style={{ margin: "50px", fontFamily: "Arial" }}>
            <h1>✅ To-Do App</h1>
            <input 
              value={task}
              onChange={e => setTask(e.target.value)}
              placeholder="Enter a task"
            />
            <button onClick={addTodo}>Add</button>
            <ul>
              {todos.map(t => (
                <li key={t.id}>
                  {t.task} 
                  <button onClick={() => deleteTodo(t.id)}>❌</button>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      ReactDOM.createRoot(document.getElementById("root")).render(<App />);
    </script>
  </body>
</html>
`;

app.get("/", (req, res) => {
  res.send(reactApp);
});

// ============================
// Start Server
// ============================
const PORT = 3000;
app.listen(PORT, () => console.log(\`🚀 Server running at http://localhost:\${PORT}\`));
