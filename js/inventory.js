document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with a "data-link" attribute
    const navElements = document.querySelectorAll("[data-link]");

    navElements.forEach((element) => {
        element.addEventListener("click", () => {
            const link = element.getAttribute("data-link");
            if (link) {
                window.location.href = link; // Navigate to the assigned page
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const tableRows = document.querySelectorAll("#inventoryTable tr");

    searchInput.addEventListener("keyup", () => {
        const query = searchInput.value.toLowerCase();
        
        tableRows.forEach(row => {
            const cells = row.getElementsByTagName("td");
            let found = false;
            
            for (let cell of cells) {
                if (cell.textContent.toLowerCase().includes(query)) {
                    found = true;
                    break;
                }
            }
            row.style.display = found ? "" : "none";
        });
    });
});
