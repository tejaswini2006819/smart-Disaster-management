// Initial LocalStorage Data setup
let currentRiskLevel = localStorage.getItem('riskLevel') || 'MEDIUM';

let reports = JSON.parse(localStorage.getItem('reports')) || [
    { id: 1, time: '10:30 AM', user: 'Alex Johnson', type: 'Flood', location: 'Riverfront Rd', desc: 'Water entering homes in sector 2', status: 'Pending' }
];

let shelters = JSON.parse(localStorage.getItem('shelters')) || [
    { id: 1, name: 'City Community Center', location: 'Central Avenue 4th Block', capacity: 300, current: 85 },
    { id: 2, name: 'St. Mary High School Gym', location: 'North District', capacity: 600, current: 140 }
];

let volunteers = JSON.parse(localStorage.getItem('volunteers')) || [
    { id: 1, name: 'Sarah Connor', phone: '9876543210', skill: 'First Aid & Medical Support', avail: 'Immediate', status: 'Approved' }
];

let currentUser = null;

function saveData() {
    localStorage.setItem('riskLevel', currentRiskLevel);
    localStorage.setItem('reports', JSON.stringify(reports));
    localStorage.setItem('shelters', JSON.stringify(shelters));
    localStorage.setItem('volunteers', JSON.stringify(volunteers));
}

// Tab Switching for Auth
function switchTab(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if(type === 'user') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('user-login-form').classList.remove('hidden');
        document.getElementById('admin-login-form').classList.add('hidden');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('admin-login-form').classList.remove('hidden');
        document.getElementById('user-login-form').classList.add('hidden');
    }
}

// User Login Function
function handleUserLogin(e) {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    currentUser = { name, phone, role: 'user' };
    showUserDashboard();
}

// Admin Login Function
function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    if (user === 'admin' && pass === 'admin123') {
        currentUser = { name: 'Administrator', role: 'admin' };
        showAdminDashboard();
    } else {
        alert('Invalid Admin Credentials! (Use default: admin / admin123)');
    }
}

function logout() {
    currentUser = null;
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('user-dashboard').classList.remove('active');
    document.getElementById('admin-dashboard').classList.remove('active');
    document.getElementById('logout-btn').classList.add('hidden');
    document.getElementById('user-display').innerText = '';
}

// Dashboard Display Controllers
function showUserDashboard() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('active');
    document.getElementById('logout-btn').classList.remove('hidden');
    document.getElementById('user-display').innerText = `Logged in: ${currentUser.name} (Citizen)`;

    renderUserRisk();
    renderUserShelters();
}

function showAdminDashboard() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('active');
    document.getElementById('logout-btn').classList.remove('hidden');
    document.getElementById('user-display').innerText = `Logged in: Admin`;

    renderAdminDashboard();
}

// Citizen Dashboard Functionality
function renderUserRisk() {
    const banner = document.getElementById('risk-banner');
    const text = document.getElementById('user-risk-text');
    const desc = document.getElementById('risk-desc');

    banner.className = 'risk-banner ';
    text.innerText = currentRiskLevel;

    if (currentRiskLevel === 'LOW') {
        banner.classList.add('risk-low');
        desc.innerText = 'No severe weather or disaster warnings in your immediate area.';
    } else if (currentRiskLevel === 'MEDIUM') {
        banner.classList.add('risk-medium');
        desc.innerText = 'Moderate risk detected. Keep emergency kit ready and remain cautious.';
    } else {
        banner.classList.add('risk-high');
        desc.innerText = 'CRITICAL RISK LEVEL! Evacuate to safe shelters or request Emergency SOS immediately!';
    }
}

function renderUserShelters() {
    const list = document.getElementById('user-shelter-list');
    list.innerHTML = shelters.map(s => `
        <li>
            <strong>${s.name}</strong><br>
            📍 Location: ${s.location}<br>
            👥 Occupancy: ${s.current}/${s.capacity} Occupied
        </li>
    `).join('');
}

// ONE-CLICK EMERGENCY SOS WITH GEOLOCATION
function triggerSOS() {
    const statusEl = document.getElementById('sos-status');
    statusEl.innerText = "Requesting GPS access...";
    statusEl.style.color = "var(--primary)";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                const mapUrl = `https://maps.google.com/?q=${lat},${lon}`;
                
                reports.unshift({
                    id: Date.now(),
                    time: new Date().toLocaleTimeString(),
                    user: currentUser ? currentUser.name : 'Unknown Citizen',
                    type: 'EMERGENCY SOS 🚨',
                    location: `GPS: ${lat}, ${lon}`,
                    desc: `SOS Signal Received! Google Map: <a href="${mapUrl}" target="_blank">View Map Location</a>`,
                    status: 'SOS Urgent'
                });

                saveData();
                statusEl.innerText = "🚨 Emergency SOS Sent! Your precise location has been sent to Admin.";
                statusEl.style.color = "var(--danger)";
            },
            (error) => {
                reports.unshift({
                    id: Date.now(),
                    time: new Date().toLocaleTimeString(),
                    user: currentUser ? currentUser.name : 'Unknown Citizen',
                    type: 'EMERGENCY SOS 🚨',
                    location: 'Location Unavailable',
                    desc: 'SOS Triggered without GPS Coordinates.',
                    status: 'SOS Urgent'
                });

                saveData();
                statusEl.innerText = "🚨 Emergency SOS Sent (Location permission denied).";
                statusEl.style.color = "var(--danger)";
            }
        );
    } else {
        alert("Geolocation service is not supported by your browser.");
    }
}

