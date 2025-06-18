import sqlite3
import os

# Remove existing database if it exists
if os.path.exists('events.db'):
    os.remove('events.db')
    print("Old events.db deleted.")

# Create and initialize a new database
conn = sqlite3.connect('events.db')
cur = conn.cursor()

# Create users table
cur.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'faculty', 'student')) NOT NULL
)
''')

# Create events table
cur.execute('''
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    priority INTEGER,
    course TEXT,
    semester TEXT,
    participants INTEGER,
    status TEXT DEFAULT 'Pending',
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id)
)
''')

# Insert test users with plain text passwords
cur.executemany('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [
    ('admin1', 'adminpass', 'admin'),
    ('faculty1', 'facultypass', 'faculty'),
    ('student1', 'studentpass', 'student')
])

conn.commit()
conn.close()

print("Database reset and test users inserted.")
