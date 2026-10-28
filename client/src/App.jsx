import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planned");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Project details
  const [selectedProject, setSelectedProject] = useState(null);

  // =========================================
  // LOGIN CHECK
  // =========================================

 if (!isLoggedIn) {
  if (showRegister) {
    return (
      <Register
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <Login
      onRegister={() => setShowRegister(true)}
    />
  );
}

  

  // =========================================
  // GET PROJECTS
  // =========================================

  function getProjects() {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // Token expired or invalid
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setIsLoggedIn(false);

          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (!data) return;

        setProjects(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Load projects when dashboard opens
  useEffect(() => {
    getProjects();
  }, []);

  // =========================================
  // CREATE PROJECT
  // =========================================

  function createProject(event) {
    event.preventDefault();

    fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        status: status,
      }),
    })
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setIsLoggedIn(false);

          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (!data) return;

        setMessage(data.message);

        setName("");
        setDescription("");
        setStatus("Planned");

        getProjects();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // =========================================
  // START EDITING
  // =========================================

  function startEdit(project) {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description);
    setStatus(project.status || "Planned");
    setMessage("");
  }

  // =========================================
  // UPDATE PROJECT
  // =========================================

  function updateProject(event) {
    event.preventDefault();

    fetch(`http://localhost:5000/api/projects/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        status: status,
      }),
    })
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setIsLoggedIn(false);

          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (!data) return;

        setMessage(data.message);

        setName("");
        setDescription("");
        setStatus("Planned");
        setEditingId(null);

        getProjects();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // =========================================
  // DELETE PROJECT
  // =========================================

  function deleteProject(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    fetch(`http://localhost:5000/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setIsLoggedIn(false);

          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (!data) return;

        setMessage(data.message);

        if (selectedProject && selectedProject.id === id) {
          setSelectedProject(null);
        }

        getProjects();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // =========================================
  // CANCEL EDITING
  // =========================================

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setDescription("");
    setStatus("Planned");
    setMessage("");
  }

  // =========================================
  // SEARCH + STATUS FILTER
  // =========================================

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================================
  // DASHBOARD
  // =========================================

  return (
    <div className="app">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="header">

        <div className="header-brand">
          <h1>DevFlow</h1>

          <p>
            Developer Workspace
          </p>
        </div>

        <div className="header-right">

          <div className="project-stats">

            <div className="stat">
              <span>
                {projects.length}
              </span>

              <small>
                Total
              </small>
            </div>

            <div className="stat">
              <span>
                {
                  projects.filter(
                    (project) =>
                      project.status === "In Progress"
                  ).length
                }
              </span>

              <small>
                In Progress
              </small>
            </div>

            <div className="stat">
              <span>
                {
                  projects.filter(
                    (project) =>
                      project.status === "Completed"
                  ).length
                }
              </span>

              <small>
                Completed
              </small>
            </div>

          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");

              setIsLoggedIn(false);
            }}
          >
            Logout
          </button>

        </div>

      </header>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="container">

        {/* Projects Introduction */}

        <section className="intro">

          <div className="intro-top">

            <div>

              <p className="welcome-text">
                Welcome back
                {user?.name ? `, ${user.name}` : ""}
              </p>

              <h2>
                Your Projects
              </h2>

              <p>
                Manage and organize your development projects.
              </p>

            </div>

            <input
              className="search-input"
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          {/* Status Filters */}

          <div className="filter-buttons">

            <button
              className={
                statusFilter === "All"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter("All")
              }
            >
              All
            </button>

            <button
              className={
                statusFilter === "Planned"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter("Planned")
              }
            >
              Planned
            </button>

            <button
              className={
                statusFilter === "In Progress"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter("In Progress")
              }
            >
              In Progress
            </button>

            <button
              className={
                statusFilter === "Completed"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter("Completed")
              }
            >
              Completed
            </button>

          </div>

        </section>

        {/* =====================================
            MESSAGE
        ===================================== */}

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {/* =====================================
            PROJECTS
        ===================================== */}

        <section className="projects-grid">

          {filteredProjects.length === 0 ? (

            <div className="empty-state">

              <h3>
                {search
                  ? "No projects found"
                  : "No projects yet"}
              </h3>

              <p>
                {search
                  ? "Try searching for a different project."
                  : "Create your first project below."}
              </p>

            </div>

          ) : (

            filteredProjects.map((project) => (

              <div
                className="project-card"
                key={project.id}
                onClick={() =>
                  setSelectedProject(project)
                }
              >

                <div className="project-icon">
                  {"</>"}
                </div>

                <h3>
                  {project.name}
                </h3>

                <p>
                  {project.description}
                </p>

                <div
                  className={`status ${project.status
                    ?.toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {project.status || "Planned"}
                </div>

                {/* Card Actions */}

                <div className="card-actions">

                  <button
                    className="edit-btn"
                    onClick={(event) => {
                      event.stopPropagation();

                      startEdit(project);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={(event) => {
                      event.stopPropagation();

                      deleteProject(project.id);
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </section>

        {/* =====================================
            CREATE / EDIT FORM
        ===================================== */}

        <section className="form-section">

          <h2>
            {editingId
              ? "Edit Project"
              : "Create a Project"}
          </h2>

          <p>
            {editingId
              ? "Update your project details."
              : "Add a new project to your workspace."}
          </p>

          <form
            onSubmit={
              editingId
                ? updateProject
                : createProject
            }
          >

            <div className="input-group">

              <label>
                Project Name
              </label>

              <input
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

            </div>

            <div className="input-group">

              <label>
                Description
              </label>

              <textarea
                placeholder="What is this project about?"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                required
              />

            </div>

            <div className="input-group">

              <label>
                Project Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <option value="Planned">
                  Planned
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>

            <div className="form-actions">

              <button
                className="primary-btn"
                type="submit"
              >
                {editingId
                  ? "Update Project"
                  : "Create Project"}
              </button>

              {editingId && (
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

      </main>

      {/* =====================================
          PROJECT DETAILS MODAL
      ===================================== */}

      {selectedProject && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedProject(null)
          }
        >

          <div
            className="project-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedProject(null)
              }
            >
              ×
            </button>

            <div className="project-icon modal-icon">
              {"</>"}
            </div>

            <h2>
              {selectedProject.name}
            </h2>

            <p className="modal-description">
              {selectedProject.description}
            </p>

            <div className="modal-info">

              <div>

                <span>
                  Status
                </span>

                <strong>
                  {selectedProject.status ||
                    "Planned"}
                </strong>

              </div>

              <div>

                <span>
                  Project ID
                </span>

                <strong>
                  #{selectedProject.id}
                </strong>

              </div>

            </div>

            <button
              className="primary-btn modal-button"
              onClick={() => {
                startEdit(selectedProject);
                setSelectedProject(null);
              }}
            >
              Edit Project
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;