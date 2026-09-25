const BACKEND_URL = "http://127.0.0.1:5000";

console.log("Backend connection file loaded");

// Test backend connection
async function testBackendConnection() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/test`);
        const data = await response.json();

        console.log("Backend:", data.message);
    } catch (error) {
        console.error("Backend connection failed:", error);
    }
}

testBackendConnection();
// Test shelter data from backend
async function testShelters() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/shelters`);
        const data = await response.json();

        console.log("Shelters from backend:", data);
    } catch (error) {
        console.error("Shelter API error:", error);
    }
}

testShelters();
// Connect Report Disaster to Flask backend
const originalHandleReportDisaster = window.handleReportDisaster;

window.handleReportDisaster = async function(e) {
    e.preventDefault();

    const type = document.getElementById("report-type").value;
    const location = document.getElementById("report-location").value;
    const description = document.getElementById("report-desc").value;

    try {
        const response = await fetch(`${BACKEND_URL}/api/report-disaster`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: null,
                disaster_type: type,
                location: location,
                description: description,
                risk_level: "MEDIUM"
            })
        });

        const data = await response.json();

        if (data.success) {
            alert("Disaster report saved to database!");
            
            if (originalHandleReportDisaster) {
                originalHandleReportDisaster(e);
            }
        } else {
            alert("Report failed: " + data.message);
        }

    } catch (error) {
        console.error("Report API error:", error);
        alert("Could not connect to backend.");
    }
};
// Connect Emergency SOS to Flask backend
const originalTriggerSOS = window.triggerSOS;

window.triggerSOS = async function() {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                const response = await fetch(`${BACKEND_URL}/api/sos`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: null,
                        latitude: latitude,
                        longitude: longitude,
                        message: "Emergency SOS received"
                    })
                });

                const data = await response.json();

                if (data.success) {
                    alert("🚨 Emergency SOS saved to database!");
                } else {
                    alert("SOS failed: " + data.message);
                }

            } catch (error) {
                console.error("SOS API error:", error);
                alert("Could not connect to backend.");
            }
        },
        function() {
            alert("Please allow location access for Emergency SOS.");
        }
    );
};
// Connect Volunteer Registration to Flask backend
const originalHandleVolunteerRegister = window.handleVolunteerRegister;

window.handleVolunteerRegister = async function(e) {
    e.preventDefault();

    const skill = document.getElementById("volunteer-skill").value;
    const availability = document.getElementById("volunteer-avail").value;

    try {
        const response = await fetch(`${BACKEND_URL}/api/volunteers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: null,
                skill: skill,
                availability: availability,
                location: "Not provided"
            })
        });

        const data = await response.json();

        if (data.success) {
            alert("Volunteer registration saved to database!");

            if (originalHandleVolunteerRegister) {
                originalHandleVolunteerRegister(e);
            }
        } else {
            alert("Registration failed: " + data.message);
        }

    } catch (error) {
        console.error("Volunteer API error:", error);
        alert("Could not connect to backend.");
    }
};
// Load admin data from Flask backend
async function loadAdminDataFromBackend() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/dashboard`);
        const data = await response.json();

        console.log("Admin Dashboard Data:", data);

    } catch (error) {
        console.error("Admin dashboard API error:", error);
    }
}

loadAdminDataFromBackend();
// Load real reports from backend
async function loadBackendReports() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/reports`);
        const data = await response.json();

        console.log("Reports from backend:", data);

    } catch (error) {
        console.error("Reports API error:", error);
    }
}

loadBackendReports();
// Load SOS alerts from backend
async function loadBackendSOS() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/sos`);
        const data = await response.json();

        console.log("SOS from backend:", data);

    } catch (error) {
        console.error("SOS API error:", error);
    }
}

loadBackendSOS();
// Load volunteers from backend
async function loadBackendVolunteers() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/volunteers`);
        const data = await response.json();

        console.log("Volunteers from backend:", data);

    } catch (error) {
        console.error("Volunteers API error:", error);
    }
}

loadBackendVolunteers();
// Show backend dashboard counts on Admin Dashboard
async function showBackendDashboardCounts() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/dashboard`);
        const data = await response.json();

        if (data.success) {
            console.log("Backend counts:");
            console.log("Reports:", data.reports);
            console.log("Active SOS:", data.active_sos);
            console.log("Active Shelters:", data.active_shelters);
            console.log("Volunteers:", data.volunteers);
        }

    } catch (error) {
        console.error("Dashboard count error:", error);
    }
}

