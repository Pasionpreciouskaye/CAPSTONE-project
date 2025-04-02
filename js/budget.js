// budget.js - Updated Version

// Chart Configuration
const ctx = document.getElementById("expenseChart").getContext("2d");
const expenseChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Community Projects",
        backgroundColor: "#4CAF50",
        data: [120, 150, 80, 170, 110, 140, 180],
      },
      {
        label: "Maintenance",
        backgroundColor: "#f875aa",
        data: [100, 120, 200, 60, 90, 130, 100],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
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
  expenseChart.update();
});

// Modal Logic
function openModal() {
  document.getElementById("addBudgetModal").style.display = "block";
}

function closeModal() {
  document.getElementById("addBudgetModal").style.display = "none";
}

// Handle Form Submission - Add Budget Function
document.getElementById("budgetForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const category = document.getElementById("category").value;
  const allocated = document.getElementById("allocated").value;
  const spent = document.getElementById("spent").value;
  const remaining = allocated - spent;
  const dateAllocated = new Date().toLocaleDateString();
  const dateSpent = spent > 0 ? new Date().toLocaleDateString() : "N/A";

  // Add new row to the table
  const table = document.getElementById("budgetBody");
  const row = table.insertRow();
  row.innerHTML = `
    <td>${category}</td>
    <td>₱${allocated}</td>
    <td>₱${spent}</td>
    <td>₱${remaining}</td>
    <td>${dateAllocated}</td>
    <td>${dateSpent}</td>
    <td>
      <button class="btn btn-edit">Edit</button>
      <button class="btn btn-delete">Delete</button>
    </td>
  `;

  // Close modal and reset form
  closeModal();
  document.getElementById("budgetForm").reset();
});
