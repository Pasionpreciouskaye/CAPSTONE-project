const POCKETBASE_URL = 'http://127.0.0.1:8090';
let pb = new PocketBase(POCKETBASE_URL);

// DOM elements
const form = document.getElementById("itemForm");
const modal = document.getElementById("itemModal");
const overlay = document.getElementById("overlay");
const closeModal = document.getElementById("closeModal");
const addBtn = document.getElementById("addItemBtn");
const modalTitle = document.getElementById("modalTitle");
const itemTableBody = document.getElementById("inventoryTable");
const submitBtn = document.getElementById("submitBtn");

const formInputs = {
  name: document.getElementById("itemName"),
  quantity: document.getElementById("itemQuantity"),
  unit: document.getElementById("itemUnit"),
  condition: document.getElementById("itemCondition"),
};

let editingItemId = null;
let highlightRowId = null;

// Open modal for adding item
const openModalForAdd = () => {
  form.reset();
  modalTitle.textContent = 'Add Item';
  modal.classList.remove("hidden");
  overlay.classList.add("active");
  editingItemId = null;
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
addBtn.addEventListener("click", openModalForAdd);
closeModal.addEventListener("click", closeModalFn);
overlay.addEventListener("click", closeModalFn);

// Load items and render them
const loadItems = async () => {
  try {
    const records = await pb.collection('inventory').getFullList({
      sort: '+name'
    });
    renderItems(records);
  } catch (error) {
    console.error("Failed to load items:", error);
  }
};

// Render items to the table
const renderItems = (items) => {
  itemTableBody.innerHTML = "";
  items.forEach(item => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", item.id);

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.unit}</td>
      <td>${item.condition}</td>
      <td>
        <button class="edit-btn" data-id="${item.id}">Edit</button>
        <button class="delete-btn" data-id="${item.id}">Delete</button>
      </td>
    `;

    if (item.id === highlightRowId) {
      row.classList.add("highlight");
      setTimeout(() => row.classList.remove("highlight"), 2000);
    }

    itemTableBody.appendChild(row);
  });

  // Attach event listeners to buttons
  document.querySelectorAll(".edit-btn").forEach(btn =>
    btn.addEventListener("click", e => openEditModal(e.target.dataset.id))
  );

  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", e => deleteItem(e.target.dataset.id))
  );
};

// Open modal for editing
const openEditModal = async (id) => {
  try {
    const item = await pb.collection("inventory").getOne(id);
    formInputs.name.value = item.name;
    formInputs.quantity.value = item.quantity;
    formInputs.unit.value = item.unit;
    formInputs.condition.value = item.condition;
    editingItemId = item.id;

    modalTitle.textContent = "Edit Item";
    modal.classList.remove("hidden");
    overlay.classList.add("active");
    formInputs.name.focus();
  } catch (error) {
    console.error("Error loading item:", error);
  }
};

// Delete item
const deleteItem = async (id) => {
  if (confirm("Are you sure you want to delete this item?")) {
    try {
      await pb.collection("inventory").delete(id);
      loadItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
};

// Form submission (add/edit)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: formInputs.name.value.trim(),
    quantity: parseInt(formInputs.quantity.value),
    unit: formInputs.unit.value.trim(),
    condition: formInputs.condition.value.trim(),
  };

  try {
    submitBtn.disabled = true;
    if (editingItemId) {
      await pb.collection("inventory").update(editingItemId, data);
      highlightRowId = editingItemId;
    } else {
      const newItem = await pb.collection("inventory").create(data);
      highlightRowId = newItem.id;
    }
    closeModalFn();
    loadItems();
  } catch (error) {
    console.error("Error saving item:", error);
  } finally {
    submitBtn.disabled = false;
  }
});

// Initial load
loadItems();
