document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("inventoryTable");
    const searchInput = document.getElementById("search");
  
    // Sidebar elements
    const hamburgerIcon = document.getElementById("hamburger-icon");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.querySelector(".overlay");
    const body = document.body;
  
    const createRow = (data) => {
      const row = document.createElement("tr");
      // Example: Format cost as currency (optional, keep if needed)
      const formattedCost = parseFloat(data.cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  
      // Populate cells - Note the absence of the last 'Actions' cell
      row.innerHTML = `
        <td>${data.name || ''}</td>
        <td>${data.category || ''}</td>
        <td>${data.qty || ''}</td>
        <td>${formattedCost || ''}</td>
        <td>${data.supplier || ''}</td>
        <td>${data.reorder || ''}</td>
        <td>${data.location || ''}</td>
        <td>${data.sku || ''}</td>
        <td>${data.packaging || ''}</td>
        <td>${data.date || ''}</td> {/* Consider formatting date */}
        <td>${data.usage || ''}</td>
        `;
      // Removed the <td> for buttons
      return row;
    };
  
    // --- Live Search ---
    // Filters table rows based on the search input value
    searchInput.addEventListener("keyup", () => {
      const query = searchInput.value.toLowerCase().trim();
      document.querySelectorAll("#inventoryTable tr").forEach(row => {
        // Check if any cell's text content includes the query
        const match = Array.from(row.cells).some(cell =>
            cell.textContent.toLowerCase().includes(query)
        );
        row.style.display = match ? "" : "none"; // Show if match, hide if not
      });
    });
  
    // --- Hamburger Menu Toggle ---
    // Handles opening and closing the sidebar
    const toggleSidebar = () => {
      const isActive = sidebar.classList.contains("active");
      sidebar.classList.toggle("active");
      overlay.classList.toggle("active");
      body.classList.toggle("no-scroll");
      body.classList.toggle("sidebar-active");
  
      // Update ARIA attributes for accessibility
      hamburgerIcon.setAttribute("aria-expanded", !isActive);
      sidebar.setAttribute("aria-hidden", isActive);
    };
  
    hamburgerIcon.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar); // Clicking overlay closes sidebar

    function loadInventory() {
        
        const sampleData = [
            { name: 'Laptop', category: 'Electronics', qty: 5, cost: '1200.00', supplier: 'TechCorp', reorder: 2, location: 'Shelf A', sku: 'LP1001', packaging: 'Box', date: '2025-03-15', usage: 'Low' },
            { name: 'Keyboard', category: 'Accessories', qty: 25, cost: '75.50', supplier: 'Input Inc.', reorder: 10, location: 'Bin 3', sku: 'KB2005', packaging: 'Plastic', date: '2025-04-01', usage: 'Medium' },
            { name: 'Office Chair', category: 'Furniture', qty: 10, cost: '150.00', supplier: 'Comfort Seating', reorder: 5, location: 'Floor Area', sku: 'CHAIR01', packaging: 'Large Box', date: '2025-02-20', usage: 'High' }
        ];
  
        // Clear existing table rows
        tableBody.innerHTML = '';
  
        // Populate table with data
        sampleData.forEach(item => {
            const row = createRow(item);
            tableBody.appendChild(row);
            // No need to attach edit/delete listeners here
        });
    }
  
    // Load the inventory data when the page is ready
    loadInventory();
  
  });