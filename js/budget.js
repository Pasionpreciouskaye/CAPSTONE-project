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
    document.getElementById("allocated").value = cells[1].innerText.replace("₱", "").replace(",", "");
    document.getElementById("spent").value = cells[2].innerText.replace("₱", "").replace(",", "");
    document.getElementById("dateAllocated").value = cells[4].innerText;
    document.getElementById("dateSpent").value = cells[5].innerText;

    modal.style.display = "block";
  }

  if (e.target.classList.contains("btn-delete")) {
    if (confirm("Are you sure you want to delete this budget entry?")) {
      e.target.closest("tr").remove();
    }
  }
});

// Handle Form Submission - Add/Edit Budget
budgetForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const category = document.getElementById("category").value;
  const allocated = `₱${parseFloat(document.getElementById("allocated").value).toLocaleString()}`;
  const spent = `₱${parseFloat(document.getElementById("spent").value).toLocaleString()}`;
  const remaining = `₱${(parseFloat(document.getElementById("allocated").value) - parseFloat(document.getElementById("spent").value)).toLocaleString()}`;
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
