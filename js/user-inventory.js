document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const searchBar = document.getElementById("searchBar");
  const tableBody = document.querySelector("#inventoryTable tbody");
  const pb = new PocketBase('http://127.0.0.1:8090'); // PocketBase URL

  // Dropdown logic
  if (menuButton && dropdownMenu) {
    let dropdownTimeout;

    menuButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click event from bubbling up
      dropdownMenu.classList.toggle("hidden");
      console.log("Dropdown toggled");
    });

    document.addEventListener("click", (e) => {
      if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });
  }

  // Load inventory data from PocketBase
  async function loadInventory() {
    try {
      const records = await pb.collection('inventory').getFullList({
        sort: '-created' // latest items first
      });

      tableBody.innerHTML = ''; // Clear existing rows

      records.forEach(item => {
        const row = document.createElement("tr");
        const formattedCost = item.cost ? parseFloat(item.cost).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : 'N/A';
        const quantity = item['# current_quantity'] || 'N/A';

        row.innerHTML = `
          <td>${item.name || 'N/A'}</td>
          <td>${item.category || 'N/A'}</td>
          <td>${formattedCost}</td>
          <td>${item.sku || 'N/A'}</td>
          <td>${quantity}</td>
        `;

        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  }

  // Load inventory data on page load
  loadInventory();

  // Search functionality
  searchBar.addEventListener("input", function () {
    const searchQuery = searchBar.value.toLowerCase().trim();
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(row => {
      const cells = row.querySelectorAll("td");
      const isVisible = Array.from(cells).some(cell => 
        cell.textContent.toLowerCase().includes(searchQuery)
      );
      row.style.display = isVisible ? "" : "none";
    });
  });
});
