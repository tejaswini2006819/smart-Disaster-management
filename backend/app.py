from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import check_password_hash
from database import init_database, get_db

app = Flask(__name__)
CORS(app)

# Create database
init_database()


# =========================
# HOME
# =========================

@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "Disaster Management Backend is running!"
    })


# =========================
# TEST
# =========================

@app.route("/api/test")
def test():
    return jsonify({
        "success": True,
        "message": "Backend is connected successfully!"
    })


# =========================
# ADMIN LOGIN
# =========================

@app.route("/api/admin/login", methods=["POST"])
def admin_login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Username and password are required"
        }), 400

    conn = get_db()

    admin = conn.execute(
        "SELECT * FROM admins WHERE username = ?",
        (username,)
    ).fetchone()

    conn.close()

    if admin and check_password_hash(admin["password"], password):
        return jsonify({
            "success": True,
            "message": "Admin login successful"
        })

    return jsonify({
        "success": False,
        "message": "Invalid username or password"
    }), 401


# =========================
# REGISTER USER
# =========================

@app.route("/api/users/register", methods=["POST"])
def register_user():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    if not name or not email or not phone or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    from werkzeug.security import generate_password_hash

    conn = get_db()

    try:
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO users
            (name, email, phone, password)
            VALUES (?, ?, ?, ?)
        """, (
            name,
            email,
            phone,
            generate_password_hash(password)
        ))

        conn.commit()

        user_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "user_id": user_id
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 400

    finally:
        conn.close()


# =========================
# REPORT DISASTER
# =========================

@app.route("/api/report-disaster", methods=["POST"])
def report_disaster():

    data = request.get_json()

    user_id = data.get("user_id")
    disaster_type = data.get("disaster_type")
    location = data.get("location")
    description = data.get("description")
    risk_level = data.get("risk_level", "LOW")
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if not disaster_type or not location:
        return jsonify({
            "success": False,
            "message": "Disaster type and location are required"
        }), 400

    conn = get_db()

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO disaster_reports
        (
            user_id,
            disaster_type,
            location,
            description,
            risk_level,
            latitude,
            longitude
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        disaster_type,
        location,
        description,
        risk_level,
        latitude,
        longitude
    ))

    conn.commit()

    report_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "success": True,
        "message": "Disaster report submitted successfully",
        "report_id": report_id
    })


# =========================
# SOS
# =========================

@app.route("/api/sos", methods=["POST"])
def sos():

    data = request.get_json()

    user_id = data.get("user_id")
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    message = data.get(
        "message",
        "Emergency SOS received"
    )

    conn = get_db()

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO sos_alerts
        (
            user_id,
            latitude,
            longitude,
            message
        )
        VALUES (?, ?, ?, ?)
    """, (
        user_id,
        latitude,
        longitude,
        message
    ))

    conn.commit()

    sos_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "success": True,
        "message": "SOS alert sent successfully",
        "sos_id": sos_id
    })


# =========================
# GET SHELTERS
# =========================

@app.route("/api/shelters", methods=["GET"])
def get_shelters():

    conn = get_db()

    shelters = conn.execute("""
        SELECT *
        FROM shelters
        WHERE status = 'Active'
    """).fetchall()

    conn.close()

    result = [dict(row) for row in shelters]

    return jsonify({
        "success": True,
        "shelters": result
    })


# =========================
# REGISTER VOLUNTEER
# =========================

