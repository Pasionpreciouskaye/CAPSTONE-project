document.addEventListener("DOMContentLoaded", async () => {
  // 1. Correctly initialize PocketBase
  const pb = new PocketBase('http://127.0.0.1:8090');  // Ensure PocketBase is running
  
  const budgetTableBody = document.getElementById('budgetBody');  // This will hold our data
  const menuButton = document.getElementById('menuButton');
  const dropdownMenu = document.getElementById('dropdownMenu');
  
  // 2. Dropdown Menu Toggle Functionality
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      dropdownMenu.classList.toggle('show');
    });
  }

  // 3. Close dropdown menu if clicking outside
  document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove('show');
    }
  });

  // 4. Fetch Budget Data from PocketBase
  async function fetchBudgetData() {
    if (budgetTableBody) {
      budgetTableBody.innerHTML = `<tr><td colspan="7">Loading data...</td></tr>`;
    }

    try {
      // Fetch the budget records, sorted by created date
      const records = await pb.collection('budget').getFullList({ sort: '-created' });

      // 5. Call update function to update the table
      updateBudgetTable(records);
    } catch (error) {
      console.error("Error fetching data from PocketBase:", error);
    }
  }

  // 6. Update the Table with Retrieved Data
  function updateBudgetTable(data) {
    console.log("Updating table with data:", data);

    // Clear current table body
    budgetTableBody.innerHTML = '';

    if (data.length === 0) {
      const emptyRow = budgetTableBody.insertRow();
      emptyRow.innerHTML = `<td colspan="7" class="empty-message">No data available</td>`;
    } else {
      // Loop through the fetched records and populate the table
      data.forEach(record => {
        const allocated = parseFloat(record.allocated) || 0;
        const spent = parseFloat(record.spent) || 0;
        const remaining = allocated - spent;
        const remainingClass = remaining < 0 ? 'negative' : '';

        const row = budgetTableBody.insertRow();
        row.innerHTML = `
          <td>${record.category || 'N/A'}</td>
          <td>₱${allocated.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
          <td>₱${spent.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
          <td class="${remainingClass}">₱${remaining.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
          <td>${formatDate(record.dateAllocated)}</td>
          <td>${formatDate(record.dateSpent)}</td>
        `;
      });
    }
  }

  // 7. Format the Date
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // 8. Pie Chart Data for Budget Spent Distribution
  async function updateChart() {
    const records = await pb.collection('budget').getFullList({ sort: '-created' });
    const categories = records.map(record => record.category);
    const spentData = records.map(record => parseFloat(record.spent) || 0);

    const totalSpent = spentData.reduce((sum, value) => sum + value, 0);

    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          label: 'Spent Budget Distribution',
          data: spentData,
          backgroundColor: ['#4CAF50', '#f875aa', '#3498db', '#f39c12', '#9b59b6'],
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.raw !== null) {
                  const value = context.raw;
                  const percentage = totalSpent > 0 ? ((value / totalSpent) * 100).toFixed(1) : 0;
                  label += `${value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })} (${percentage}%)`;
                }
                return label;
              }
            }
          },
          datalabels: {
            formatter: (value) => {
              return (totalSpent > 0 ? ((value / totalSpent) * 100).toFixed(1) : 0) + '%';
            },
            color: '#fff',
            font: {
              weight: 'bold',
              size: 12
            }
          }
        }
      }
    });
  }

  // Fetch data for table and chart on page load
  fetchBudgetData();
  updateChart();
});
