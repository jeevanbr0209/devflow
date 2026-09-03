import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Connecting...");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then((data) => {
        console.log("PROJECT DATA:", data);
        setProjects(data);
      })
      .catch((error) => {
        console.error("PROJECT ERROR:", error);
      });
  }, []);

  return (
    <div>
      <h1>DevFlow</h1>
      <p>Developer Workspace</p>
      <p>{message}</p>

      <h2>Projects</h2>

{projects.map((project) => (
  <div key={project.id}>
    <h3>{project.name}</h3>
    <p>{project.description}</p>
  </div>
))}
    </div>
  );
}

export default App;