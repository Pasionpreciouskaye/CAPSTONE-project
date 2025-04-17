const pb = new PocketBase("http://127.0.0.1:8090");
if (!pb.authStore.isValid) {
    location.href="landing.html"
} 

document.addEventListener('DOMContentLoaded', () => {
    const sampleUserData = {
        name: "Mark Admin",
    };

    const sampleStats = {
        totalMembers: 5423,
        totalMembersChange: 8,
        newMembers: 1893,
        newMembersChange: -3,
        activeMembers: 189,
    };

    let sampleMembers = [
        { id: 1, name: "Jasmin Ferolino", age: 20, phone: "09380170854", email: "jasminferolino18@gmail.com", gender: "Female", status: "Active", joined: "2024-04-01" },
        { id: 2, name: "Jerry Velasco", age: 21, phone: "09380170854", email: "jerryvelasco@gmail.com", gender: "Male", status: "Active", joined: "2024-04-05" },
        { id: 3, name: "Jhay Dominique Velasco", age: 21, phone: "09380170854", email: "jhayvelasco@gmail.com", gender: "Male", status: "Inactive", joined: "2024-03-15" },
        { id: 4, name: "Gigi Asetre", age: 22, phone: "09380170854", email: "asetregigi@gmail.com", gender: "Female", status: "Active", joined: "2024-04-08" },
        { id: 5, name: "Angelica Ignacio", age: 23, phone: "09380170854", email: "anggeignco@gmail.com", gender: "Female", status: "Pending", joined: "2024-02-20" },
    ];

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

    function updateUserInfo(userData) {
        if (userNameSpan) {
            userNameSpan.textContent = userData.name.split(' ')[0];
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
             if(icon) icon.className = 'fas fa-minus';
            element.childNodes[element.childNodes.length - 1].nodeValue = ` No change this month`;
        }
    }


    function renderMembersTable(members) {
        if (!membersTableBody) return;
        membersTableBody.innerHTML = '';

        if (members.length === 0) {
            // Use the CSS class instead of inline styles
            membersTableBody.innerHTML = '<tr><td colspan="7" class="table-placeholder-message">No members found.</td></tr>';
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

        addActionButtonListeners();
    }

     function addActionButtonListeners() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                console.log(`Edit member with ID: ${id}`);
                 alert(`Edit member ID: ${id}`);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                console.log(`Delete member with ID: ${id}`);
                 if(confirm(`Are you sure you want to delete member ID: ${id}?`)) {
                     alert(`Deleting member ID: ${id}`);
                     const index = sampleMembers.findIndex(m => m.id == id);
                     if (index > -1) {
                          sampleMembers.splice(index, 1);
                          filterAndSortMembers();
                     }
                 }
            });
        });
    }

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
                      return a.name.localeCompare(b.name);
                 });
                 break;
               case 'recent':
             default:
                 filteredMembers.sort((a, b) => (b.id || 0) - (a.id || 0));
                 break;
        }

        renderMembersTable(filteredMembers);
    }

    updateUserInfo(sampleUserData);
    updateStats(sampleStats);
    filterAndSortMembers();

    if (memberSearchInput) {
        memberSearchInput.addEventListener('input', filterAndSortMembers);
    }
    if (memberSortSelect) {
        memberSortSelect.addEventListener('change', filterAndSortMembers);
    }

    const addMemberBtn = document.querySelector('.add-member-btn');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', () => {
            alert("Add Member button clicked! Implement form/modal here.");
        });
    }

});