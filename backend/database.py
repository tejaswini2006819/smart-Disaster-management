import sqlite3
from werkzeug.security import generate_password_hash

DATABASE = "disaster.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    conn = get_db()
    cursor = conn.cursor()

    # Users
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Admins
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # Disaster reports
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS disaster_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            disaster_type TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            risk_level TEXT,
            latitude REAL,
            longitude REAL,
            status TEXT DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # SOS alerts
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sos_alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            latitude REAL,
            longitude REAL,
            message TEXT,
            status TEXT DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # Shelters
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS shelters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            capacity INTEGER,
            current_occupancy INTEGER DEFAULT 0,
            status TEXT DEFAULT 'Active'
        )
    """)

    # Volunteers
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS volunteers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            skill TEXT,
            availability TEXT,
            location TEXT,
            status TEXT DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # Rescue teams
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rescue_teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_name TEXT NOT NULL,
            members INTEGER,
            location TEXT,
            status TEXT DEFAULT 'Available'
        )
    """)

    # Alerts
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            message TEXT,
            risk_level TEXT,
            affected_area TEXT,
            status TEXT DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Default admin
    admin = cursor.execute(
        "SELECT id FROM admins WHERE username = ?",
        ("admin",)
    ).fetchone()

    if not admin:
        cursor.execute(
            "INSERT INTO admins (username, password) VALUES (?, ?)",
            ("admin", generate_password_hash("admin123"))
        )

    # Sample shelters
    shelter_count = cursor.execute(
        "SELECT COUNT(*) AS count FROM shelters"
    ).fetchone()["count"]

    if shelter_count == 0:
        cursor.execute("""
            INSERT INTO shelters
            (name, location, latitude, longitude, capacity, current_occupancy)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            "City Community Center",
            "Central Avenue",
            12.9716,
            77.5946,
            300,
            85
        ))

        cursor.execute("""
            INSERT INTO shelters
            (name, location, latitude, longitude, capacity, current_occupancy)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            "St. Mary High School Gym",
            "North District",
            12.9750,
            77.6000,
            600,
            140
        ))

    # Sample rescue team
    team_count = cursor.execute(
        "SELECT COUNT(*) AS count FROM rescue_teams"
    ).fetchone()["count"]

    if team_count == 0:
        cursor.execute("""
            INSERT INTO rescue_teams
            (team_name, members, location, status)
            VALUES (?, ?, ?, ?)
        """, (
            "Rapid Rescue Team",
            8,
            "Central District",
            "Available"
        ))

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_database()
    print("Database created successfully!")