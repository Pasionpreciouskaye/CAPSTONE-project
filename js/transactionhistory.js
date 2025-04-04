document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const rows = document.querySelectorAll("tbody tr");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            const filter = this.getAttribute("data-filter");
            rows.forEach(row => {
                if (filter === "all") {
                    row.style.display = "table-row";
                } else {
                    row.classList.contains("expense") ? row.style.display = "table-row" : row.style.display = "none";
                }
            });
        });
    });
});
