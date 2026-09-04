
import { useEffect, useState } from "react";

function App() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);

  // Get projects
  function getProjects() {
    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    getProjects();
  }, []);

  // Create project
  function createProject(event) {
    event.preventDefault();

    fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);

        setName("");
        setDescription("");

        getProjects();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Start editing
  function startEdit(project) {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description);
    setMessage("");
  }

  // Update project
  function updateProject(event) {
    event.preventDefault();

    fetch(`http://localhost:5000/api/projects/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);

        setName("");
        setDescription("");
        setEditingId(null);

        getProjects();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Delete project
  function deleteProject(id) {
    fetch(`http://localhost:5000/api/projects/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);

        getProjects();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Cancel editing
  function cancelEdit() {
    setEditingId(null);
    setName("");
    setDescription("");
    setMessage("");
  }

  return (
    <div>
      <h1>DevFlow</h1>
      <p>Developer Workspace</p>

      <h2>Projects</h2>

      <p>Number of projects: {projects.length}</p>

      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>

          <p>{project.description}</p>

          <button onClick={() => startEdit(project)}>
            Edit
          </button>

          {" "}

          <button onClick={() => deleteProject(project.id)}>
            Delete
          </button>

          <hr />
        </div>
      ))}

      {message && <p>{message}</p>}

      <h2>{editingId ? "Edit Project" : "Create a Project"}</h2>

      <form onSubmit={editingId ? updateProject : createProject}>
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Project description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          {editingId ? "Update Project" : "Create Project"}
        </button>

        {" "}

        {editingId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default App;

