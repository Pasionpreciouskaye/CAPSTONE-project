document.addEventListener("DOMContentLoaded", () => {
    // Initialize PocketBase
    const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your PocketBase URL if different
    
    // DOM Elements
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const addBudgetBtn = document.querySelector('.add-budget-btn');
    const modal = document.getElementById("addBudgetModal");
    const closeBtn = document.querySelector(".close-btn");
    const budgetForm = document.getElementById("budgetForm");
    const budgetTableBody = document.getElementById("budgetBody");
    const ctx = document.getElementById("expenseChart")?.getContext("2d");
    
    // Global variables
    let currentChart; // To hold the chart instance
    let currentBudgetData = []; // Store current budget data for calculations

    // ========== MODAL FUNCTIONS ==========
    function openModal() {
        modal.classList.add("show");
        budgetForm.reset(); // Clear form when opening
        budgetForm.dataset.editId = ''; // Clear any existing edit ID
        
        // Set today's date as default for date fields
        const today = new Date().toISOString().split('T')[0];
        if (document.getElementById("dateAllocated")) {
            document.getElementById("dateAllocated").value = today;
        }
        if (document.getElementById("dateSpent")) {
            document.getElementById("dateSpent").value = today;
        }
        
        // Update modal title
        const modalTitle = document.querySelector('.modal-content h3');
        if (modalTitle) {
            modalTitle.textContent = 'Add Budget';
        }
    }

    function closeModal() {
        modal.classList.remove("show");
    }

    // ========== DATA MANAGEMENT FUNCTIONS ==========
    async function fetchBudgetData() {
        try {
            const records = await pb.collection('budget').getFullList({
                sort: '-created',
            });
            currentBudgetData = records; // Store for later use
            updateBudgetTable(records);
            updateBudgetChart(records);
            updateSummaryCards(records);
            return records;
        } catch (error) {
            console.error("Error fetching budget data:", error);
            showNotification("Failed to load budget data. Please try again.", true);
            return [];
        }
    }

    function updateBudgetTable(data) {
        if (!budgetTableBody) return;
        
        budgetTableBody.innerHTML = '';
        
        if (data.length === 0) {
            const emptyRow = budgetTableBody.insertRow();
            emptyRow.innerHTML = `
                <td colspan="7" class="empty-message">No budget items found. Click "Add Budget" to create one.</td>
            `;
            return;
        }
        
        data.forEach(record => {
            const remaining = parseFloat(record.allocated) - parseFloat(record.spent);
            const remainingClass = remaining < 0 ? 'negative' : '';
            
            const row = budgetTableBody.insertRow();
            row.innerHTML = `
                <td>${record.category}</td>
                <td>₱${parseFloat(record.allocated).toLocaleString('en-PH')}</td>
                <td>₱${parseFloat(record.spent).toLocaleString('en-PH')}</td>
                <td class="${remainingClass}">₱${remaining.toLocaleString('en-PH')}</td>
                <td>${formatDate(record.dateAllocated)}</td>
                <td>${formatDate(record.dateSpent)}</td>
                <td>
                    <button class="btn btn-edit" data-id="${record.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-delete" data-id="${record.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    function updateBudgetChart(data) {
        if (!ctx) return;

        // Initialize object to store category expenses
        const categoryExpenses = {};
        
        // Calculate total spent per category
        data.forEach(item => {
            if (categoryExpenses[item.category]) {
                categoryExpenses[item.category] += parseFloat(item.spent);
            } else {
                categoryExpenses[item.category] = parseFloat(item.spent);
            }
        });

        const labels = Object.keys(categoryExpenses);
        const amounts = Object.values(categoryExpenses);
        
        // Create color palette - using predefined colors for consistency
        const colorPalette = [
            'rgba(91, 33, 182, 0.8)',   // purple
            'rgba(244, 114, 182, 0.8)',  // pink
            'rgba(16, 185, 129, 0.8)',   // green
            'rgba(245, 158, 11, 0.8)',   // orange
            'rgba(59, 130, 246, 0.8)',   // blue
            'rgba(239, 68, 68, 0.8)',    // red
            'rgba(107, 114, 128, 0.8)',  // gray
            'rgba(168, 85, 247, 0.8)',   // purple-lighter
            'rgba(236, 72, 153, 0.8)',   // pink-lighter
        ];
        
        // Generate background and border colors
        const backgroundColors = labels.map((_, index) => 
            colorPalette[index % colorPalette.length]
        );
        
        const borderColors = backgroundColors.map(color => 
            color.replace('0.8', '1')
        );

        // Destroy previous chart if it exists
        if (currentChart) {
            currentChart.destroy();
        }

        // Create new chart
        currentChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    label: "Total Expense by Category",
                    data: amounts,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 2,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Total Expense by Category',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `₱${value.toLocaleString('en-PH')} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    function updateSummaryCards(data) {
        // Calculate totals
        let totalAllocated = 0;
        let totalSpent = 0;
        
        data.forEach(item => {
            totalAllocated += parseFloat(item.allocated);
            totalSpent += parseFloat(item.spent);
        });
        
        const totalRemaining = totalAllocated - totalSpent;
        
        // Update DOM elements if they exist
        const totalAllocatedEl = document.getElementById('totalAllocated');
        const totalSpentEl = document.getElementById('totalSpent');
        const totalRemainingEl = document.getElementById('totalRemaining');
        
        if (totalAllocatedEl) {
            totalAllocatedEl.textContent = `₱${totalAllocated.toLocaleString('en-PH')}`;
        }
        
        if (totalSpentEl) {
            totalSpentEl.textContent = `₱${totalSpent.toLocaleString('en-PH')}`;
        }
        
        if (totalRemainingEl) {
            totalRemainingEl.textContent = `₱${totalRemaining.toLocaleString('en-PH')}`;
            // Add class based on value
            totalRemainingEl.className = totalRemaining < 0 ? 'negative' : 'positive';
        }
    }

    // ========== FORM HANDLERS ==========
    async function handleFormSubmit(e) {
        e.preventDefault();

        // Get form values
        const category = document.getElementById("category").value;
        const allocated = parseFloat(document.getElementById("allocated").value);
        const spent = parseFloat(document.getElementById("spent").value);
        const dateAllocated = document.getElementById("dateAllocated").value;
        const dateSpent = document.getElementById("dateSpent").value;
        const editId = budgetForm.dataset.editId;

        // Form validation
        if (!category || isNaN(allocated) || isNaN(spent) || !dateAllocated || !dateSpent) {
            showNotification("Please fill in all required fields correctly.", true);
            return;
        }

        // Create data object
        const data = {
            category: category,
            allocated: allocated,
            spent: spent,
            dateAllocated: dateAllocated,
            dateSpent: dateSpent,
        };

        try {
            if (editId) {
                // Update existing record
                await pb.collection('budget').update(editId, data);
                showNotification(`Budget item "${category}" updated successfully!`);
            } else {
                // Create new record
                const record = await pb.collection('budget').create(data);
                showNotification(`New budget item "${category}" created successfully!`);
            }
            
            // Reset form, refresh data, and close modal
            budgetForm.reset();
            budgetForm.dataset.editId = '';
            await fetchBudgetData();
            closeModal();
        } catch (error) {
            console.error("Error saving budget item:", error);
            showNotification(`Failed to save budget item: ${error.message}`, true);
        }
    }

    async function handleDelete(id) {
        if (!id) return;
        
        // Find the item to get its category for the notification
        const itemToDelete = currentBudgetData.find(item => item.id === id);
        const categoryName = itemToDelete ? itemToDelete.category : "Item";
        
        if (confirm(`Are you sure you want to delete the budget item "${categoryName}"?`)) {
            try {
                await pb.collection('budget').delete(id);
                showNotification(`Budget item "${categoryName}" deleted successfully!`);
                await fetchBudgetData(); // Refresh data
            } catch (error) {
                console.error("Error deleting budget item:", error);
                showNotification(`Failed to delete budget item: ${error.message}`, true);
            }
        }
    }

    async function handleEdit(id) {
        if (!id) return;
        
        try {
            const record = await pb.collection('budget').getOne(id);
            
            // Fill form with record data
            document.getElementById("category").value = record.category;
            document.getElementById("allocated").value = record.allocated;
            document.getElementById("spent").value = record.spent;
            document.getElementById("dateAllocated").value = record.dateAllocated;
            document.getElementById("dateSpent").value = record.dateSpent;
            
            // Set edit ID and update modal title
            budgetForm.dataset.editId = id;
            document.querySelector('.modal-content h3').textContent = `Edit Budget: ${record.category}`;
            
            // Open modal
            openModal();
        } catch (error) {
            console.error("Error fetching budget item for edit:", error);
            showNotification("Failed to load budget item for editing.", true);
        }
    }

    // ========== HELPER FUNCTIONS ==========
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        // Parse the date and format it
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        });
    }

    function showNotification(message, isError = false) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            
            const messageSpan = document.createElement('span');
            messageSpan.className = 'notification-message';
            
            const closeBtn = document.createElement('span');
            closeBtn.className = 'notification-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => {
                notification.classList.remove('show');
            });
            
            notification.appendChild(messageSpan);
            notification.appendChild(closeBtn);
            document.body.appendChild(notification);
        }
        
        // Update notification content and display
        const messageElement = notification.querySelector('.notification-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
        
        notification.className = 'notification';
        if (isError) {
            notification.classList.add('error');
        }
        
        notification.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // ========== EVENT LISTENERS ==========
    // Sidebar toggle for mobile
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    // Modal open button
    if (addBudgetBtn) {
        addBudgetBtn.addEventListener("click", openModal);
    }

    // Modal close button
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Close modal on outside click
    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // Form submission
    if (budgetForm) {
        budgetForm.addEventListener("submit", handleFormSubmit);
    }

    // Table actions (Edit/Delete) using event delegation
    if (budgetTableBody) {
        budgetTableBody.addEventListener("click", async (e) => {
            const target = e.target;
            const button = target.closest('button');
            
            if (!button) return;
            
            const id = button.dataset.id;
            
            if (button.classList.contains("btn-delete")) {
                await handleDelete(id);
            }
            
            if (button.classList.contains("btn-edit")) {
                await handleEdit(id);
            }
        });
    }

    // ========== SEARCH FUNCTIONALITY ==========
    const searchInput = document.getElementById('headerSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (!searchTerm) {
                // If search is empty, show all data
                updateBudgetTable(currentBudgetData);
                return;
            }
            
            // Filter data based on search term
            const filteredData = currentBudgetData.filter(item => 
                item.category.toLowerCase().includes(searchTerm) ||
                item.dateAllocated.includes(searchTerm) ||
                item.dateSpent.includes(searchTerm)
            );
            
            updateBudgetTable(filteredData);
        });
    }

    // ========== INITIALIZATION ==========
    // Fetch initial data on page load
    fetchBudgetData();
});