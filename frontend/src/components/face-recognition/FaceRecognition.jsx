import { useRef, useState, useEffect } from "react";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [registerUserId, setRegisterUserId] = useState("");
  const [verifyUserId, setVerifyUserId] = useState("");

  useEffect(() => {
    // Start webcam video stream
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing webcam: " + err);
      }
    };

    startVideo();
  }, []);

  // Function to capture image from video
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg"); // Return image in base64 format
  };

  // Function to send captured image to the backend
  const sendImageToServer = async (url, userId, imageData) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, image: imageData }),
      });
      const data = await response.json();
      alert(data.message);
      return data;
    } catch (err) {
      console.error("Error during request: " + err);
    }
  };

  // Register Face Event
  const handleRegisterCapture = () => {
    if (!registerUserId.trim()) {
      alert("Please enter a User ID for registration.");
      return;
    }
    const imageData = captureImage();
    sendImageToServer(
      "http://127.0.0.1:5000/register-face",
      registerUserId,
      imageData
    );
  };

  // Verify Face Event
  const handleVerifyCapture = async () => {
    if (!verifyUserId.trim()) {
      alert("Please enter a User ID for verification.");
      return;
    }
    const imageData = captureImage();
    const data = await sendImageToServer(
      "http://127.0.0.1:5000/verify-face",
      verifyUserId,
      imageData
    );
    if (data.verified) {
      alert("Face verification successful! Proceed with the transaction.");
    } else {
      alert("Face verification failed. Transaction denied.");
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Face Recognition Demo</h1>

      {/* Video element to show webcam feed */}
      <video ref={videoRef} width="640" height="480" autoPlay />

      {/* Canvas element to capture and display the image */}
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      />

      <div style={{ textAlign: "center" }}>
        {/* Register Face Section */}
        <h2>Register Face</h2>
        <input
          type="text"
          value={registerUserId}
          onChange={(e) => setRegisterUserId(e.target.value)}
          placeholder="Enter User ID"
          required
        />
        <button onClick={handleRegisterCapture}>
          Capture Image for Registration
        </button>

        {/* Verify Face Section */}
        <h2>Verify Face</h2>
        <input
          type="text"
          value={verifyUserId}
          onChange={(e) => setVerifyUserId(e.target.value)}
          placeholder="Enter User ID"
          required
        />
        <button onClick={handleVerifyCapture}>
          Capture Image for Verification
        </button>
      </div>
    </div>
  );
};

export default FaceRecognition;
