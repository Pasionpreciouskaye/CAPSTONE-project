document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with a "data-link" attribute
    const navElements = document.querySelectorAll("[data-link]");

    navElements.forEach((element) => {
        element.addEventListener("click", () => {
            const link = element.getAttribute("data-link");
            if (link) {
                window.location.href = link; // Navigate to the assigned page
            }
        });
    });
});
