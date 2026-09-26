// =====================================================
// DISASTER GUARD - MAIN JAVASCRIPT
// =====================================================


// ================= INITIAL DATA =================

let currentRiskLevel =
    localStorage.getItem("riskLevel") || "MEDIUM";


let riskLocation =
    localStorage.getItem("riskLocation") || "";


let reports =
    JSON.parse(localStorage.getItem("reports")) || [

        {
            id: 1,
            time: "10:30 AM",
            user: "Alex Johnson",
            type: "Flood",
            location: "Riverfront Rd",
            desc: "Water entering homes in sector 2",
            status: "Pending"
        }

    ];


let shelters =
    JSON.parse(localStorage.getItem("shelters")) || [

        {
            id: 1,
            name: "City Community Center",
            location: "Central Avenue 4th Block",
            capacity: 300,
            current: 85
        },

        {
            id: 2,
            name: "St. Mary High School Gym",
            location: "North District",
            capacity: 600,
            current: 140
        }

    ];


let volunteers =
    JSON.parse(localStorage.getItem("volunteers")) || [

        {
            id: 1,
            name: "Sarah Connor",
            phone: "9876543210",
            skill: "First Aid & Medical Support",
            avail: "Immediate",
            status: "Approved"
        }

    ];


let currentUser = null;


// ================= SAVE DATA =================

function saveData() {

    localStorage.setItem(
        "riskLevel",
        currentRiskLevel
    );

    localStorage.setItem(
        "riskLocation",
        riskLocation
    );

    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );

    localStorage.setItem(
        "shelters",
        JSON.stringify(shelters)
    );

    localStorage.setItem(
        "volunteers",
        JSON.stringify(volunteers)
    );

}



// ================= TAB SWITCHING =================

function switchTab(type) {

    document
        .querySelectorAll(".tab-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    if (type === "user") {

        document
            .querySelectorAll(".tab-btn")[0]
            .classList.add("active");


        document
            .getElementById("user-login-form")
            .classList.remove("hidden");


        document
            .getElementById("admin-login-form")
            .classList.add("hidden");

    }

    else {

        document
            .querySelectorAll(".tab-btn")[1]
            .classList.add("active");


        document
            .getElementById("admin-login-form")
            .classList.remove("hidden");


        document
            .getElementById("user-login-form")
            .classList.add("hidden");

    }

}



// ================= USER LOGIN =================

function handleUserLogin(e) {

    e.preventDefault();


    const name =
        document
            .getElementById("user-name")
            .value;


    const phone =
        document
            .getElementById("user-phone")
            .value;


    currentUser = {

        name: name,

        phone: phone,

        role: "user"

    };


    showUserDashboard();

}



// ================= ADMIN LOGIN =================

function handleAdminLogin(e) {

    e.preventDefault();


    const user =
        document
            .getElementById("admin-user")
            .value;


    const pass =
        document
            .getElementById("admin-pass")
            .value;


    if (
        user === "admin" &&
        pass === "admin123"
    ) {

        currentUser = {

            name: "Administrator",

            role: "admin"

        };


        showAdminDashboard();

    }

    else {

        alert(
            "Invalid Admin Credentials!\n\n" +
            "Username: admin\n" +
            "Password: admin123"
        );

    }

}



// ================= LOGOUT =================

function logout() {

    currentUser = null;


    document
        .getElementById("auth-screen")
        .classList.remove("hidden");


    document
        .getElementById("user-dashboard")
        .classList.remove("active");


    document
        .getElementById("admin-dashboard")
        .classList.remove("active");


    document
        .getElementById("logout-btn")
        .classList.add("hidden");


    document
        .getElementById("user-display")
        .innerText = "";

}



// ================= USER DASHBOARD =================

function showUserDashboard() {

    document
        .getElementById("auth-screen")
        .classList.add("hidden");


    document
        .getElementById("admin-dashboard")
        .classList.remove("active");


    document
        .getElementById("user-dashboard")
        .classList.add("active");


    document
        .getElementById("logout-btn")
        .classList.remove("hidden");


    document
        .getElementById("user-display")
        .innerText =
        `Logged in: ${currentUser.name} (Citizen)`;


    renderUserRisk();

    renderUserShelters();

    showEmergencyAlert();

}



// ================= ADMIN DASHBOARD =================

