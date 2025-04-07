document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("inventoryTable");
    const addBtn = document.getElementById("addItemBtn");
    const modal = document.getElementById("itemModal");
    const closeModal = document.getElementById("closeModal");
    const form = document.getElementById("itemForm");
    const editIndexInput = document.getElementById("editIndex");
  
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
  
    const openModal = (editMode = false, row = null) => {
      modal.classList.remove("hidden");
      if (editMode && row) {
        const cells = row.querySelectorAll("td");
        inputs.name.value = cells[0].textContent;
        inputs.category.value = cells[1].textContent;
        inputs.qty.value = cells[2].textContent;
        inputs.cost.value = cells[3].textContent;
        inputs.supplier.value = cells[4].textContent;
        inputs.reorder.value = cells[5].textContent;
        inputs.location.value = cells[6].textContent;
        inputs.sku.value = cells[7].textContent;
        inputs.packaging.value = cells[8].textContent;
        inputs.date.value = cells[9].textContent;
        inputs.usage.value = cells[10].textContent;
        editIndexInput.value = Array.from(tableBody.children).indexOf(row);
      } else {
        form.reset();
        editIndexInput.value = '';
      }
    };
  
    const closeModalFn = () => {
      modal.classList.add("hidden");
      form.reset();
      editIndexInput.value = '';
    };
  
    const createRow = (data) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.category}</td>
        <td>${data.qty}</td>
        <td>${data.cost}</td>
        <td>${data.supplier}</td>
        <td>${data.reorder}</td>
        <td>${data.location}</td>
        <td>${data.sku}</td>
        <td>${data.packaging}</td>
        <td>${data.date}</td>
        <td>${data.usage}</td>
        <td>
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        </td>
      `;
      return row;
    };
  
    const refreshActions = () => {
      document.querySelectorAll(".editBtn").forEach(btn => {
        btn.onclick = () => openModal(true, btn.closest("tr"));
      });
      document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.onclick = () => btn.closest("tr").remove();
      });
    };
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const itemData = {
        name: inputs.name.value,
        category: inputs.category.value,
        qty: inputs.qty.value,
        cost: inputs.cost.value,
        supplier: inputs.supplier.value,
        reorder: inputs.reorder.value,
        location: inputs.location.value,
        sku: inputs.sku.value,
        packaging: inputs.packaging.value,
        date: inputs.date.value,
        usage: inputs.usage.value,
      };
  
      const editIndex = editIndexInput.value;
      if (editIndex !== "") {
        const existingRow = tableBody.children[editIndex];
        const newRow = createRow(itemData);
        tableBody.replaceChild(newRow, existingRow);
      } else {
        const newRow = createRow(itemData);
        tableBody.appendChild(newRow);
      }
      refreshActions();
      closeModalFn();
    });
  
    addBtn.onclick = () => openModal();
    closeModal.onclick = closeModalFn;
  
    refreshActions();
  
    // Live search
    const searchInput = document.getElementById("search");
    const tableRows = document.querySelectorAll("#inventoryTable tr");
    searchInput.addEventListener("keyup", () => {
      const query = searchInput.value.toLowerCase();
      document.querySelectorAll("#inventoryTable tr").forEach(row => {
        const cells = row.getElementsByTagName("td");
        let found = Array.from(cells).some(cell =>
          cell.textContent.toLowerCase().includes(query)
        );
        row.style.display = found ? "" : "none";
      });
    });
  });
  