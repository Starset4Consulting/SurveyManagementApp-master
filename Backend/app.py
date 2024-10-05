from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json
import sqlite3
import os
import math

app = Flask(__name__)
CORS(app)

# Create an uploads directory if it doesn't exist
os.makedirs('uploads', exist_ok=True)

# Initialize the database
def init_db():
    conn = sqlite3.connect('surveyapp.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS users
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    phone_number TEXT,
                    username TEXT UNIQUE,
                    password TEXT)''')
    conn.execute('''CREATE TABLE IF NOT EXISTS surveys
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    questions TEXT)''')
    conn.execute('''CREATE TABLE IF NOT EXISTS survey_responses
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    survey_id INTEGER,
                    responses TEXT,
                    location TEXT,
                    voice_recording_path TEXT,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (survey_id) REFERENCES surveys(id))''')
    conn.commit()
    conn.close()

# Register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    phone_number = data['phoneNumber']
    username = data['username']
    password = data['password']

    conn = sqlite3.connect('surveyapp.db')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    if cursor.fetchone():
        return jsonify({"success": False, "message": "Username already exists."})

    cursor.execute("INSERT INTO users (phone_number, username, password) VALUES (?, ?, ?)", 
                   (phone_number, username, password))
    conn.commit()

    user_id = cursor.lastrowid
    conn.close()

    return jsonify({"success": True, "user_id": user_id, "message": "User registered successfully"})

# Login for users
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = sqlite3.connect('surveyapp.db')
    cursor = conn.cursor()

    cursor.execute("SELECT id, username FROM users WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()

    if user:
        return jsonify({"success": True, "user_id": user[0], "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"})

# Create a new survey
@app.route('/surveys', methods=['POST'])
def create_survey():
    data = request.json
    name = data['name']
    questions = data['questions']

    conn = sqlite3.connect('surveyapp.db')
    cursor = conn.cursor()

    cursor.execute("INSERT INTO surveys (name, questions) VALUES (?, ?)", (name, str(questions)))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Survey created successfully"})

# Get a list of all available surveys
@app.route('/surveys', methods=['GET'])
def get_surveys():
    conn = sqlite3.connect('surveyapp.db')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM surveys")
    surveys = cursor.fetchall()
    survey_list = [{"id": s[0], "name": s[1], "questions": eval(s[2])} for s in surveys]

    conn.close()
    return jsonify({"surveys": survey_list})

# Get a specific survey by ID
@app.route('/surveys/<int:survey_id>', methods=['GET'])
def get_survey(survey_id):
    conn = sqlite3.connect('surveyapp.db')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM surveys WHERE id = ?", (survey_id,))
    survey = cursor.fetchone()

    if survey:
        return jsonify({
            "id": survey[0],
            "name": survey[1],
            "questions": eval(survey[2])
        })
    else:
        return jsonify({"error": "Survey not found"}), 404

# Haversine formula for distance calculation
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2 +
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
        math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# Submit a survey response
@app.route('/submit_survey', methods=['POST'])
def submit_survey():
    data = request.json
    user_id = data['user_id']
    survey_id = data['survey_id']
    responses = data['responses']
    location = data.get('location')
    voice_recording_path = data.get('voice_recording_path')

    location_data = json.loads(location) if location else None

    if location_data:
        latitude = location_data['latitude']
        longitude = location_data['longitude']

        conn = sqlite3.connect('surveyapp.db')
        cursor = conn.cursor()

        cursor.execute("SELECT location FROM survey_responses WHERE user_id = ? ORDER BY id DESC LIMIT 1", (user_id,))
        last_response = cursor.fetchone()
        
        if last_response:
            last_location = json.loads(last_response[0])
            last_latitude = last_location['latitude']
            last_longitude = last_location['longitude']
            
            distance = haversine(latitude, longitude, last_latitude, last_longitude)

            if distance < 0.005:
                return jsonify({"success": False, "message": "You cannot take multiple surveys in this location within 5 meters."})

    cursor.execute("INSERT INTO survey_responses (user_id, survey_id, responses, location, voice_recording_path) VALUES (?, ?, ?, ?, ?)", 
                   (user_id, survey_id, str(responses), location, voice_recording_path))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Survey response submitted successfully"})

# Download voice recording
@app.route('/download/<int:response_id>', methods=['GET'])
def download_voice_recording(response_id):
    conn = sqlite3.connect('surveyapp.db')
    cursor = conn.cursor()

    cursor.execute("SELECT voice_recording_path FROM survey_responses WHERE id = ?", (response_id,))
    recording = cursor.fetchone()

    conn.close()

    if recording and recording[0]:
        voice_recording_path = recording[0]
        
        if os.path.exists(voice_recording_path):
            return send_file(voice_recording_path, as_attachment=True)
        else:
            return jsonify({"success": False, "message": "File not found."}), 404
    else:
        return jsonify({"success": False, "message": "No recording found for this response."}), 404

UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Route to handle file upload
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'})

    if file:
        # Ensure the filename is secure
        base_filename = 'voice_recording'
        extension = '.m4a'
        
        # Check for existing files and auto-increment the file number
        existing_files = os.listdir(app.config['UPLOAD_FOLDER'])
        filtered_files = [f for f in existing_files if f.startswith(base_filename) and f.endswith(extension)]

        # Find the next available file number
        next_file_number = len(filtered_files) + 1
        new_filename = f"{base_filename}{next_file_number}{extension}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(new_filename))

        # Save the file
        file.save(filepath)

        return jsonify({'success': True, 'file_path': filepath})

    return jsonify({'success': False, 'message': 'File upload failed'})

# Delete a survey
@app.route('/surveys/<int:survey_id>', methods=['DELETE'])
def delete_survey(survey_id):
    conn = sqlite3.connect('surveyapp.db')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM surveys WHERE id = ?", (survey_id,))
    survey = cursor.fetchone()

    if survey:
        cursor.execute("DELETE FROM surveys WHERE id = ?", (survey_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Survey deleted successfully'}), 200
    else:
        conn.close()
        return jsonify({'error': 'Survey not found'}), 404

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
