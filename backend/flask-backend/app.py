import dlib
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
import pickle

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Dlib face detector and face recognition model
detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
face_rec_model = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")

# Directory to save face encodings
ENCODINGS_DIR = "encodings"
if not os.path.exists(ENCODINGS_DIR):
    os.makedirs(ENCODINGS_DIR)


# Convert base64 image to OpenCV format
def base64_to_image(base64_string):
    img_data = base64.b64decode(base64_string.split(',')[1])
    nparr = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


# Save face encoding to file
def save_face_encoding(user_id, face_encoding):
    file_path = os.path.join(ENCODINGS_DIR, f"{user_id}.pkl")
    with open(file_path, 'wb') as f:
        pickle.dump(face_encoding, f)
    print(f"Saved encoding for user {user_id} at {file_path}")


# Load face encoding from file
def load_face_encoding(user_id):
    file_path = os.path.join(ENCODINGS_DIR, f"{user_id}.pkl")
    if os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            return pickle.load(f)
    return None


# Get face encodings using dlib
def get_face_encodings(image):
    dets = detector(image, 1)
    encodings = []

    for det in dets:
        shape = shape_predictor(image, det)
        face_encoding = np.array(face_rec_model.compute_face_descriptor(image, shape))
        encodings.append(face_encoding)
        print(f"Detected face encoding: {face_encoding}")  # Debugging print

    if not encodings:
        print("No faces detected in the image.")  # Debugging print

    return encodings


# Route for storing user face during registration
@app.route('/register-face', methods=['POST'])
def register_face():
    try:
        data = request.get_json()
        user_id = data['user_id']
        image_base64 = data['image']

        # Convert the base64 image to an OpenCV image
        image = base64_to_image(image_base64)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Get face encodings using dlib
        face_encodings = get_face_encodings(rgb_image)

        if len(face_encodings) == 0:
            return jsonify({'success': False, 'message': 'No face detected.'})

        # Store the first face encoding
        save_face_encoding(user_id, face_encodings[0])
        return jsonify({'success': True, 'message': 'Face encoding stored successfully.'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


# Route for face verification
@app.route('/verify-face', methods=['POST'])
def verify_face():
    try:
        data = request.get_json()
        user_id = data['user_id']
        image_base64 = data['image']

        # Convert the base64 image to an OpenCV image
        live_image = base64_to_image(image_base64)
        rgb_live_image = cv2.cvtColor(live_image, cv2.COLOR_BGR2RGB)

        # Get face encoding using dlib
        live_encodings = get_face_encodings(rgb_live_image)

        if len(live_encodings) == 0:
            return jsonify({'success': False, 'message': 'No face detected.'})

        # Retrieve stored encoding from local storage
        stored_encoding = load_face_encoding(user_id)

        if stored_encoding is None:
            return jsonify({'success': False, 'message': 'User not found.'})

        # Compare the live encoding with the stored encoding
        live_encoding = live_encodings[0]
        distance = np.linalg.norm(np.array(stored_encoding) - np.array(live_encoding))
        threshold = 0.4

        print(f"Distance between stored and live encoding: {distance}")  # Debugging print

        if distance < threshold:
            return jsonify({'success': True, 'message': 'Face verification successful!'})
        else:
            return jsonify({'success': False, 'message': 'Face verification failed.'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
