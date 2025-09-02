import { useEffect, useState } from "react"
import Notes from "./components/Notes"

function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/api/notes")
      .then(res => res.json())
      .then(data => setNotes(data))
  }, [])

  const addNote = () => {
    fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    })
      .then(res => res.json())
      .then(note => setNotes([...notes, note]))
  }

  const deleteNote = id => {
    fetch(`http://localhost:5000/api/notes/${id}`, { method: "DELETE" })
      .then(() => setNotes(notes.filter(n => n._id !== id)))
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notes App</h1>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={addNote}>Add</button>
      <Notes notes={notes} deleteNote={deleteNote} />
    </div>
  )
}

export default App
