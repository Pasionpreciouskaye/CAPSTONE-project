document.addEventListener('DOMContentLoaded', () => {
    // --- Sample Data (Replace with actual data fetching) ---
    const sampleUserData = {
        name: "Mark Admin", // Replace with actual logged-in user name
    };

    const sampleStats = {
        totalMembers: 5423,
        totalMembersChange: 8, // Positive number for increase
        newMembers: 1893,
        newMembersChange: -3, // Negative number for decrease
        activeMembers: 189,
    };

    let sampleMembers = [
        { id: 1, name: "Jasmin Ferolino", age: 20, phone: "09380170854", email: "jasminferolino18@gmail.com", gender: "Female", status: "Active", joined: "2024-04-01" },
        { id: 2, name: "Jerry Velasco", age: 21, phone: "09380170854", email: "jerryvelasco@gmail.com", gender: "Male", status: "Active", joined: "2024-04-05" },
        { id: 3, name: "Jhay Dominique Velasco", age: 21, phone: "09380170854", email: "jhayvelasco@gmail.com", gender: "Male", status: "Inactive", joined: "2024-03-15" },
        { id: 4, name: "Gigi Asetre", age: 22, phone: "09380170854", email: "asetregigi@gmail.com", gender: "Female", status: "Active", joined: "2024-04-08" },
        { id: 5, name: "Angelica Ignacio", age: 23, phone: "09380170854", email: "anggeignco@gmail.com", gender: "Female", status: "Pending", joined: "2024-02-20" },
        // Add more sample members
    ];

    // --- Get DOM Elements ---
    const userNameSpan = document.getElementById('userName');
    const profileUserNameSpan = document.getElementById('profileUserName');
    const totalMembersEl = document.getElementById('totalMembers');
    const totalMembersChangeEl = document.getElementById('totalMembersChange');
    const newMembersEl = document.getElementById('newMembers');
    const newMembersChangeEl = document.getElementById('newMembersChange');
    const activeMembersEl = document.getElementById('activeMembers');
    const membersTableBody = document.getElementById('membersTableBody');
    const memberSearchInput = document.getElementById('memberSearch');
    const memberSortSelect = document.getElementById('memberSort');

    // --- Update UI Functions ---
    function updateUserInfo(userData) {
        if (userNameSpan) {
            userNameSpan.textContent = userData.name.split(' ')[0]; // Display first name
        }
         if (profileUserNameSpan) {
             profileUserNameSpan.textContent = userData.name;
        }
    }

    function updateStats(stats) {
        if (totalMembersEl) totalMembersEl.textContent = stats.totalMembers.toLocaleString();
        if (newMembersEl) newMembersEl.textContent = stats.newMembers.toLocaleString();
        if (activeMembersEl) activeMembersEl.textContent = stats.activeMembers.toLocaleString();

        if (totalMembersChangeEl) {
             updateChangeIndicator(totalMembersChangeEl, stats.totalMembersChange);
        }
        if (newMembersChangeEl) {
            updateChangeIndicator(newMembersChangeEl, stats.newMembersChange);
        }
    }

     function updateChangeIndicator(element, changeValue) {
        element.classList.remove('increase', 'decrease');
        const icon = element.querySelector('i');
        if (changeValue > 0) {
            element.classList.add('increase');
            if(icon) icon.className = 'fas fa-arrow-up';
            element.childNodes[element.childNodes.length - 1].nodeValue = ` ${Math.abs(changeValue)}% this month`;
        } else if (changeValue < 0) {
            element.classList.add('decrease');
             if(icon) icon.className = 'fas fa-arrow-down';
            element.childNodes[element.childNodes.length - 1].nodeValue = ` ${Math.abs(changeValue)}% this month`;
        } else {
            // Optional: handle zero change
             if(icon) icon.className = 'fas fa-minus'; // Example for no change
            element.childNodes[element.childNodes.length - 1].nodeValue = ` No change this month`;
        }
    }


    function renderMembersTable(members) {
        if (!membersTableBody) return;
        membersTableBody.innerHTML = ''; // Clear existing rows

        if (members.length === 0) {
            membersTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No members found.</td></tr>';
            return;
        }

        members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.name}</td>
                <td>${member.age}</td>
                <td>${member.phone}</td>
                <td>${member.email}</td>
                <td>${member.gender}</td>
                <td><span class="status-badge ${member.status.toLowerCase()}">${member.status}</span></td>
                <td class="action-buttons">
                    <button class="edit-btn" title="Edit Member" data-id="${member.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" title="Delete Member" data-id="${member.id}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            membersTableBody.appendChild(row);
        });

        // Add event listeners for action buttons (optional)
        addActionButtonListeners();
    }

     function addActionButtonListeners() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                console.log(`Edit member with ID: ${id}`);
                // Add your edit logic here (e.g., open a modal)
                 alert(`Edit member ID: ${id}`);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                console.log(`Delete member with ID: ${id}`);
                 // Add your delete logic here (e.g., show confirmation)
                 if(confirm(`Are you sure you want to delete member ID: ${id}?`)) {
                     alert(`Deleting member ID: ${id}`);
                     // Find index and remove from sampleMembers (for demo)
                     const index = sampleMembers.findIndex(m => m.id == id);
                     if (index > -1) {
                         sampleMembers.splice(index, 1);
                         filterAndSortMembers(); // Re-render the table
                     }
                 }
            });
        });
    }


    // --- Filtering and Sorting Logic ---
    function filterAndSortMembers() {
        const searchTerm = memberSearchInput ? memberSearchInput.value.toLowerCase() : '';
        const sortBy = memberSortSelect ? memberSortSelect.value : 'recent';

        let filteredMembers = sampleMembers.filter(member => {
            return (
                member.name.toLowerCase().includes(searchTerm) ||
                member.email.toLowerCase().includes(searchTerm) ||
                member.phone.includes(searchTerm)
            );
        });

        switch (sortBy) {
            case 'nameAsc':
                filteredMembers.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'nameDesc':
                filteredMembers.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'active':
                filteredMembers.sort((a, b) => {
                    if (a.status === 'Active' && b.status !== 'Active') return -1;
                    if (a.status !== 'Active' && b.status === 'Active') return 1;
                    // Optional: secondary sort by name if statuses are the same or neither is Active
                     return a.name.localeCompare(b.name);
                });
                break;
             case 'recent': // Assuming 'recent' means sort by ID descending or a join date
             default:
                  // Sort by ID descending for 'recent' (newest first) - Requires IDs to be sequential
                 filteredMembers.sort((a, b) => (b.id || 0) - (a.id || 0)); // Basic ID sort
                  // Or sort by date if you have it:
                 // filteredMembers.sort((a, b) => new Date(b.joined) - new Date(a.joined));
                 break;
        }

        renderMembersTable(filteredMembers);
    }

    // --- Initial Load ---
    updateUserInfo(sampleUserData);
    updateStats(sampleStats);
    filterAndSortMembers(); // Initial render of the table


    // --- Event Listeners ---
    if (memberSearchInput) {
        memberSearchInput.addEventListener('input', filterAndSortMembers);
    }
    if (memberSortSelect) {
        memberSortSelect.addEventListener('change', filterAndSortMembers);
    }

    // Add listener for the "Add Member" button (example)
    const addMemberBtn = document.querySelector('.add-member-btn');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', () => {
            alert("Add Member button clicked! Implement form/modal here.");
        });
    }

});