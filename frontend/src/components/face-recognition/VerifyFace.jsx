import { useRef, useEffect, useContext } from "react";
import { UserContext } from "../../userCtx/UserContext";
import { useNavigate } from "react-router-dom";
import classes from "./VerifyFace.module.css";

const VerifyFace = ({ userId, loginData }) => {
  const navigate = useNavigate();
  const { setUserDatas, setTransactions } = useContext(UserContext);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Start webcam video stream
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing webcam: " + err);
      }
    };

    startVideo();

    return () => {
      console.log("Cleaning up video stream");
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => {
          track.stop(); // Stop each track
          console.log("Stopped track:", track);
        });
        streamRef.current = null; // Clear the reference
      }
    };
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

  // Verify Face Event
  const handleVerifyCapture = async () => {
    if (!userId.trim()) {
      alert("User ID is required for verification.");
      return;
    }
    const imageData = captureImage();
    const userData = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    const userDetails = await userData.json();
    if (userDetails.success) {
      const data = await sendImageToServer(
        "http://127.0.0.1:5000/verify-face",
        userId,
        imageData
      );
      if (data.success) {
        alert("Face verification successful! Proceed with the transaction.");
        alert(userDetails.message);
        const res = await fetch(
          `http://localhost:3000/api/transactions/${userDetails.user.email}`
        );
        const tnxData = await res.json();
        setTransactions(tnxData);
        setUserDatas(userDetails.user);
        navigate("/app");
      } else {
        alert("Face verification failed. Transaction denied.");
      }
    } else {
      alert(userDetails.message);
    }
  };

  return (
    <div className={`container ${classes.verifyFaceCon}`}>
      <h2>Verify Face</h2>
      {/* Video element to show webcam feed */}
      <video ref={videoRef} width="640" height="480" autoPlay />
      {/* Canvas element to capture and display the image */}
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      />
      <button onClick={handleVerifyCapture}>
        Capture Image for Verification
      </button>
    </div>
  );
};

export default VerifyFace;