showBackendDashboardCounts();
// Display backend reports in Admin Dashboard
async function displayBackendReports() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/reports`);
        const data = await response.json();

        if (!data.success) return;

        const table = document.getElementById("admin-reports-table");
        table.innerHTML ="";

        if (!table) return;

        table.innerHTML = data.reports.map(report => `
            <tr>
                <td>${report.created_at}</td>
                <td>User ${report.user_id || "Unknown"}</td>
                <td><strong>${report.disaster_type}</strong></td>
                <td>${report.location}</td>
                <td>${report.description || ""}</td>
                <td>
                    <span class="status-badge status-pending">
                        ${report.status}
                    </span>
                </td>
                <td>Backend Report</td>
            </tr>
        `).join("");

        console.log("Backend reports displayed in Admin Dashboard");

    } catch (error) {
        console.error("Display reports error:", error);
    }
}

displayBackendReports();
// Display backend SOS alerts in Admin Dashboard
async function displayBackendSOS() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/sos`);
        const data = await response.json();

        if (!data.success) return;

        console.log("SOS alerts available for Admin:", data.sos_alerts);

    } catch (error) {
        console.error("Display SOS error:", error);
    }
}

displayBackendSOS();
async function displaySOSInAdminTable() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/sos`);
        const data = await response.json();

        if (!data.success) return;

        const table = document.getElementById("admin-reports-table");

        if (!table) return;

        data.sos_alerts.forEach(sos => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${sos.created_at}</td>
                <td>User ${sos.user_id || "Unknown"}</td>
                <td><strong>🚨 EMERGENCY SOS</strong></td>
               <td>
    <a href="https://maps.google.com/?q=${sos.latitude},${sos.longitude}" target="_blank">
        ${sos.latitude}, ${sos.longitude}
    </a>
</td>
                <td>${sos.message}</td>
                <td>
                    <span class="status-badge status-sos">
                        ${sos.status}
                    </span>
                </td>
                <td>Emergency Alert</td>
            `;

            table.prepend(row);
        });

        console.log("Backend SOS displayed correctly");

    } catch (error) {
        console.error("SOS display error:", error);
    }
}

displaySOSInAdminTable();
const originalShowAdminDashboard = window.showAdminDashboard;

window.showAdminDashboard = function() {
    originalShowAdminDashboard();

    setTimeout(() => {
        displayBackendReports();
        displaySOSInAdminTable();
    }, 100);
};
async function loadRiskLevel() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/risk-level`);
        const data = await response.json();

        if (data.success) {
            const riskText = document.getElementById("user-risk-text");
            const riskDesc = document.getElementById("risk-desc");

            if (riskText) {
                riskText.innerText = data.risk_level;
            }

            if (riskDesc) {
                riskDesc.innerText =
                    `${data.affected_area}: ${data.message}`;
            }
        }
    } catch (error) {
        console.error("Risk level API error:", error);
        alert("Risk level API error:"+error.message);
    }
}

loadRiskLevel();
setInterval(loadRisklevel,3000);
window.addEventListener("load", function() {
    setTimeout(loadRiskLevel, 500);
});
async function updateRiskLevel(riskLevel) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/risk-level`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                risk_level: riskLevel,
                affected_area: "All Areas",
                message: riskLevel + " risk alert activated by Admin"
            })
        });

        const data = await response.json();

        if (data.success) {
            alert("Risk level updated in database!");
        } else {
            alert("Risk update failed: " + data.message);
        }
    } catch (error) {
        console.error("Risk update API error:", error);
        alert("Could not connect to backend.");
    }
}
async function testCreateAlert() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/alerts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Flood Warning",
                message: "Heavy rainfall may cause flooding.",
                risk_level: "HIGH",
                affected_area: "College Area"
            })
        });

        const data = await response.json();
        console.log(data);
        alert(data.message);
    } catch (error) {
        alert("Alert API error: " + error.message);
    }
}
testeCreateAlert();