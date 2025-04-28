const POCKETBASE_URL = 'http://127.0.0.1:8090'; // PocketBase URL
const pb = new PocketBase(POCKETBASE_URL);

// DOM elements
const form = document.getElementById("itemForm");
const modal = document.getElementById("itemModal");
const overlay = document.getElementById("overlay");
const closeModal = document.getElementById("closeModal");
const addBtn = document.getElementById("addItemBtn");
const modalTitle = document.getElementById("modalTitle");
const itemTableBody = document.getElementById("inventoryTable");

const formInputs = {
  name: document.getElementById("itemName"),
  category: document.getElementById("itemCategory"),
  quantity: document.getElementById("itemQty"),
  cost: document.getElementById("itemCost"),
  sku: document.getElementById("itemSKU")
};

let editingItemId = null;

// Open modal for adding item
const openModalForAdd = () => {
  form.reset();
  editingItemId = null;
  modalTitle.textContent = "Add Item";
  
  // Make modal visible
  modal.classList.add("active");
  overlay.classList.add("active");

  // Focus on the first input
  formInputs.name.focus();

  console.log("Modal Opened: Add Item"); // Debug statement
};

// Close modal
const closeModalFn = () => {
  modal.classList.remove("active");
  overlay.classList.remove("active");
  form.reset();
  editingItemId = null;

  console.log("Modal Closed"); // Debug statement
};

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  addBtn.addEventListener("click", openModalForAdd);
  closeModal.addEventListener("click", closeModalFn);
  overlay.addEventListener("click", closeModalFn);
  loadItems();
});

// Load items from PocketBase
const loadItems = async () => {
  try {
    const records = await pb.collection("inventory").getFullList();
    renderItems(records);
  } catch (err) {
    console.error("Error loading inventory:", err);
  }
};

// Render items to table
const renderItems = (items) => {
  itemTableBody.innerHTML = "";
  items.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category || ""}</td>
      <td>${item.current_quantity}</td>
      <td>${item.cost}</td>
      <td>${item.sku || ""}</td>
      <td>
        <button class="edit-btn" data-id="${item.id}">Edit</button>
        <button class="delete-btn" data-id="${item.id}">Delete</button>
      </td>
    `;
    itemTableBody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => openEditModal(btn.dataset.id));
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteItem(btn.dataset.id));
  });
};

// Open modal to edit item
const openEditModal = async (id) => {
  try {
    const item = await pb.collection("inventory").getOne(id);
    formInputs.name.value = item.name;
    formInputs.category.value = item.category || "";
    formInputs.quantity.value = item.current_quantity;
    formInputs.cost.value = item.cost;
    formInputs.sku.value = item.sku || "";

    editingItemId = id;
    modalTitle.textContent = "Edit Item";
    modal.classList.add("active");
    overlay.classList.add("active");
    formInputs.name.focus();
  } catch (err) {
    console.error("Error loading item:", err);
  }
};

// Delete item
const deleteItem = async (id) => {
  if (confirm("Are you sure you want to delete this item?")) {
    try {
      await pb.collection("inventory").delete(id);
      loadItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }
};

// Form submission for adding or editing item
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: formInputs.name.value.trim(),
    category: formInputs.category.value.trim(),
    current_quantity: parseInt(formInputs.quantity.value),  // Corrected field name
    cost: parseFloat(formInputs.cost.value),
    sku: formInputs.sku.value.trim()
  };

  console.log("Form Data:", data); // Debug statement

  // Validate data before sending to PocketBase
  if (!data.name || !data.current_quantity || !data.cost) {
    console.error("Missing required fields!");
    alert("Please fill in all required fields.");
    return;
  }

  try {
    if (editingItemId) {
      // Edit item
      console.log("Editing Item: ", editingItemId);
      await pb.collection("inventory").update(editingItemId, data);
    } else {
      // Create new item
      console.log("Creating New Item");
      await pb.collection("inventory").create(data);
    }
    closeModalFn();
    loadItems();
  } catch (err) {
    console.error("Error saving item:", err);
  }
});
