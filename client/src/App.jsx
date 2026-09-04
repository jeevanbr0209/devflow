
import { useEffect, useState } from "react";

function App() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

        setProjects([...projects, data.project]);

        setName("");
        setDescription("");
      })
      .catch((error) => {
        console.error(error);
      });
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
        </div>
      ))}

      {message && <p>{message}</p>}

      <h2>Create a Project</h2>

      <form onSubmit={createProject}>
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

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}

export default App;

