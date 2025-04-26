
const pb = new PocketBase("http://127.0.0.1:8090");
let allMembers = [];
let filteredMembers = [];

// 2) Fetch members once authenticated
async function fetchMembers() {
  try {
    const users = await pb.collection("users").getFullList({ sort: "-created" });
    console.log("Fetched users:", users);

    allMembers = users
      .filter(u => u.role === "member")
      .map(u => {
        const dobDate = u.dob ? new Date(u.dob) : null;
        const age = dobDate ? Math.floor((Date.now() - dobDate.getTime())/(1000*60*60*24*365)) : "";
        const name = [u.firstName, u.middleName, u.lastName].filter(Boolean).join(" ");
        return {
          id: u.id,
          name,
          dob: u.dob || "",
          phone: u.phone,
          email: u.email,
          gender: u.gender,
          address: u.address,
          status: u.status || "Inactive",
          created: new Date(u.created),
        };
      });

    filteredMembers = [...allMembers];
    updateStats();
    renderMembersTable(filteredMembers);
  } catch (err) {
    console.error("Error fetching members:", err);
  }
}

function updateStats() {
  const now = Date.now();
  const oneMonthAgo = now - (1000*60*60*24*30);

  const total = filteredMembers.length;
  const newCount = filteredMembers.filter(m => m.created.getTime() >= oneMonthAgo).length;
  const activeCount = filteredMembers.filter(m => m.status.toLowerCase()==="active").length;

  document.getElementById("totalMembers").textContent = total;
  document.getElementById("newMembers").textContent = newCount;
  document.getElementById("activeMembers").textContent = activeCount;

  document.getElementById("totalMembersChange").innerHTML = `<i class="fas fa-arrow-up"></i> ${ total? "100%":"0%"} this month`;
  document.getElementById("newMembersChange").innerHTML   = `<i class="fas fa-arrow-${ newCount? "up":"down"}"></i> ${ newCount? "100%":"0%"} this month`;
}

function renderMembersTable(list) {
  const tbody = document.getElementById("membersTableBody");
  console.log(list)
  tbody.innerHTML = "";
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="9" class="table-placeholder-message">No members found.</td></tr>`;
    return;
  }
  list.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.name}</td>
      <td>${m.dob}</td>
      <td>${m.phone}</td>
      <td>${m.email}</td>
      <td>${m.gender}</td>
      <td>${m.address}</td>
      <td><span class="status-badge ${m.status==="Active"?"active":"inactive"}">${m.status}</span></td>
      <td>
        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
        <button class="action-btn delete"><i class="fas fa-trash"></i></button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// Debounced search
let searchTimer;
document.getElementById("memberSearch").addEventListener("input", e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const kw = e.target.value.toLowerCase();
    filteredMembers = allMembers.filter(m =>
      m.name.toLowerCase().includes(kw) ||
      m.email.toLowerCase().includes(kw) ||
      m.phone.toLowerCase().includes(kw)
    );
    renderMembersTable(filteredMembers);
  }, 300);
});

// Sort control
document.getElementById("memberSort").addEventListener("change", e => {
  const opt = e.target.value;
  let sorted = [...filteredMembers];
  if (opt==="nameAsc")   sorted.sort((a,b)=>a.name.localeCompare(b.name));
  if (opt==="nameDesc")  sorted.sort((a,b)=>b.name.localeCompare(a.name));
  if (opt==="active")    sorted.sort((a,b)=>b.status.localeCompare(a.status));
  if (opt==="recent")    sorted.sort((a,b)=>b.created - a.created);
  renderMembersTable(sorted);
});

fetchMembers();