// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Handle form submission
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.querySelector('input[placeholder="Your Name"]').value;
  const email = document.querySelector('input[placeholder="Your Email"]').value;
  const subject = document.querySelector('input[placeholder="Your Subject"]').value;
  const message = document.querySelector("textarea").value;

  if (name && email && subject && message) {
    alert("Thank you for your message, " + name + "! We'll get back to you soon.");
    this.reset();
  } else {
    alert("Please fill out all fields before submitting.");
  }
});
// Show/hide scroll-to-top button on scroll
window.onscroll = function () {
  showScrollButton();
};

function showScrollButton() {
  const scrollButton = document.getElementById("scrollTopBtn");
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    scrollButton.style.display = "block";
  } else {
    scrollButton.style.display = "none";
  }
}

// Scroll to top when button is clicked
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
