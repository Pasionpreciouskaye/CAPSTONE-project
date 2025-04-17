document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const addBudgetBtn = document.querySelector('.add-budget-btn');
    const modal = document.getElementById("addBudgetModal");
    const closeBtn = document.querySelector(".close-btn");
    const budgetForm = document.getElementById("budgetForm");
    const budgetTableBody = document.querySelector("#budgetBody");
    const ctx = document.getElementById("expenseChart")?.getContext("2d"); // Corrected chart ID

    // Function to open the modal (used by onclick in HTML)
    window.openModal = () => {
        modal.classList.add("show");
    };

    // Function to close the modal (used by onclick in HTML)
    window.closeModal = () => {
        modal.classList.remove("show");
    };

    // Sidebar toggle (for mobile)
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    // Open modal (using event listener as well)
    if (addBudgetBtn) {
        addBudgetBtn.addEventListener("click", () => {
            modal.classList.add("show");
        });
    }

    // Close modal (using event listener as well)
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("show");
        });
    }

    // Close modal on outside click
    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.classList.remove("show");
        }
    });

    // Sample chart (replace with dynamic PocketBase data later)
    if (ctx) {
        const budgetChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Health", "Education", "Infrastructure"],
                datasets: [{
                    label: "Budget Allocation",
                    data: [12000, 15000, 10000],
                    backgroundColor: "#276cda"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Handle budget form submission (static table update)
    if (budgetForm) {
        budgetForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const category = document.getElementById("category").value;
            const allocated = parseFloat(document.getElementById("allocated").value);
            const spent = parseFloat(document.getElementById("spent").value);
            const dateAllocated = document.getElementById("dateAllocated").value;
            const dateSpent = document.getElementById("dateSpent").value;

            if (category && !isNaN(allocated) && !isNaN(spent) && dateAllocated && dateSpent) {
                // Create new row
                const row = document.createElement("tr");
                const remaining = allocated - spent;

                row.innerHTML = `
                    <td>${category}</td>
                    <td>₱${allocated.toLocaleString()}</td>
                    <td>₱${spent.toLocaleString()}</td>
                    <td>₱${remaining.toLocaleString()}</td>
                    <td>${dateAllocated}</td>
                    <td>${dateSpent}</td>
                    <td>
                        <button class="btn btn-edit">Edit</button>
                        <button class="btn btn-delete">Delete</button>
                    </td>
                `;

                budgetTableBody.appendChild(row);

                // Reset and close modal
                budgetForm.reset();
                modal.classList.remove("show");

                // Optional: update chart data here too
            }
        });
    }

    // Delegate delete/edit button functionality
    if (budgetTableBody) {
        budgetTableBody.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-delete")) {
                e.target.closest("tr").remove();
            }

            // You can implement edit logic here later
            if (e.target.classList.contains("btn-edit")) {
                alert("Edit functionality coming soon!");
            }
        });
    }
});