document.addEventListener("DOMContentLoaded", () => {
  // Dropdown logic
  const menuButton = document.getElementById("menuButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  let dropdownTimeout;

  if (menuButton && dropdownMenu) {
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("hidden");
    });

    menuButton.addEventListener("mouseenter", () => {
      clearTimeout(dropdownTimeout);
      dropdownMenu.classList.remove("hidden");
    });

    dropdownMenu.addEventListener("mouseenter", () => {
      clearTimeout(dropdownTimeout);
    });

    menuButton.addEventListener("mouseleave", () => {
      dropdownTimeout = setTimeout(() => {
        dropdownMenu.classList.add("hidden");
      }, 300);
    });

    dropdownMenu.addEventListener("mouseleave", () => {
      dropdownTimeout = setTimeout(() => {
        dropdownMenu.classList.add("hidden");
      }, 300);
    });

    document.addEventListener("click", (e) => {
      if (!menuButton.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });
  }
});

// Modal open and close
function openProjectModal(event, element, projectPage) {
  event.preventDefault();
  const title = element.getAttribute("data-title");
  const image = element.getAttribute("data-image");
  const description = element.getAttribute("data-description");

  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalImage").src = image;
  document.getElementById("modalDescription").textContent = description;
  document.getElementById("projectModal").classList.remove("hidden");
  document.getElementById("modalLinkButton").setAttribute("onclick", `navigateToProject('${projectPage}')`);
}

function closeProjectModal() {
  document.getElementById("projectModal").classList.add("hidden");
}

function navigateToProject(projectPage) {
  window.location.href = projectPage;
}