function showAdminDashboard() {

    document
        .getElementById("auth-screen")
        .classList.add("hidden");


    document
        .getElementById("user-dashboard")
        .classList.remove("active");


    document
        .getElementById("admin-dashboard")
        .classList.add("active");


    document
        .getElementById("logout-btn")
        .classList.remove("hidden");


    document
        .getElementById("user-display")
        .innerText =
        "Logged in: Admin";


    document
        .getElementById("risk-location")
        .value = riskLocation;


    renderAdminDashboard();

}



// =====================================================
// USER RISK LEVEL
// =====================================================

function renderUserRisk() {

    const banner =
        document.getElementById("risk-banner");


    const text =
        document.getElementById("user-risk-text");


    const desc =
        document.getElementById("risk-desc");


    banner.className =
        "risk-banner";


    text.innerText =
        currentRiskLevel;


    if (currentRiskLevel === "LOW") {

        banner.classList.add("risk-low");


        desc.innerText =
            "No severe disaster warnings in your immediate area.";

    }


    else if (currentRiskLevel === "MEDIUM") {

        banner.classList.add("risk-medium");


        desc.innerText =
            "Moderate risk detected. Keep your emergency kit ready and remain cautious.";

    }


    else {

        banner.classList.add("risk-high");


        desc.innerText =
            "CRITICAL RISK LEVEL! Check the emergency alert and move to a safe area.";

    }

}



// =====================================================
// 🚨 EMERGENCY ALERT
// =====================================================

function showEmergencyAlert() {

    const alertBox =
        document.getElementById(
            "emergency-alert"
        );


    const alertRisk =
        document.getElementById(
            "alert-risk-level"
        );


    const alertLocation =
        document.getElementById(
            "alert-location"
        );


    const alertMessage =
        document.getElementById(
            "alert-message"
        );


    const risk =
        localStorage.getItem(
            "riskLevel"
        ) || currentRiskLevel;


    const location =
        localStorage.getItem(
            "riskLocation"
        ) || "Location not specified";


    if (risk === "HIGH") {

        alertRisk.innerText =
            "HIGH 🚨";


        alertLocation.innerText =
            location;


        alertMessage.innerText =
            "A high-risk disaster situation has been reported " +
            "in this area. Please move to a safe location or " +
            "nearby shelter. Use the SOS button if you require " +
            "immediate emergency assistance.";


        alertBox
            .classList
            .remove("hidden");

    }

    else {

        alertBox
            .classList
            .add("hidden");

    }

}



// ================= CLOSE ALERT =================

function closeEmergencyAlert() {

    document
        .getElementById("emergency-alert")
        .classList
        .add("hidden");

}



// =====================================================
// SOS WITH GPS
// =====================================================

function triggerSOS() {

    const statusEl =
        document.getElementById("sos-status");


    statusEl.innerText =
        "Requesting GPS access...";


    statusEl.style.color =
        "var(--primary)";


    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            function(position) {

                const lat =
                    position.coords.latitude
                    .toFixed(4);


                const lon =
                    position.coords.longitude
                    .toFixed(4);


                const mapUrl =
                    `https://maps.google.com/?q=${lat},${lon}`;


                reports.unshift({

                    id: Date.now(),

                    time:
                        new Date()
                        .toLocaleTimeString(),

                    user:
                        currentUser
                            ? currentUser.name
                            : "Unknown Citizen",

                    type:
                        "EMERGENCY SOS 🚨",

                    location:
                        `GPS: ${lat}, ${lon}`,

                    desc:
                        `SOS Signal Received! ` +
                        `<a href="${mapUrl}" target="_blank">View Map Location</a>`,

                    status:
                        "SOS Urgent"

                });


                saveData();


                statusEl.innerText =
                    "🚨 Emergency SOS Sent! Your location has been sent to Admin.";


                statusEl.style.color =
                    "var(--danger)";

            },


            function(error) {

                reports.unshift({

                    id: Date.now(),

                    time:
                        new Date()
                        .toLocaleTimeString(),

                    user:
                        currentUser
                            ? currentUser.name
                            : "Unknown Citizen",

                    type:
                        "EMERGENCY SOS 🚨",

                    location:
                        "Location Unavailable",

                    desc:
                        "SOS Triggered without GPS Coordinates.",

                    status:
                        "SOS Urgent"

                });


                saveData();


                statusEl.innerText =
                    "🚨 Emergency SOS Sent. GPS permission was unavailable.";


                statusEl.style.color =
                    "var(--danger)";

            }

        );

    }

    else {

        alert(
            "Geolocation is not supported by your browser."
        );

    }

}



