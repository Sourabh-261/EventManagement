from flask import Flask, request, jsonify, session, render_template
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'
CORS(app, supports_credentials=True)

# Absolute path to events.db
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'events.db')
print("Using database at:", DB_PATH)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Received login payload:", data)

    if not data:
        return jsonify({'success': False, 'message': 'No JSON received'})

    username = data.get('username')
    password = data.get('password')
    print(f"Username: {username}, Password: {password}")

    conn = get_db_connection()
    cursor = conn.cursor()

    # Print users in the DB for debug
    all_users = cursor.execute("SELECT id, username, password, role FROM users").fetchall()
    print("Users in database:")
    for u in all_users:
        print(dict(u))

    # Attempt login
    user = cursor.execute(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        (username, password)
    ).fetchone()
    conn.close()

    if user:
        print("Login successful for user:", dict(user))
        session['user_id'] = user['id']
        session['username'] = user['username']
        session['role'] = user['role']
        return jsonify({'success': True, 'role': user['role']})
    else:
        print("Login failed: No matching user found")
        return jsonify({'success': False, 'message': 'Invalid credentials'})

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    print("User logged out")
    return jsonify({'success': True})

@app.route('/user_role', methods=['GET'])
def user_role():
    role = session.get('role')
    return jsonify({'role': role})

@app.route('/events', methods=['GET'])
def get_events():
    conn = get_db_connection()
    events = conn.execute('SELECT * FROM events').fetchall()
    conn.close()
    return jsonify([dict(event) for event in events])

@app.route('/add_event', methods=['POST'])
def add_event():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'})

    data = request.get_json()
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO events 
        (title, description, date, time, priority, course, semester, participants, created_by, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['title'], data['description'], data['date'], data['time'],
        data['priority'], data['course'], data['semester'],
        data['participants'], session['user_id'], 'Pending'
    ))
    conn.commit()
    conn.close()
    print("Event added by user:", session.get('username'))
    return jsonify({'success': True})

@app.route('/approve_event/<int:event_id>', methods=['POST'])
def approve_event(event_id):
    if session.get('role') != 'admin':
        return jsonify({'success': False, 'message': 'Permission denied'})

    conn = get_db_connection()
    conn.execute('UPDATE events SET status = ? WHERE id = ?', ('Approved', event_id))
    conn.commit()
    conn.close()
    print(f"Event {event_id} approved by admin")
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
