// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Light/dark theme toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const lightMode = document.body.classList.contains("light");
  themeToggle.textContent = lightMode ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", lightMode ? "Switch to dark theme" : "Switch to light theme");
});

// Project details modal
const projectDetails = {
  portfolio: {
    title: "Personal Portfolio",
    description: "A responsive personal website built to introduce me, present my skills, and highlight selected coursework projects. It includes a mobile menu, theme switcher, project detail modal, and GitHub API integration.",
    tech: ["HTML5", "CSS3", "JavaScript", "GitHub API"]
  },
  store: {
    title: "Clothing Store Website",
    description: "A sample Sri Lankan clothing store frontend. The project explores product presentation, responsive layouts, and Bootstrap/CSS styling. Add your own repository link when the project is published.",
    tech: ["HTML", "CSS", "Bootstrap"]
  },
  tank: {
    title: "Water Tank Alarm",
    description: "A Java Swing coursework interface that monitors a water-level value and displays the alarm state. The alarm turns ON when the water level is greater than 60.",
    tech: ["Java", "Swing", "OOP", "Observer Pattern"]
  }
};

const modal = document.getElementById("projectModal");
document.querySelectorAll(".details-btn").forEach(button => {
  button.addEventListener("click", () => {
    const project = projectDetails[button.dataset.project];
    document.getElementById("modalTitle").textContent = project.title;
    document.getElementById("modalDescription").textContent = project.description;
    const tech = document.getElementById("modalTech");
    tech.replaceChildren(...project.tech.map(item => {
      const span = document.createElement("span");
      span.textContent = item;
      return span;
    }));
    modal.showModal();
  });
});
document.getElementById("modalClose").addEventListener("click", () => modal.close());
modal.addEventListener("click", event => {
  if (event.target === modal) modal.close();
});

// Required public API integration: fetch public repositories from GitHub.
const githubUsername = "rikashh-cmd";
const repoGrid = document.getElementById("repoGrid");
const githubStatus = document.getElementById("githubStatus");

async function loadGitHubRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`);
    if (!response.ok) throw new Error("GitHub repositories could not be loaded.");
    const repos = await response.json();
    if (!repos.length) {
      githubStatus.textContent = "No public repositories found yet. Check back soon!";
      return;
    }
    githubStatus.textContent = `Showing ${Math.min(repos.length, 6)} recently updated public repositories.`;
    repos.slice(0, 6).forEach(repo => {
      const card = document.createElement("article");
      card.className = "repo-card";
      const title = document.createElement("h4");
      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = repo.name;
      title.appendChild(link);
      const description = document.createElement("p");
      description.textContent = repo.description || "No description provided.";
      const meta = document.createElement("div");
      meta.className = "repo-meta";
      meta.textContent = `${repo.language || "Code"}  ·  ★ ${repo.stargazers_count}  ·  Updated ${new Date(repo.updated_at).toLocaleDateString()}`;
      card.append(title, description, meta);
      repoGrid.appendChild(card);
    });
  } catch (error) {
    githubStatus.textContent = "GitHub projects are unavailable right now. You can visit my GitHub profile instead.";
  }
}
loadGitHubRepos();

document.getElementById("year").textContent = new Date().getFullYear();
