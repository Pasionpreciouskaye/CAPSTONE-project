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

// Handle Form Submission
document.getElementById("budgetForm").addEventListener("submit", function (e) {
  e.preventDefault();
  closeModal();
  alert("Budget added/updated successfully!");
});
