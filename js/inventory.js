/**
 * Inventory Management Script (Simplified - Create Only)
 * Connects to PocketBase to add new inventory items.
 * Current Location: Manila, Metro Manila, Philippines
 * Current Time: Sunday, April 13, 2025 at 10:46:22 PM PST
 */
document.addEventListener("DOMContentLoaded", () => {
  // --- PocketBase Setup ---
  // Ensure your PocketBase instance is running at this address
  const POCKETBASE_URL = 'http://127.0.0.1:8090';
  let pb;
  try {
      pb = new PocketBase(POCKETBASE_URL);
      console.log(`PocketBase SDK initialized for ${POCKETBASE_URL}`);
  } catch (error) {
      console.error("Failed to initialize PocketBase SDK:", error);
      alert("Error initializing PocketBase. Please check the console and ensure PocketBase is running.");
      return; // Stop script execution if PocketBase can't be initialized
  }


  // --- DOM Elements ---
  const addBtn = document.getElementById("addItemBtn");
  const modal = document.getElementById("itemModal");
  const closeModalBtn = document.getElementById("closeModal");
  const form = document.getElementById("itemForm");
  const modalTitle = document.getElementById('modalTitle');
  const tableBody = document.getElementById("inventoryTable"); // Keep reference for future use

  // Sidebar elements
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.querySelector(".overlay");
  const body = document.body;

  // Form input elements corresponding to essential fields
  const formInputs = {
      name: document.getElementById("itemName"),
      category: document.getElementById("itemCategory"),
      qty: document.getElementById("itemQty"), // Maps to 'current_quantity' in PocketBase
      cost: document.getElementById("itemCost"), // Maps to 'cost' in PocketBase
      sku: document.getElementById("itemSKU"),   // Maps to 'sku' in PocketBase
  };

  // --- Modal Logic ---
  const openModalForAdd = () => {
      form.reset(); // Clear form fields
      modalTitle.textContent = 'Add Item';
      modal.classList.remove("hidden");
      formInputs.name.focus(); // Focus the first input
  };

  const closeModalFn = () => {
      modal.classList.add("hidden");
      form.reset();
  };

  // --- Form Submission (Handles CREATE only) ---
  form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent default page reload

      // Prepare data object matching PocketBase collection field names
      const data = {
          name: formInputs.name.value.trim(),
          category: formInputs.category.value.trim() || null, // Send null if empty
          // Convert quantity and cost to numbers, handle potential errors
          current_quantity: parseInt(formInputs.qty.value, 10),
          cost: parseFloat(formInputs.cost.value),
          sku: formInputs.sku.value.trim() || null, // Send null if empty
      };

      // Basic client-side validation
      if (!data.name) {
          alert('Item Name is required.');
          return;
      }
      if (isNaN(data.current_quantity) || data.current_quantity < 0) {
          alert('Please enter a valid non-negative quantity.');
          return;
      }
       if (isNaN(data.cost) || data.cost < 0) {
          alert('Please enter a valid non-negative cost.');
          return;
      }

      console.log("Attempting to create item with data:", data);

      // Disable button to prevent double submission
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = '💾 Saving...';

      try {
          // Use the PocketBase SDK to create a new record
          const newRecord = await pb.collection('inventory_items').create(data);

          console.log('Item successfully created in PocketBase:', newRecord);
          alert(`Item "${newRecord.name}" (ID: ${newRecord.id}) created successfully!`);
          closeModalFn(); // Close the modal on success

          // --- NOTE ---
          // This simplified version DOES NOT automatically update the HTML table.
          // You would need to implement data loading/real-time features
          // or refresh the page manually to see the new item in a full app.
          // --- /NOTE ---

      } catch (error) {
          console.error('Failed to create item:', error);
          // Provide more specific feedback based on PocketBase error structure
          let errorMessage = `Failed to save item: ${error.message}`;
           if (error.data && error.data.data) { // PocketBase validation errors
              const validationErrors = Object.entries(error.data.data)
                 .map(([field, details]) => `${field}: ${details.message}`)
                 .join('\n');
              errorMessage = `Validation errors:\n${validationErrors}`;
           } else if (error.status === 403) { // Permission denied
              errorMessage = "Permission Denied. Check PocketBase collection's 'Create Rule'.";
           } else if (error.status === 0 || error.message.includes('Failed to fetch')) { // Network Error
               errorMessage = `Cannot connect to PocketBase at ${POCKETBASE_URL}. Is it running?`;
           }
          alert(`Error creating item:\n${errorMessage}`);
      } finally {
           // Re-enable the submit button whether success or fail
          submitButton.disabled = false;
          submitButton.textContent = '💾 Save Item';
      }
  });

  // --- Event Listeners ---
  addBtn.addEventListener('click', openModalForAdd);
  closeModalBtn.addEventListener('click', closeModalFn);
  // Close modal if clicking outside the content area
  modal.addEventListener('click', (event) => {
      if (event.target === modal) {
          closeModalFn();
      }
  });

  // --- Hamburger Menu Toggle ---
  const toggleSidebar = () => {
      const isActive = sidebar.classList.contains("active");
      sidebar.classList.toggle("active");
      overlay.classList.toggle("active");
      body.classList.toggle("no-scroll");
      body.classList.toggle("sidebar-active");
      hamburgerIcon.setAttribute("aria-expanded", String(!isActive)); // Use string for attribute
      sidebar.setAttribute("aria-hidden", String(isActive)); // Use string for attribute
  };
  hamburgerIcon.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar);

  console.log("Inventory 'Create Only' Script Loaded.");
  // Indicate PocketBase connection attempt
  pb.health.check().then(() => {
      console.log("Successfully connected to PocketBase health check.");
  }).catch((err) => {
      console.error("Initial PocketBase health check failed. Is it running?", err);
       alert(`Could not connect to PocketBase at ${POCKETBASE_URL}. Please ensure it's running and accessible.`);
  });

});