const ADMIN_ID = 7915740408;
const token = localStorage.getItem('access_token');
const userData = JSON.parse(localStorage.getItem('user_data'));

if (!token || !userData || userData.user_id != ADMIN_ID) {
    alert("Kirish taqiqlangan! Siz admin emassiz.");
    window.location.href = '../index.html'; 
}

// UI State
let truckTypes = [];

// DOM Elements
const truckList = document.getElementById('truck-list');
const truckForm = document.getElementById('truck-form');
const truckModal = document.getElementById('truck-modal');

// --- NAVIGATION ---
function showSection(id, el) {
    document.querySelectorAll('.sec').forEach(s => s.classList.remove('on'));
    document.getElementById(`sec-${id}`).classList.add('on');
    
    if (el) {
        document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('on'));
        el.classList.add('on');
    }
    
    // Page title update
    const titles = {
        dash: 'Dashboard <small>Tizim holati</small>',
        trucks: 'Mashina turlari <small>CRUD boshqaruvi</small>',
        profile: 'Profil <small>Shaxsiy ma\'lumotlar</small>'
    };
    document.getElementById('page-title').innerHTML = titles[id];

    if (id === 'trucks') fetchTrucks();
    if (id === 'profile') fetchProfile();
}

// --- TRUCK TYPES CRUD ---

async function fetchTrucks() {
    try {
        const res = await fetch('/drivers/truck-types', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        truckTypes = await res.json();
        renderTrucks();
        document.getElementById('count-truck-types').textContent = truckTypes.length;
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

function renderTrucks() {
    truckList.innerHTML = truckTypes.map(t => `
        <tr>
            <td class="mono">#${t.id}</td>
            <td class="bold">${t.name}</td>
            <td>${t.max_weight} kg</td>
            <td>${t.max_volume} m³</td>
            <td><span class="pill ${t.is_active ? 'p-ok' : 'p-no'}">${t.is_active ? 'Aktiv' : 'Nofaol'}</span></td>
            <td>
                <button class="btn btn-ghost btn-sm" onclick="editTruck(${t.id})">Tahrir</button>
                <button class="btn btn-red btn-sm" onclick="deleteTruck(${t.id})">O'chirish</button>
            </td>
        </tr>
    `).join('');
}

function openTruckModal(id = null) {
    truckModal.classList.add('show');
    truckForm.reset();
    document.getElementById('truck-id').value = id || '';
    document.getElementById('modal-title').textContent = id ? 'Tahrirlash' : 'Yangi mashina turi';
    
    if (id) {
        const t = truckTypes.find(x => x.id === id);
        if (t) {
            document.getElementById('truck-name').value = t.name;
            document.getElementById('truck-weight').value = t.max_weight;
            document.getElementById('truck-volume').value = t.max_volume;
            document.getElementById('truck-desc').value = t.description || '';
        }
    }
}

function closeTruckModal() {
    truckModal.classList.remove('show');
}

truckForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('truck-id').value;
    const body = {
        name: document.getElementById('truck-name').value,
        max_weight: parseFloat(document.getElementById('truck-weight').value),
        max_volume: parseFloat(document.getElementById('truck-volume').value),
        description: document.getElementById('truck-desc').value,
        is_active: true
    };

    const url = id ? `/drivers/truck-types/${id}` : '/drivers/truck-types';
    const method = id ? 'PATCH' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            closeTruckModal();
            fetchTrucks();
        } else {
            const data = await res.json();
            alert('Xato: ' + JSON.stringify(data.detail));
        }
    } catch (err) {
        alert('Server bilan aloqa uzildi');
    }
};

async function deleteTruck(id) {
    if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return;
    
    try {
        const res = await fetch(`/drivers/truck-types/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchTrucks();
    } catch (err) {
        alert('O\'chirishda xatolik');
    }
}

function editTruck(id) {
    openTruckModal(id);
}

// --- PROFILE ---

async function fetchProfile() {
    try {
        const res = await fetch('/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        document.getElementById('prof-name').value = data.full_name;
        document.getElementById('prof-phone').value = data.phone_number;
        document.getElementById('prof-email').value = data.email || '';
        
        // Update sidebar info
        document.getElementById('user-full-name').textContent = data.full_name;
        document.getElementById('user-initials').textContent = data.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
        document.getElementById('user-role').textContent = data.role.toUpperCase();
        
        document.getElementById('count-users').textContent = '1'; // Placeholder
    } catch (err) {
        console.error('Profile fetch error');
    }
}

document.getElementById('profile-form').onsubmit = async (e) => {
    e.preventDefault();
    const body = {
        full_name: document.getElementById('prof-name').value,
        email: document.getElementById('prof-email').value
    };

    try {
        const res = await fetch('/auth/me', {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (res.ok) alert('Profil yangilandi');
    } catch (err) {
        alert('Xatolik yuz berdi');
    }
};

function logout() {
    localStorage.clear();
    window.location.href = '../index.html';
}

// Initial load
fetchProfile();
