const pb = new PocketBase("http://127.0.0.1:8090"); // PocketBase connection

let allFeedbacks = [];
let filteredFeedbacks = [];

// Fetch feedbacks from PocketBase
async function fetchFeedbacks() {
  try {
    const records = await pb.collection("feedbacks").getFullList({ sort: "-created" });
    console.log("Fetched feedbacks:", records);

    // Fetching feedbacks and the user's name
    allFeedbacks = await Promise.all(records.map(async (r) => {
      console.log("Feedback user_id:", r.user_id);  // Log the user_id for debugging

      let userName = "Anonymous";  // Default user name changed to "Anonymous"

      if (r.user_id) {
        try {
          const user = await pb.collection("users").getOne(r.user_id);
          console.log("Fetched user:", user);  // Log the entire user object
          
          // Assuming 'name' is the correct field in the users collection, adjust this if it's different
          userName = user && user.name ? user.name : "Anonymous";  // Change 'name' if needed
        } catch (error) {
          console.error("Error fetching user for feedback ID:", r.id, error);
        }
      } else {
        console.log(`No user_id found for feedback ID: ${r.id}`);
      }

      return {
        id: r.id,
        subject: r.subject || "No Subject",
        message: r.message || "No Message",
        created: new Date(r.created),
        userName: userName, // Store the user's name
      };
    }));

    filteredFeedbacks = [...allFeedbacks];
    updateStats();
    renderFeedbacks(filteredFeedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    document.getElementById("messagesGrid").innerHTML = `<p>Failed to load feedbacks.</p>`;
  }
}

// Update feedback statistics
function updateStats() {
  const now = Date.now();
  const oneMonthAgo = now - (1000 * 60 * 60 * 24 * 30);

  const total = filteredFeedbacks.length;
  const newCount = filteredFeedbacks.filter(f => f.created.getTime() >= oneMonthAgo).length;

  const totalFeedbacksElement = document.getElementById("totalFeedbacks");
  const newFeedbacksElement = document.getElementById("newFeedbacks");
  const totalFeedbacksChangeElement = document.getElementById("totalFeedbacksChange");
  const newFeedbacksChangeElement = document.getElementById("newFeedbacksChange");

  if (totalFeedbacksElement) totalFeedbacksElement.textContent = total;
  if (newFeedbacksElement) newFeedbacksElement.textContent = newCount;

  if (totalFeedbacksChangeElement) {
    totalFeedbacksChangeElement.innerHTML = `<i class="fas fa-arrow-up"></i> ${total ? "100%" : "0%"} this month`;
  }
  if (newFeedbacksChangeElement) {
    newFeedbacksChangeElement.innerHTML = `<i class="fas fa-arrow-${newCount ? "up" : "down"}"></i> ${newCount ? "100%" : "0%"} this month`;
  }
}

// Render feedback cards
function renderFeedbacks(list) {
  const grid = document.getElementById("messagesGrid");
  if (!grid) return; // If the grid element is not found, do nothing.

  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML = `<p>No feedbacks found.</p>`;
    return;
  }

  list.forEach(fb => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-header">
        <div>
          <strong>${fb.subject}</strong>
          <p>By: ${fb.userName}</p> <!-- Display the user's name -->
          <p>${fb.created.toLocaleDateString()}</p>
        </div>
      </div>
      <p class="message">
        ${fb.message}
      </p>
    `;

    grid.appendChild(card);
  });
}

// Debounced search for feedbacks
let searchTimer;
const feedbackSearch = document.getElementById("feedbackSearch");

if (feedbackSearch) {
  feedbackSearch.addEventListener("input", e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const kw = e.target.value.toLowerCase();
      filteredFeedbacks = allFeedbacks.filter(fb =>
        fb.subject.toLowerCase().includes(kw) ||
        fb.message.toLowerCase().includes(kw)
      );
      renderFeedbacks(filteredFeedbacks);
    }, 300);
  });
}

// Fetch feedbacks on page load
fetchFeedbacks();

// Logout function
function logout() {
  window.location.href = "landing.html";
}