@app.route("/api/volunteers", methods=["POST"])
def register_volunteer():

    data = request.get_json()

    user_id = data.get("user_id")
    skill = data.get("skill")
    availability = data.get("availability")
    location = data.get("location")

    conn = get_db()

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO volunteers
        (
            user_id,
            skill,
            availability,
            location
        )
        VALUES (?, ?, ?, ?)
    """, (
        user_id,
        skill,
        availability,
        location
    ))

    conn.commit()

    volunteer_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "success": True,
        "message": "Volunteer registration submitted",
        "volunteer_id": volunteer_id
    })


# =========================
# ADMIN - GET REPORTS
# =========================

@app.route("/api/admin/reports", methods=["GET"])
def admin_reports():

    conn = get_db()

    reports = conn.execute("""
        SELECT *
        FROM disaster_reports
        ORDER BY created_at DESC
    """).fetchall()

    conn.close()

    result = [dict(row) for row in reports]

    return jsonify({
        "success": True,
        "reports": result
    })


# =========================
# ADMIN - GET SOS
# =========================

@app.route("/api/admin/sos", methods=["GET"])
def admin_sos():

    conn = get_db()

    alerts = conn.execute("""
        SELECT *
        FROM sos_alerts
        ORDER BY created_at DESC
    """).fetchall()

    conn.close()

    result = [dict(row) for row in alerts]

    return jsonify({
        "success": True,
        "sos_alerts": result
    })


# =========================
# ADMIN - GET VOLUNTEERS
# =========================

@app.route("/api/admin/volunteers", methods=["GET"])
def admin_volunteers():

    conn = get_db()

    volunteers = conn.execute("""
        SELECT *
        FROM volunteers
        ORDER BY created_at DESC
    """).fetchall()

    conn.close()

    result = [dict(row) for row in volunteers]

    return jsonify({
        "success": True,
        "volunteers": result
    })


# =========================
# ADMIN - ADD SHELTER
# =========================

@app.route("/api/admin/shelters", methods=["POST"])
def add_shelter():

    data = request.get_json()

    name = data.get("name")
    location = data.get("location")
    capacity = data.get("capacity")

    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if not name or not location or not capacity:
        return jsonify({
            "success": False,
            "message": "Name, location and capacity are required"
        }), 400

    conn = get_db()

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO shelters
        (
            name,
            location,
            latitude,
            longitude,
            capacity
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
        name,
        location,
        latitude,
        longitude,
        capacity
    ))

    conn.commit()

    shelter_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "success": True,
        "message": "Shelter added successfully",
        "shelter_id": shelter_id
    })


# =========================
# ADMIN DASHBOARD SUMMARY
# =========================

@app.route("/api/admin/dashboard", methods=["GET"])
def admin_dashboard():

    conn = get_db()

    reports = conn.execute(
        "SELECT COUNT(*) AS count FROM disaster_reports"
    ).fetchone()["count"]

    active_sos = conn.execute(
        "SELECT COUNT(*) AS count FROM sos_alerts WHERE status = 'Active'"
    ).fetchone()["count"]

    shelters = conn.execute(
        "SELECT COUNT(*) AS count FROM shelters WHERE status = 'Active'"
    ).fetchone()["count"]

    volunteers = conn.execute(
        "SELECT COUNT(*) AS count FROM volunteers"
    ).fetchone()["count"]

    conn.close()

    return jsonify({
        "success": True,
        "reports": reports,
        "active_sos": active_sos,
        "active_shelters": shelters,
        "volunteers": volunteers
    })


# =========================
# RUN SERVER
# =========================
@app.route("/api/risk-level", methods=["GET"])
def get_risk_level():
    conn = get_db()

    alert = conn.execute("""
        SELECT risk_level, affected_area, message
        FROM alerts
        WHERE status = 'Active'
        ORDER BY created_at DESC
        LIMIT 1
    """).fetchone()

    conn.close()

    if alert:
        return jsonify({
            "success": True,
            "risk_level": alert["risk_level"],
            "affected_area": alert["affected_area"],
            "message": alert["message"]
        })

    return jsonify({
        "success": True,
        "risk_level": "LOW",
        "affected_area": "No active alert",
        "message": "No active disaster alert"
    })
@app.route("/api/risk-level", methods=["POST"])
def update_risk_level():
    data = request.get_json()

    risk_level = data.get("risk_level")
    affected_area = data.get("affected_area", "All Areas")
    message = data.get("message", "Risk level updated by Admin")

    if not risk_level:
        return jsonify({
            "success": False,
            "message": "Risk level is required"
        }), 400

    conn = get_db()

    conn.execute("""
        UPDATE alerts
        SET status = 'Inactive'
        WHERE status = 'Active'
    """)

    conn.execute("""
        INSERT INTO alerts
        (title, message, risk_level, affected_area, status)
        VALUES (?, ?, ?, ?, 'Active')
    """, (
        "Disaster Risk Alert",
        message,
        risk_level,
        affected_area
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Risk level updated successfully",
        "risk_level": risk_level
    })
@app.route("/api/admin/alerts", methods=["POST"])
def create_alert():
    data = request.get_json()

    title = data.get("title")
    message = data.get("message")
    risk_level = data.get("risk_level")
    affected_area = data.get("affected_area")

    if not title or not message or not risk_level or not affected_area:
        return jsonify({
            "success": False,
            "message": "All alert fields are required"
        }), 400

    conn = get_db()

    conn.execute("""
        INSERT INTO alerts
        (title, message, risk_level, affected_area, status)
        VALUES (?, ?, ?, ?, 'Active')
    """, (
        title,
        message,
        risk_level,
        affected_area
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Alert created successfully"
    })
if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
