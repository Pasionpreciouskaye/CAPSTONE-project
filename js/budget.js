import PocketBase from 'pocketbase';

document.addEventListener("DOMContentLoaded", () => {
    const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your PocketBase URL if different
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const addBudgetBtn = document.querySelector('.add-budget-btn');
    const modal = document.getElementById("addBudgetModal");
    const closeBtn = document.querySelector(".close-btn");
    const budgetForm = document.getElementById("budgetForm");
    const budgetTableBody = document.querySelector("#budgetBody");
    const ctx = document.getElementById("expenseChart")?.getContext("2d");
    let currentChart; // To hold the chart instance

    // Function to open the modal (used by onclick in HTML)
    window.openModal = () => {
        modal.classList.add("show");
        budgetForm.reset(); // Clear form when opening
        budgetForm.dataset.editId = ''; // Clear any existing edit ID
        document.querySelector('.modal-content h3').textContent = 'Add Budget';
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
            openModal();
        });
    }

    // Close modal (using event listener as well)
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            closeModal();
        });
    }

    // Close modal on outside click
    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    async function fetchBudgetData() {
        try {
            const records = await pb.collection('budget').getFullList({
                sort: '-created',
            });
            updateBudgetTable(records);
            updateBudgetChart(records);
        } catch (error) {
            console.error("Error fetching budget data:", error);
        }
    }

    function updateBudgetTable(data) {
        budgetTableBody.innerHTML = '';
        data.forEach(record => {
            const row = budgetTableBody.insertRow();
            row.innerHTML = `
                <td>${record.category}</td>
                <td>₱${parseFloat(record.allocated).toLocaleString()}</td>
                <td>₱${parseFloat(record.spent).toLocaleString()}</td>
                <td>₱${parseFloat(record.allocated - record.spent).toLocaleString()}</td>
                <td>${record.dateAllocated}</td>
                <td>${record.dateSpent}</td>
                <td>
                    <button class="btn btn-edit" data-id="${record.id}">Edit</button>
                    <button class="btn btn-delete" data-id="${record.id}">Delete</button>
                </td>
            `;
        });
    }

    function updateBudgetChart(data) {
        if (!ctx) return;

        const categoryExpenses = {};
        data.forEach(item => {
            if (categoryExpenses[item.category]) {
                categoryExpenses[item.category] += item.spent;
            } else {
                categoryExpenses[item.category] = item.spent;
            }
        });

        const labels = Object.keys(categoryExpenses);
        const amounts = Object.values(categoryExpenses);
        const backgroundColors = labels.map((_, index) => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`);
        const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

        if (currentChart) {
            currentChart.destroy();
        }

        currentChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    label: "Total Expense by Category",
                    data: amounts,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Total Expense by Category'
                    }
                }
            }
        });
    }

    // Handle budget form submission (Add or Edit)
    if (budgetForm) {
        budgetForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const category = document.getElementById("category").value;
            const allocated = parseFloat(document.getElementById("allocated").value);
            const spent = parseFloat(document.getElementById("spent").value);
            const dateAllocated = document.getElementById("dateAllocated").value;
            const dateSpent = document.getElementById("dateSpent").value;
            const editId = budgetForm.dataset.editId;

            const data = {
                category: category,
                allocated: allocated,
                spent: spent,
                dateAllocated: dateAllocated,
                dateSpent: dateSpent,
            };

            try {
                if (editId) {
                    await pb.collection('budget').update(editId, data);
                    console.log(`Budget item with ID ${editId} updated.`);
                    document.querySelector('.modal-content h3').textContent = 'Add Budget'; // Reset modal title
                    budgetForm.dataset.editId = ''; // Clear edit ID after update
                } else {
                    const record = await pb.collection('budget').create(data);
                    console.log("New budget item created:", record);
                }
                fetchBudgetData(); // Refresh the table and chart
                budgetForm.reset();
                closeModal();
            } catch (error) {
                console.error("Error saving budget item:", error);
            }
        });
    }

    // Delegate delete and edit button functionality
    if (budgetTableBody) {
        budgetTableBody.addEventListener("click", async (e) => {
            const target = e.target;

            if (target.classList.contains("btn-delete")) {
                const idToDelete = target.dataset.id;
                if (confirm("Are you sure you want to delete this budget item?")) {
                    try {
                        await pb.collection('budget').delete(idToDelete);
                        console.log(`Budget item with ID ${idToDelete} deleted.`);
                        fetchBudgetData(); // Refresh the table and chart
                    } catch (error) {
                        console.error("Error deleting budget item:", error);
                    }
                }
            }

            if (target.classList.contains("btn-edit")) {
                const idToEdit = target.dataset.id;
                budgetForm.dataset.editId = idToEdit;
                document.querySelector('.modal-content h3').textContent = 'Edit Budget';
                try {
                    const record = await pb.collection('budget').getOne(idToEdit);
                    document.getElementById("category").value = record.category;
                    document.getElementById("allocated").value = record.allocated;
                    document.getElementById("spent").value = record.spent;
                    document.getElementById("dateAllocated").value = record.dateAllocated;
                    document.getElementById("dateSpent").value = record.dateSpent;
                    openModal();
                } catch (error) {
                    console.error("Error fetching budget item for edit:", error);
                }
            }
        });
    }

    // Fetch initial data on page load
    fetchBudgetData();
});