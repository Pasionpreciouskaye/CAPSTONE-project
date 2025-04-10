document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const rows = document.querySelectorAll("#transaction-body tr");
    const searchInput = document.getElementById("search-input");
    const noResultsMessage = document.getElementById("no-results-message");

    let currentFilter = 'all';

    function filterAndSearchRows() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let hasVisibleRows = false;

        rows.forEach(row => {
            const rowData = row.getAttribute('data-searchable')?.toLowerCase() || '';
            const isIncome = row.classList.contains('transaction-income');
            const isExpense = row.classList.contains('transaction-expense');
            const rowMatchesFilter =
                currentFilter === 'all' ||
                (currentFilter === 'income' && isIncome) ||
                (currentFilter === 'expense' && (isExpense || (!isIncome && !isExpense)));

            const rowMatchesSearch = searchTerm === '' || rowData.includes(searchTerm);

            if (rowMatchesFilter && rowMatchesSearch) {
                row.style.display = "table-row";
                hasVisibleRows = true;
            } else {
                row.style.display = "none";
            }
        });

        noResultsMessage.style.display = hasVisibleRows ? "none" : "block";
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            currentFilter = this.getAttribute("data-filter");
            filterAndSearchRows();
        });
    });

    searchInput.addEventListener("input", function () {
        filterAndSearchRows();
    });

    // Optional: Initial filter application on load if needed
    // filterAndSearchRows();

});