function handleReportDisaster(e) {
    e.preventDefault();
    const type = document.getElementById('report-type').value;
    const location = document.getElementById('report-location').value;
    const desc = document.getElementById('report-desc').value;

    reports.unshift({
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        user: currentUser.name,
        type: type,
        location: location,
        desc: desc,
        status: 'Pending'
    });

    saveData();
    alert('Incident Report successfully submitted!');
    e.target.reset();
}

function handleVolunteerRegister(e) {
    e.preventDefault();
    const skill = document.getElementById('volunteer-skill').value;
    const avail = document.getElementById('volunteer-avail').value;

    volunteers.unshift({
        id: Date.now(),
        name: currentUser.name,
        phone: currentUser.phone,
        skill: skill,
        avail: avail,
        status: 'Pending Approval'
    });

    saveData();
    alert('Application submitted! Admin will contact you shortly.');
    e.target.reset();
}

// Admin Dashboard Functionality
function renderAdminDashboard() {
    renderAdminReports();
    renderAdminShelters();
    renderAdminVolunteers();
}

function updateRiskLevel(level) {
    currentRiskLevel = level;
    saveData();
    alert(`Global Disaster Risk Level updated to: ${level}`);
}

function renderAdminReports() {
    const table = document.getElementById('admin-reports-table');
    table.innerHTML = reports.map(r => `
        <tr>
            <td>${r.time}</td>
            <td>${r.user}</td>
            <td><strong>${r.type}</strong></td>
            <td>${r.location}</td>
            <td>${r.desc}</td>
            <td><span class="status-badge ${r.status === 'SOS Urgent' ? 'status-sos' : (r.status === 'Resolved' ? 'status-resolved' : 'status-pending')}">${r.status}</span></td>
            <td>
                ${r.status !== 'Resolved' ? `<button class="btn btn-success" style="padding: 3px 8px; font-size: 0.8rem;" onclick="resolveReport(${r.id})">Resolve</button>` : 'Resolved'}
            </td>
        </tr>
    `).join('');
}

function resolveReport(id) {
    reports = reports.map(r => r.id === id ? { ...r, status: 'Resolved' } : r);
    saveData();
    renderAdminReports();
}

function handleAddShelter(e) {
    e.preventDefault();
    const name = document.getElementById('shelter-name').value;
    const loc = document.getElementById('shelter-loc').value;
    const cap = document.getElementById('shelter-cap').value;

    shelters.push({ id: Date.now(), name, location: loc, capacity: cap, current: 0 });
    saveData();
    renderAdminShelters();
    e.target.reset();
}

function renderAdminShelters() {
    const list = document.getElementById('admin-shelter-list');
    list.innerHTML = shelters.map(s => `
        <li>
            <strong>${s.name}</strong> (${s.location})<br>
            Capacity: ${s.current}/${s.capacity}
            <button class="btn btn-danger" style="padding: 2px 6px; font-size: 0.75rem; float: right;" onclick="deleteShelter(${s.id})">Remove</button>
        </li>
    `).join('');
}

function deleteShelter(id) {
    shelters = shelters.filter(s => s.id !== id);
    saveData();
    renderAdminShelters();
}

function renderAdminVolunteers() {
    const table = document.getElementById('admin-volunteers-table');
    table.innerHTML = volunteers.map(v => `
        <tr>
            <td>${v.name}</td>
            <td>${v.phone}</td>
            <td>${v.skill}</td>
            <td>${v.avail}</td>
            <td><span class="status-badge ${v.status === 'Approved' ? 'status-resolved' : 'status-pending'}">${v.status}</span></td>
            <td>
                ${v.status !== 'Approved' ? `<button class="btn btn-primary" style="padding: 3px 8px; font-size: 0.8rem;" onclick="approveVolunteer(${v.id})">Approve</button>` : 'Approved'}
            </td>
        </tr>
    `).join('');
}

function approveVolunteer(id) {
    volunteers = volunteers.map(v => v.id === id ? { ...v, status: 'Approved' } : v);
    saveData();
    renderAdminVolunteers();
}