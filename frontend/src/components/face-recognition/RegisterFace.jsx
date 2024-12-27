import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import classes from "./RegisterFace.module.css";

const RegisterFace = ({ userId, userInputData }) => {
  const navigate = useNavigate();
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
  const sendImageToServer = async (
    url,
    userUrl,
    userData,
    userId,
    imageData
  ) => {
    console.log(userData);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, image: imageData }),
      });
      const data = await response.json();
      alert(data.message);

      if (data.success) {
        const userRes = await fetch(userUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
        const userDatas = await userRes.json();
        alert(userDatas.message);
        console.log(userDatas);
        if (userDatas.success) {
          navigate("/login");
        } else {
          alert("Something went wrong, signup again!");
          return;
        }
      }
      return data;
    } catch (err) {
      console.error("Error during request: " + err);
    }
  };

  // Register Face Event
  const handleRegisterCapture = () => {
    if (!userId.trim()) {
      alert("User ID is required for registration.");
      return;
    }
    const imageData = captureImage();
    sendImageToServer(
      "http://127.0.0.1:5000/register-face",
      "http://localhost:3000/api/signup",
      userInputData,
      userId,
      imageData
    );
  };

  return (
    <div className={`container ${classes.refisterFaceCon}`}>
      <h2>Register Face</h2>
      {/* Video element to show webcam feed */}
      <video ref={videoRef} width="640" height="480" autoPlay />
      {/* Canvas element to capture and display the image */}
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      />
      <button onClick={handleRegisterCapture}>
        Capture Image for Registration
      </button>
    </div>
  );
};

export default RegisterFace;