// =====================================================
// DISASTER REPORT
// =====================================================

function handleReportDisaster(e) {

    e.preventDefault();


    const type =
        document
            .getElementById("report-type")
            .value;


    const location =
        document
            .getElementById("report-location")
            .value;


    const desc =
        document
            .getElementById("report-desc")
            .value;


    reports.unshift({

        id: Date.now(),

        time:
            new Date()
            .toLocaleTimeString(),

        user:
            currentUser.name,

        type: type,

        location: location,

        desc: desc,

        status: "Pending"

    });


    saveData();


    alert(
        "Incident Report successfully submitted!"
    );


    e.target.reset();

}



// =====================================================
// VOLUNTEER REGISTRATION
// =====================================================

function handleVolunteerRegister(e) {

    e.preventDefault();


    const skill =
        document
            .getElementById("volunteer-skill")
            .value;


    const avail =
        document
            .getElementById("volunteer-avail")
            .value;


    volunteers.unshift({

        id: Date.now(),

        name:
            currentUser.name,

        phone:
            currentUser.phone,

        skill:
            skill,

        avail:
            avail,

        status:
            "Pending Approval"

    });


    saveData();


    alert(
        "Application submitted! Admin will contact you shortly."
    );


    e.target.reset();

}



// =====================================================
// 🚨 ADMIN RISK LEVEL
// =====================================================

function updateRiskLevel(level) {

    const locationInput =
        document.getElementById(
            "risk-location"
        );


    const location =
        locationInput.value.trim();


    if (location === "") {

        alert(
            "Please enter the affected location first."
        );


        locationInput.focus();


        return;

    }


    currentRiskLevel =
        level;


    riskLocation =
        location;


    localStorage.setItem(
        "riskLevel",
        currentRiskLevel
    );


    localStorage.setItem(
        "riskLocation",
        riskLocation
    );


    localStorage.setItem(
        "riskAlertActive",
        level === "HIGH"
    );


    saveData();


    if (level === "HIGH") {

        // Add an alert report for Admin
        reports.unshift({

            id: Date.now(),

            time:
                new Date()
                .toLocaleTimeString(),

            user:
                "ADMIN",

            type:
                "HIGH RISK ALERT 🚨",

            location:
                location,

            desc:
                "Admin has declared HIGH regional disaster risk.",

            status:
                "SOS Urgent"

        });


        saveData();


        alert(
            "🚨 HIGH RISK ALERT ACTIVATED!\n\n" +
            "Affected Location: " +
            location +
            "\n\n" +
            "Citizens should move to a safe location " +
            "or nearby shelter."
        );

    }

    else if (level === "MEDIUM") {

        localStorage.setItem(
            "riskAlertActive",
            "false"
        );


        alert(
            "⚠️ MEDIUM RISK LEVEL ACTIVATED!\n\n" +
            "Location: " +
            location
        );

    }

    else {

        localStorage.setItem(
            "riskAlertActive",
            "false"
        );


        alert(
            "✅ Risk level changed to LOW.\n\n" +
            "Location: " +
            location
        );

    }


    renderAdminDashboard();

}



// =====================================================
// ADMIN DASHBOARD
// =====================================================

function renderAdminDashboard() {

    renderAdminReports();

    renderAdminShelters();

    renderAdminVolunteers();

}



// =====================================================
// ADMIN REPORTS
// =====================================================

function renderAdminReports() {

    const table =
        document.getElementById(
            "admin-reports-table"
        );


    table.innerHTML =
        reports.map(function(r) {

            let statusClass =
                "status-pending";


            if (
                r.status === "SOS Urgent"
            ) {

                statusClass =
                    "status-sos";

            }

            else if (
                r.status === "Resolved"
            ) {

                statusClass =
                    "status-resolved";

            }


            return `

                <tr>

                    <td>
                        ${r.time}
                    </td>

                    <td>
                        ${r.user}
                    </td>

                    <td>
                        <strong>
                            ${r.type}
                        </strong>
                    </td>

                    <td>
                        ${r.location}
                    </td>

                    <td>
                        ${r.desc}
                    </td>

                    <td>

                        <span
                            class="status-badge ${statusClass}">

                            ${r.status}

                        </span>

                    </td>

                    <td>

                        ${
                            r.status !== "Resolved"

                            ?

                            `<button
                                class="btn btn-success"
                                style="
                                    padding:3px 8px;
                                    font-size:0.8rem;
                                "
                                onclick="resolveReport(${r.id})">

                                Resolve

                            </button>`

                            :

                            "Resolved"
                        }

                    </td>

                </tr>

            `;

        }).join("");

}



