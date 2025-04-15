document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const rows = document.querySelectorAll("#transaction-body tr");
    const searchInput = document.getElementById("search-input");
    const noResultsMessage = document.getElementById("no-results-message");

    let currentFilter = 'all'; // Keep track of the active tab filter

    // Function to filter rows based on tab selection and search term
    function filterAndSearchRows() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let hasVisibleRows = false;

        rows.forEach(row => {
            const rowData = row.getAttribute('data-searchable')?.toLowerCase() || ''; // Use 'data-searchable'
            const isIncome = row.classList.contains('transaction-income');
            const isExpense = row.classList.contains('transaction-expense');
            // Assume rows without specific class are expenses for filtering purposes
            const rowMatchesFilter =
                currentFilter === 'all' ||
                (currentFilter === 'income' && isIncome) ||
                (currentFilter === 'expense' && (isExpense || (!isIncome && !isExpense))); // Include default as expense

            const rowMatchesSearch = searchTerm === '' || rowData.includes(searchTerm);

            // Show row only if it matches both the active tab filter AND the search term
            if (rowMatchesFilter && rowMatchesSearch) {
                row.style.display = "table-row";
                hasVisibleRows = true;
            } else {
                row.style.display = "none";
            }
        });

        // Show or hide the 'no results' message
        noResultsMessage.style.display = hasVisibleRows ? "none" : "block";
    }

    // --- Event Listeners ---

    // Tab filtering
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            // Update active tab style
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            // Update current filter and re-apply filtering/search
            currentFilter = this.getAttribute("data-filter");
            filterAndSearchRows();
        });
    });

    // Search input filtering
    searchInput.addEventListener("input", function () {
        // Re-apply filtering/search whenever search input changes
        filterAndSearchRows();
    });

    // Initial filter application on load (optional, defaults to 'all')
    // filterAndSearchRows(); // Uncomment if you want to filter immediately on load based on default active tab

});