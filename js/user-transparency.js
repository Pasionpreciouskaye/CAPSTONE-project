document.addEventListener("DOMContentLoaded", async () => {
  // Initialize PocketBase instance
  const pb = new PocketBase('http://127.0.0.1:8090');  // Ensure PocketBase is running

  const budgetTableBody = document.getElementById('budgetBody');  // Table body for displaying data
  const menuButton = document.getElementById('menuButton');
  const dropdownMenu = document.getElementById('dropdownMenu');
  let dropdownTimeout;

  // Dropdown menu toggle functionality
  if (menuButton && dropdownMenu) {
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
    });

    menuButton.addEventListener('mouseenter', () => {
      clearTimeout(dropdownTimeout);
      dropdownMenu.classList.remove('hidden');
    });

    dropdownMenu.addEventListener('mouseenter', () => {
      clearTimeout(dropdownTimeout);
    });

    menuButton.addEventListener('mouseleave', () => {
      dropdownTimeout = setTimeout(() => {
        dropdownMenu.classList.add('hidden');
      }, 300);
    });

    dropdownMenu.addEventListener('mouseleave', () => {
      dropdownTimeout = setTimeout(() => {
        dropdownMenu.classList.add('hidden');
      }, 300);
    });

    document.addEventListener('click', (e) => {
      if (!menuButton.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });
  }

  // Fetch budget data from PocketBase
  async function fetchBudgetData() {
    if (budgetTableBody) {
      budgetTableBody.innerHTML = `<tr><td colspan="6">Loading data...</td></tr>`; // Placeholder
    }

    try {
      const records = await pb.collection('budget').getFullList({ sort: '-created' });
      updateBudgetTable(records); // Update the table with fetched records
    } catch (error) {
      console.error("Error fetching data from PocketBase:", error);
    }
  }

  // Update the table with the fetched data
  function updateBudgetTable(data) {
    budgetTableBody.innerHTML = '';  // Clear current data

    if (data.length === 0) {
      const emptyRow = budgetTableBody.insertRow();
      emptyRow.innerHTML = `<td colspan="6" class="empty-message">No data available</td>`;
    } else {
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

  // Format the date to show in a readable format
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Fetch data for table and update on page load
  fetchBudgetData();
});
