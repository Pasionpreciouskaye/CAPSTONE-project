// Chart Configuration
const ctx = document.getElementById("expenseChart").getContext("2d");

// Define a broader color palette
const chartColors = [
    '#4CAF50', // Green (Existing)
    '#f875aa', // Pink (Existing)
    '#3498db', // Blue
    '#f39c12', // Orange
    '#9b59b6', // Purple
    '#1abc9c', // Teal
    '#e74c3c', // Red
    '#f1c40f', // Yellow
    '#34495e', // Dark Blue/Grey
    '#8d6e63'  // Brown
];

const expenseChart = new Chart(ctx, {
    type: "bar",
    data: {
        // Make sure labels match the intended data length (12 months)
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
            {
                label: "Community Projects", // Category 1
                backgroundColor: chartColors[0], // First color
                // Ensure data array length matches labels length (12)
                data: [120, 150, 80, 170, 110, 140, 180, 0, 0, 0, 0, 0], // Added zeros to match 12 months
            },
            {
                label: "Maintenance", // Category 2
                backgroundColor: chartColors[1], // Second color
                 // Ensure data array length matches labels length (12)
                data: [100, 120, 200, 60, 90, 130, 100, 0, 0, 0, 0, 0], // Added zeros to match 12 months
            },
            // --- Added 8 New Placeholder Datasets ---
            { label: "Category 3", backgroundColor: chartColors[2], data: [0,0,0,0,0,0,0,0,0,0,0,0] },
            { label: "Category 4", backgroundColor: chartColors[3], data: [0,0,0,0,0,0,0,0,0,0,0,0] },
            { label: "Category 5", backgroundColor: chartColors[4], data: [0,0,0,0,0,0,0,0,0,0,0,0] },
            { label: "Category 6", backgroundColor: chartColors[5], data: [0,0,0,0,0,0,0,0,0,0,0,0] },
            { label: "Category 7", backgroundColor: chartColors[6], data: [0,0,0,0,0,0,0,0,0,0,0,0] },
            { label: "Category 8", backgroundColor: chartColors[7], data: [0,0,0,0,0,0,0,0,0,0,0,0] },
            { label: "Category 9", backgroundColor: chartColors[8], data: [0,0,0,0,0,0,0,0,0,0,0,0] },
            { label: "Category 10", backgroundColor: chartColors[9], data: [0,0,0,0,0,0,0,0,0,0,0,0] },
            // --- End of Added Datasets ---
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Keep this for flexible sizing within container
        plugins: {
            legend: {
                // ***** CHANGE REVERTED HERE *****
                position: "bottom", // Set back to "bottom"
                // ******************************
                 labels: {
                    padding: 20, // Restore original padding
                    boxWidth: 15 // Restore original box width
                }
            },
             tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
             x: {
                stacked: false,
            },
            y: {
                stacked: false,
                beginAtZero: true,
                ticks: {
                    stepSize: 50,
                },
            },
        },
    },
});

// Load Chart on DOM Load
document.addEventListener("DOMContentLoaded", function () {
    // ***** REMOVED MIN-HEIGHT ADJUSTMENT *****
    // const chartContainer = document.querySelector('.chart-container');
    // if (chartContainer) {
    //     chartContainer.style.minHeight = '450px';
    // }
    // ****************************************
    expenseChart.update();
});

// --- Rest of your existing JavaScript code ---

const budgetBody = document.getElementById("budgetBody");
const modal = document.getElementById("addBudgetModal");
const budgetForm = document.getElementById("budgetForm");

let editRow = null; // Stores the row being edited

// Open Modal for Adding/Editing Budget
function openModal() {
    budgetForm.reset();
    editRow = null;
    modal.style.display = "block";
}

// Close Modal
function closeModal() {
    modal.style.display = "none";
}

// Handle Edit and Delete Button Clicks
budgetBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-edit")) {
        editRow = e.target.closest("tr");
        const cells = editRow.getElementsByTagName("td");

        // Populate form with existing data
        document.getElementById("category").value = cells[0].innerText;
        document.getElementById("allocated").value = cells[1].innerText.replace("₱", "").replace(/,/g, ""); // Use regex to remove all commas
        document.getElementById("spent").value = cells[2].innerText.replace("₱", "").replace(/,/g, ""); // Use regex to remove all commas
        document.getElementById("dateAllocated").value = cells[4].innerText;
        document.getElementById("dateSpent").value = cells[5].innerText;

        modal.style.display = "block";
    }

    if (e.target.classList.contains("btn-delete")) {
        if (confirm("Are you sure you want to delete this budget entry?")) {
            const row = e.target.closest("tr");
            const cells = row.getElementsByTagName("td");

            // Prepare deleted data (Using Philippine Time - PHT/PST)
            const deletedTransaction = {
                category: cells[0].innerText,
                allocated: cells[1].innerText,
                spent: cells[2].innerText,
                remaining: cells[3].innerText,
                dateAllocated: cells[4].innerText,
                dateSpent: cells[5].innerText,
                // Assuming server or system time is correctly set for PHT/PST
                deletedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
            };

            // Store in localStorage
            let deletedList = JSON.parse(localStorage.getItem("deletedTransactions")) || [];
            deletedList.push(deletedTransaction);
            localStorage.setItem("deletedTransactions", JSON.stringify(deletedList));

            // Remove row
            row.remove();

            // Redirect
            setTimeout(() => {
                window.location.href = "transactionhistory.html";
            }, 300);
        }
    }
});

// Handle Form Submission - Add/Edit Budget
budgetForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values and ensure they are numbers for calculation
    const allocatedValue = parseFloat(document.getElementById("allocated").value) || 0;
    const spentValue = parseFloat(document.getElementById("spent").value) || 0;
    const remainingValue = allocatedValue - spentValue;

    // Format for display
    const category = document.getElementById("category").value;
    const allocated = `₱${allocatedValue.toLocaleString()}`;
    const spent = `₱${spentValue.toLocaleString()}`;
    const remaining = `₱${remainingValue.toLocaleString()}`;
    const dateAllocated = document.getElementById("dateAllocated").value;
    const dateSpent = document.getElementById("dateSpent").value;


    if (editRow) {
        // Update existing row
        const cells = editRow.getElementsByTagName("td");
        cells[0].innerText = category;
        cells[1].innerText = allocated;
        cells[2].innerText = spent;
        cells[3].innerText = remaining;
        cells[4].innerText = dateAllocated;
        cells[5].innerText = dateSpent;
    } else {
        // Add new row
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${category}</td>
            <td>${allocated}</td>
            <td>${spent}</td>
            <td>${remaining}</td>
            <td>${dateAllocated}</td>
            <td>${dateSpent}</td>
            <td>
                <button class="btn btn-edit">Edit</button>
                <button class="btn btn-delete">Delete</button>
            </td>
        `;
        budgetBody.appendChild(newRow);
    }

    closeModal();
});

// Close modal when clicking outside
window.onclick = function (e) {
    if (e.target === modal) {
        closeModal();
    }
};