// =====================================================
// RESOLVE REPORT
// =====================================================

function resolveReport(id) {

    reports =
        reports.map(function(r) {

            if (r.id === id) {

                return {
                    ...r,
                    status: "Resolved"
                };

            }

            return r;

        });


    saveData();


    renderAdminReports();

}



// =====================================================
// ADD SHELTER
// =====================================================

function handleAddShelter(e) {

    e.preventDefault();


    const name =
        document
            .getElementById("shelter-name")
            .value;


    const loc =
        document
            .getElementById("shelter-loc")
            .value;


    const cap =
        document
            .getElementById("shelter-cap")
            .value;


    shelters.push({

        id: Date.now(),

        name: name,

        location: loc,

        capacity: Number(cap),

        current: 0

    });


    saveData();


    renderAdminShelters();


    e.target.reset();

}



// =====================================================
// ADMIN SHELTERS
// =====================================================

function renderAdminShelters() {

    const list =
        document.getElementById(
            "admin-shelter-list"
        );


    list.innerHTML =
        shelters.map(function(s) {

            return `

                <li>

                    <strong>
                        ${s.name}
                    </strong>

                    <br>

                    📍 ${s.location}

                    <br>

                    👥 Capacity:
                    ${s.current}/${s.capacity}


                    <button
                        class="btn btn-danger"
                        style="
                            padding:2px 6px;
                            font-size:0.75rem;
                            float:right;
                        "
                        onclick="deleteShelter(${s.id})">

                        Remove

                    </button>

                </li>

            `;

        }).join("");

}



// =====================================================
// DELETE SHELTER
// =====================================================

function deleteShelter(id) {

    shelters =
        shelters.filter(function(s) {

            return s.id !== id;

        });


    saveData();


    renderAdminShelters();

}



// =====================================================
// USER SHELTERS
// =====================================================

function renderUserShelters() {

    const list =
        document.getElementById(
            "user-shelter-list"
        );


    list.innerHTML =
        shelters.map(function(s) {

            return `

                <li>

                    <strong>
                        ${s.name}
                    </strong>

                    <br>

                    📍 Location:
                    ${s.location}

                    <br>

                    👥 Occupancy:
                    ${s.current}/${s.capacity}
                    Occupied

                </li>

            `;

        }).join("");

}



// =====================================================
// ADMIN VOLUNTEERS
// =====================================================

function renderAdminVolunteers() {

    const table =
        document.getElementById(
            "admin-volunteers-table"
        );


    table.innerHTML =
        volunteers.map(function(v) {

            const statusClass =
                v.status === "Approved"
                    ? "status-resolved"
                    : "status-pending";


            return `

                <tr>

                    <td>
                        ${v.name}
                    </td>

                    <td>
                        ${v.phone}
                    </td>

                    <td>
                        ${v.skill}
                    </td>

                    <td>
                        ${v.avail}
                    </td>

                    <td>

                        <span
                            class="status-badge ${statusClass}">

                            ${v.status}

                        </span>

                    </td>

                    <td>

                        ${
                            v.status !== "Approved"

                            ?

                            `<button
                                class="btn btn-primary"
                                style="
                                    padding:3px 8px;
                                    font-size:0.8rem;
                                "
                                onclick="approveVolunteer(${v.id})">

                                Approve

                            </button>`

                            :

                            "Approved"
                        }

                    </td>

                </tr>

            `;

        }).join("");

}



// =====================================================
// APPROVE VOLUNTEER
// =====================================================

function approveVolunteer(id) {

    volunteers =
        volunteers.map(function(v) {

            if (v.id === id) {

                return {

                    ...v,

                    status: "Approved"

                };

            }

            return v;

        });


    saveData();


    renderAdminVolunteers();

}



// =====================================================
// PAGE START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Make sure saved risk information is loaded

        currentRiskLevel =
            localStorage.getItem("riskLevel")
            || "MEDIUM";


        riskLocation =
            localStorage.getItem("riskLocation")
            || "";

    }
);