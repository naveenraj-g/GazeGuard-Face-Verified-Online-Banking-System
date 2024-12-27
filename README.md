# GazeGuard: Face-Verified Online Banking System

## Project Description
GazeGuard is an online banking system that uses face verification for secure user authentication. Users can register their faces during signup or later in their profile. The system ensures secure login using face recognition, alongside traditional password-based authentication.

## About me in thi project
I have recently learned frontend development and applied my knowledge to this project. While I have focused on building the user interface and implementing functionality, please note that the security features are not fully optimized yet, as I am still in the learning phase of web application security.

## Folder Structure
```
GazeGuard
├── frontend
│   └── (React Vite-based frontend)
├── backend
│   ├── node-backend
│   │   └── (Node.js and Express for MongoDB connection and API calls)
│   └── flask-backend
│       └── (Flask for face registration and verification)
```

---

## Prerequisites
Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (running locally or on a server)
- **Git**
- **C++ Build Tools** (for dlib installation):
  - Install the **Desktop development with C++** workload in Visual Studio Build Tools.
  - Install **CMake** from [CMake website](https://cmake.org/download/).
- **Datasets for Pre-trained Models**:
  - Download the following pre-trained models and place them in the `flask-backend` directory:
    1. [dlib_face_recognition_resnet_model_v1.dat](https://github.com/ageitgey/face_recognition_models/blob/master/face_recognition_models/models/dlib_face_recognition_resnet_model_v1.dat)
    2. [shape_predictor_68_face_landmarks.dat](https://github.com/ageitgey/face_recognition_models/blob/master/face_recognition_models/models/shape_predictor_68_face_landmarks.dat)

---

## Installation

### Clone the Repository
```bash
git clone <repository-url>
cd GazeGuard
```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Node.js Backend Setup
1. Navigate to the node-backend folder:
   ```bash
   cd backend/node-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Node.js server:
   ```bash
   npm start
   ```

### Flask Backend Setup
1. Navigate to the flask-backend folder:
   ```bash
   cd backend/flask-backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the Flask server:
   ```bash
   python app.py
   ```

---

## Dependencies

### Frontend
- **React**
- **Vite**
- **React Router DOM**

### Node.js Backend
- **Express**
- **Mongoose**
- **Cors**
- **Body-parser**

### Flask Backend
- **Flask**
- **Flask-CORS**
- **OpenCV**
- **dlib**
- **numpy**

---

## How to Run the Application
1. Start the MongoDB server.
2. Run the Flask backend for face recognition.
3. Run the Node.js backend for database operations.
4. Start the React frontend.
5. Open your browser and navigate to the provided URL (usually `http://localhost:5173`).

---

## Features
- **Face Verification** during login.
- **Bank Account Management**: Create accounts and view account details.
- **Money Transfer**: Send money using account numbers.
- **Transaction Statements**: View transaction history.
- **Dashboard**: Access user-specific banking information.

---

## License
This project is for educational purposes only.
