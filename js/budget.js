document.addEventListener("DOMContentLoaded", () => {
    const pb = new PocketBase('http://127.0.0.1:8090');  // Ensure PocketBase instance is running

    const addBudgetBtn = document.querySelector('.add-budget-btn');
    const modal = document.getElementById("addBudgetModal");
    const closeBtn = document.querySelector(".close-btn");
    const budgetForm = document.getElementById("budgetForm");
    const budgetTableBody = document.getElementById("budgetBody");
    const cancelButton = document.getElementById("cancelButton");

    let currentBudgetData = [];

    // Open Modal Function
    function openModal() {
        console.log("Opening modal for adding budget");
        modal.classList.add("show");
        budgetForm.reset();
        budgetForm.dataset.editId = '';

        const today = new Date().toISOString().split('T')[0];
        const dateAllocatedInput = document.getElementById("dateAllocated");
        const dateSpentInput = document.getElementById("dateSpent");

        if (dateAllocatedInput) dateAllocatedInput.value = today;
        if (dateSpentInput) dateSpentInput.value = today;

        const modalTitle = document.querySelector('#addBudgetModal .modal-content h3');
        if (modalTitle) modalTitle.textContent = 'Add Budget';
    }

    // Close Modal Function
    function closeModal() {
        console.log("Closing modal");
        modal.classList.remove("show");
    }

    // Event Listener to Open Modal
    if (addBudgetBtn) {
        addBudgetBtn.addEventListener("click", openModal);
    } else {
        console.error("Add Budget button not found!");
    }

    // Event Listener to Close Modal
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Cancel Button
    if (cancelButton) {
        cancelButton.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Fetch Budget Data from PocketBase
    async function fetchBudgetData() {
        console.log("Fetching budget data...");
        if (budgetTableBody) {
            budgetTableBody.innerHTML = `<tr class="loading-row"><td colspan="7" class="loading-message">Loading budget data...</td></tr>`;
        }

        try {
            const records = await pb.collection('budget').getFullList({ sort: '-created' });
            currentBudgetData = records;
            updateBudgetTable(records);
        } catch (error) {
            console.error("Error fetching budget data:", error);
            showNotification("Failed to load budget data. Please try again.", true);
        }
    }

    // Update Budget Table
    function updateBudgetTable(data) {
        console.log("Updating budget table with data:", data);
        budgetTableBody.innerHTML = '';
        if (data.length === 0) {
            const emptyRow = budgetTableBody.insertRow();
            emptyRow.innerHTML = `<td colspan="7" class="empty-message">No budget items found. Click "Add Budget" to create one.</td>`;
            emptyRow.querySelector('td').classList.add('empty-message');
        } else {
            data.forEach(record => {
                const allocated = parseFloat(record.allocated) || 0;
                const spent = parseFloat(record.spent) || 0;
                const remaining = allocated - spent;
                const remainingClass = remaining < 0 ? 'negative' : '';

                const row = budgetTableBody.insertRow();
                row.innerHTML = `
                    <td>${record.category || 'N/A'}</td>
                    <td>₱${allocated.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td>₱${spent.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td class="${remainingClass}">₱${remaining.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td>${formatDate(record.dateAllocated)}</td>
                    <td>${formatDate(record.dateSpent)}</td>
                    <td>
                        <button class="btn btn-edit" data-id="${record.id}"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-delete" data-id="${record.id}"><i class="fas fa-trash"></i> Delete</button>
                    </td>
                `;
            });
        }

        // Add Event Listeners for Edit and Delete buttons using Event Delegation
        budgetTableBody.addEventListener("click", async (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const id = button.getAttribute('data-id');

            if (button.classList.contains('btn-edit')) {
                console.log("Edit button clicked for ID:", id);
                const record = await pb.collection('budget').getOne(id);
                document.getElementById("category").value = record.category || '';
                document.getElementById("allocated").value = record.allocated || 0;
                document.getElementById("spent").value = record.spent || 0;
                document.getElementById("dateAllocated").value = new Date(record.dateAllocated).toISOString().split('T')[0];
                document.getElementById("dateSpent").value = new Date(record.dateSpent).toISOString().split('T')[0];
                budgetForm.dataset.editId = id;
                openModal();
            }

            if (button.classList.contains('btn-delete')) {
                console.log("Delete button clicked for ID:", id);
                if (confirm("Are you sure you want to delete this item?")) {
                    try {
                        await pb.collection('budget').delete(id);
                        console.log("Item deleted successfully");
                        showNotification("Budget item deleted successfully.");
                        await fetchBudgetData();  // Refresh the data
                    } catch (error) {
                        console.error("Error deleting item:", error);
                        showNotification("Failed to delete budget item.", true);
                    }
                }
            }
        });
    }

    // Format Date Function
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Handle Form Submission (Create/Update)
    async function handleFormSubmit(e) {
        e.preventDefault();
        const categoryInput = document.getElementById("category");
        const allocatedInput = document.getElementById("allocated");
        const spentInput = document.getElementById("spent");
        const dateAllocatedInput = document.getElementById("dateAllocated");
        const dateSpentInput = document.getElementById("dateSpent");

        const category = categoryInput.value.trim();
        const allocated = parseFloat(allocatedInput.value);
        const spent = parseFloat(spentInput.value);
        const dateAllocated = dateAllocatedInput.value;
        const dateSpent = dateSpentInput.value;
        const editId = budgetForm.dataset.editId;

        // Validate inputs
        if (!category) return markFieldInvalid(categoryInput, "Category is required.");
        if (isNaN(allocated) || allocated < 0) return markFieldInvalid(allocatedInput, "Allocated must be non-negative.");
        if (isNaN(spent) || spent < 0) return markFieldInvalid(spentInput, "Spent must be non-negative.");
        if (!dateAllocated) return markFieldInvalid(dateAllocatedInput, "Select allocation date.");
        if (!dateSpent) return markFieldInvalid(dateSpentInput, "Select spent date.");
        if (spent > allocated) return markFieldInvalid(spentInput, "Spent exceeds allocated amount.");

        // Format data for PocketBase
        const data = {
            category,
            allocated,
            spent,
            dateAllocated: new Date(dateAllocated).toISOString(),  // Ensure proper format
            dateSpent: new Date(dateSpent).toISOString()  // Ensure proper format
        };

        console.log("Submitting data:", data);

        const saveButton = budgetForm.querySelector('.btn-save');
        if (saveButton) saveButton.disabled = true;

        try {
            if (editId) {
                const response = await pb.collection('budget').update(editId, data);
                console.log("Budget item updated:", response);  // Log the response for debugging
                showNotification(`Budget item "${category}" updated successfully!`);
            } else {
                const response = await pb.collection('budget').create(data);  // Create new record
                console.log("New budget item created:", response);  // Log the response for debugging
                showNotification(`New budget item "${category}" created successfully!`);
            }

            budgetForm.reset();
            budgetForm.dataset.editId = '';
            await fetchBudgetData();  // Fetch the updated list of records
            closeModal();
        } catch (error) {
            console.error("Error saving budget item:", error);
            const errorMessage = error.data?.message || error.message || "Unknown error.";
            showNotification(`Failed to save budget item: ${errorMessage}`, true);
        } finally {
            if (saveButton) saveButton.disabled = false;
        }
    }

    if (budgetForm) budgetForm.addEventListener("submit", handleFormSubmit);

    // Show Notification Function
    function showNotification(message, isError = false) {
        const notification = document.getElementById('notification');
        const messageElement = notification.querySelector('.notification-message');

        if (messageElement) messageElement.textContent = message;
        notification.classList.toggle('error', isError);
        notification.classList.toggle('success', !isError);

        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    fetchBudgetData();  // Fetch data on initial load
});
