document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("inventoryTable");
  const addBtn = document.getElementById("addItemBtn");
  const modal = document.getElementById("itemModal");
  const closeModalBtn = document.getElementById("closeModal"); // Corrected selector ID
  const form = document.getElementById("itemForm");
  const editIndexInput = document.getElementById("editIndex");
  const searchInput = document.getElementById("search");

  // Sidebar elements
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.querySelector(".overlay");
  const body = document.body;
  // const appContainer = document.querySelector(".app-container"); // If needed for JS logic

  const inputs = {
    name: document.getElementById("itemName"),
    category: document.getElementById("itemCategory"),
    qty: document.getElementById("itemQty"),
    cost: document.getElementById("itemCost"),
    supplier: document.getElementById("itemSupplier"),
    reorder: document.getElementById("itemReorder"),
    location: document.getElementById("itemLocation"),
    sku: document.getElementById("itemSKU"),
    packaging: document.getElementById("itemPackaging"),
    date: document.getElementById("itemDate"),
    usage: document.getElementById("itemUsage"),
  };

  // --- Modal Logic ---
  const openModal = (editMode = false, row = null) => {
    modal.classList.remove("hidden");
    document.getElementById('modalTitle').textContent = editMode ? 'Edit Item' : 'Add Item'; // Update title

    if (editMode && row) {
      const cells = row.querySelectorAll("td");
      // Safely access textContent, providing default empty string if cell missing
      inputs.name.value = cells[0]?.textContent || '';
      inputs.category.value = cells[1]?.textContent || '';
      inputs.qty.value = cells[2]?.textContent || '';
      // Remove currency symbols or formatting if present before setting value (example for cost)
      inputs.cost.value = cells[3]?.textContent.replace(/[^0-9.]/g, '') || '';
      inputs.supplier.value = cells[4]?.textContent || '';
      inputs.reorder.value = cells[5]?.textContent || '';
      inputs.location.value = cells[6]?.textContent || '';
      inputs.sku.value = cells[7]?.textContent || '';
      inputs.packaging.value = cells[8]?.textContent || '';
      inputs.date.value = cells[9]?.textContent || ''; // Assumes date is in YYYY-MM-DD format
      inputs.usage.value = cells[10]?.textContent || '';
      editIndexInput.value = Array.from(tableBody.children).indexOf(row);
    } else {
      form.reset();
      editIndexInput.value = '';
    }
     // Focus the first input field when modal opens
     inputs.name.focus();
  };

  const closeModalFn = () => {
    modal.classList.add("hidden");
    form.reset();
    editIndexInput.value = '';
  };

  // --- Table Row Creation & Actions ---
  const createRow = (data) => {
    const row = document.createElement("tr");
    // Example: Format cost as currency (optional)
    const formattedCost = parseFloat(data.cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // Adjust currency as needed

    row.innerHTML = `
      <td>${data.name}</td>
      <td>${data.category}</td>
      <td>${data.qty}</td>
      <td>${formattedCost}</td> {/* Use formatted cost */}
      <td>${data.supplier}</td>
      <td>${data.reorder}</td>
      <td>${data.location}</td>
      <td>${data.sku}</td>
      <td>${data.packaging}</td>
      <td>${data.date}</td> {/* Consider formatting date */}
      <td>${data.usage}</td>
      <td>
        <button class="action-btn editBtn">Edit</button>
        <button class="action-btn deleteBtn">Delete</button>
      </td>
    `;
    return row;
  };

   // Function to attach event listeners to buttons (call after adding/updating rows)
  const attachRowEventListeners = (row) => {
      const editButton = row.querySelector(".editBtn");
      const deleteButton = row.querySelector(".deleteBtn");

      if (editButton) {
          editButton.onclick = () => openModal(true, row);
      }
      if (deleteButton) {
          deleteButton.onclick = () => {
              // Optional: Add a confirmation dialog
              if (confirm(`Are you sure you want to delete "${row.cells[0].textContent}"?`)) {
                  row.remove();
                  // Optional: Update any summary data or make API call to delete
              }
          };
      }
  };

  // Attach listeners to existing rows on initial load (if any)
   tableBody.querySelectorAll("tr").forEach(attachRowEventListeners);


  // --- Form Submission ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemData = {
      name: inputs.name.value.trim(),
      category: inputs.category.value.trim(),
      qty: inputs.qty.value,
      cost: inputs.cost.value, // Keep as number string for createRow formatting
      supplier: inputs.supplier.value.trim(),
      reorder: inputs.reorder.value,
      location: inputs.location.value.trim(),
      sku: inputs.sku.value.trim(),
      packaging: inputs.packaging.value.trim(),
      date: inputs.date.value,
      usage: inputs.usage.value.trim(),
    };

    const editIndex = editIndexInput.value;
    const newRow = createRow(itemData); // Create the row first

    if (editIndex !== "" && tableBody.children[editIndex]) { // Check if index is valid
        tableBody.replaceChild(newRow, tableBody.children[editIndex]);
    } else {
        tableBody.appendChild(newRow);
    }

    attachRowEventListeners(newRow); // Attach listeners specifically to the new/updated row
    closeModalFn();
    // Optional: Save to localStorage or send to server
  });

  // --- Event Listeners ---
  addBtn.onclick = () => openModal(); // Open modal in 'add' mode
  closeModalBtn.onclick = closeModalFn; // Use correct close button variable

  // Close modal if user clicks outside the modal content
  modal.addEventListener('click', (event) => {
      if (event.target === modal) { // Check if the click was directly on the modal background
          closeModalFn();
      }
  });

  // --- Live Search ---
  searchInput.addEventListener("keyup", () => {
    const query = searchInput.value.toLowerCase().trim();
    document.querySelectorAll("#inventoryTable tr").forEach(row => {
      // Check if any cell text content (converted to lowercase) includes the query
      const match = Array.from(row.cells).some(cell =>
         // Ignore the last cell (actions) for searching
         !cell.querySelector('button') && cell.textContent.toLowerCase().includes(query)
      );
      row.style.display = match ? "" : "none"; // Show if match, hide if not
    });
  });

  // --- Hamburger Menu Toggle ---
  const toggleSidebar = () => {
    const isActive = sidebar.classList.contains("active");
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    body.classList.toggle("no-scroll");
    body.classList.toggle("sidebar-active"); // Toggle class for content shift

    // Update ARIA attributes
    hamburgerIcon.setAttribute("aria-expanded", !isActive);
    sidebar.setAttribute("aria-hidden", isActive);
  };

  hamburgerIcon.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar); // Clicking overlay closes sidebar

  // --- Initial Load (Example: Load from localStorage) ---
  // function loadInventory() { ... }
  // loadInventory();

}); // End DOMContentLoadedq