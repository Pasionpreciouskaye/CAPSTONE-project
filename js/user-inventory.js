document.addEventListener("DOMContentLoaded", () => {
  // Dropdown logic
  const menuButton = document.getElementById("menuButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  let dropdownTimeout;

  // Check if the elements exist
  if (menuButton && dropdownMenu) {
    console.log("Dropdown elements found");

    // Toggle dropdown visibility when the menu button is clicked
    menuButton.addEventListener("click", (e) => {
      e.preventDefault();  // Prevent default action
      e.stopPropagation(); // Stop the click event from bubbling
      if (dropdownMenu.style.display === "none" || dropdownMenu.style.display === "") {
        dropdownMenu.style.display = "block"; // Show the dropdown
      } else {
        dropdownMenu.style.display = "none"; // Hide the dropdown
      }
      console.log("Dropdown toggled");
    });

    // Show the dropdown when the mouse enters the menu button
    menuButton.addEventListener("mouseenter", () => {
      clearTimeout(dropdownTimeout);
      dropdownMenu.style.display = "block"; // Show the dropdown
      console.log("Dropdown shown on hover");
    });

    // Keep the dropdown open when the mouse enters the dropdown itself
    dropdownMenu.addEventListener("mouseenter", () => {
      clearTimeout(dropdownTimeout);
      console.log("Mouse entered dropdown");
    });

    // Hide dropdown when the mouse leaves the menu button
    menuButton.addEventListener("mouseleave", () => {
      dropdownTimeout = setTimeout(() => {
        dropdownMenu.style.display = "none"; // Hide the dropdown
        console.log("Dropdown hidden after mouse leaves button");
      }, 300); // Add delay for smoother hiding
    });

    // Hide dropdown when the mouse leaves the dropdown menu
    dropdownMenu.addEventListener("mouseleave", () => {
      dropdownTimeout = setTimeout(() => {
        dropdownMenu.style.display = "none"; // Hide the dropdown
        console.log("Dropdown hidden after mouse leaves menu");
      }, 300); // Add delay for smoother hiding
    });

    // Close the dropdown if the user clicks outside of the menu
    document.addEventListener("click", (e) => {
      if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = "none"; // Hide the dropdown
        console.log("Dropdown hidden after clicking outside");
      }
    });
  } else {
    console.error("Dropdown elements not found");
  }

  // Load inventory data from PocketBase
  const tableBody = document.querySelector("#inventoryTable tbody");
  const pb = new PocketBase('http://127.0.0.1:8090'); // PocketBase URL

  async function loadInventory() {
    try {
      const records = await pb.collection('inventory').getFullList({
        sort: '-created' // latest items first
      });

      tableBody.innerHTML = ''; // Clear existing rows

      records.forEach(item => {
        const row = document.createElement("tr");

        // Correct the field for quantity to 'current_quantity'
        const formattedCost = item.cost ? parseFloat(item.cost).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : 'N/A';
        const quantity = item.current_quantity || 'N/A'; // Correct field name for quantity

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
  const searchBar = document.getElementById("searchBar");

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
