const POCKETBASE_URL = 'http://127.0.0.1:8090';
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

// Open modal for adding
const openModalForAdd = () => {
  form.reset();
  editingItemId = null;
  modalTitle.textContent = "Add Item";
  modal.classList.remove("hidden");
  overlay.classList.add("active");
  formInputs.name.focus();
};

// Close modal
const closeModalFn = () => {
  modal.classList.add("hidden");
  overlay.classList.remove("active");
  form.reset();
  editingItemId = null;
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
      <td>${item.quantity}</td>
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

// Open modal to edit
const openEditModal = async (id) => {
  try {
    const item = await pb.collection("inventory").getOne(id);
    formInputs.name.value = item.name;
    formInputs.category.value = item.category || "";
    formInputs.quantity.value = item.quantity;
    formInputs.cost.value = item.cost;
    formInputs.sku.value = item.sku || "";

    editingItemId = id;
    modalTitle.textContent = "Edit Item";
    modal.classList.remove("hidden");
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

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: formInputs.name.value.trim(),
    category: formInputs.category.value.trim(),
    quantity: parseInt(formInputs.quantity.value),
    cost: parseFloat(formInputs.cost.value),
    sku: formInputs.sku.value.trim()
  };

  try {
    if (editingItemId) {
      await pb.collection("inventory").update(editingItemId, data);
    } else {
      await pb.collection("inventory").create(data);
    }
    closeModalFn();
    loadItems();
  } catch (err) {
    console.error("Error saving item:", err);
  }
});
