document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#inventoryTable tbody");
  const searchInput = document.getElementById("search");

  // Connect to PocketBase
  const pb = new PocketBase('http://127.0.0.1:8090'); // Update with your actual PocketBase URL if different

  async function loadInventory() {
    try {
      const records = await pb.collection('inventory').getFullList({
        sort: '-created' // latest items first
      });

      // Clear existing table rows
      tableBody.innerHTML = '';

      records.forEach(item => {
        const row = document.createElement("tr");

        // Optional: format cost as currency
        const formattedCost = item.cost ? parseFloat(item.cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';

        row.innerHTML = `
          <td>${item.name || ''}</td>
          <td>${item.category || ''}</td>
          <td>${item.qty || ''}</td>
          <td>${formattedCost}</td>
          <td>${item.supplier || ''}</td>
          <td>${item.reorder || ''}</td>
          <td>${item.location || ''}</td>
          <td>${item.sku || ''}</td>
          <td>${item.packaging || ''}</td>
          <td>${item.date || ''}</td>
          <td>${item.usage || ''}</td>
        `;

        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  }

  // --- Live Search ---
  searchInput.addEventListener("keyup", () => {
    const query = searchInput.value.toLowerCase().trim();
    document.querySelectorAll("#inventoryTable tbody tr").forEach(row => {
      const match = Array.from(row.cells).some(cell =>
        cell.textContent.toLowerCase().includes(query)
      );
      row.style.display = match ? "" : "none";
    });
  });

  // Load inventory data
  loadInventory();
});
