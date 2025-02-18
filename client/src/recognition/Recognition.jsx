import React, { useEffect, useRef, useState } from "react";
import './Recognition.css';
import axios from "axios";
import Navbar from '../components/navbar/Navbar';
import Guide from "../guide/Guide"; // Import halaman panduan

const App = () => {
  const videoRef = useRef(null);
  const [detectedLetter, setDetectedLetter] = useState("-"); // Menampilkan huruf satu-satu
  const [lastConfidence, setLastConfidence] = useState(null);
  const [fetchInterval, setFetchInterval] = useState(1000);
  const [intervalId, setIntervalId] = useState(null);
  const [history, setHistory] = useState([]);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing camera: ", err));

    return () => clearInterval(intervalId);
  }, []);

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = canvas.toDataURL("image/jpeg");
      return frame.split(",")[1];
    }
    return null;
  };

  const sendFrameToServer = async () => {
    const frame = captureFrame();
    if (!frame) return;
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/process_frame", { frame });
  
      if (response.data && response.data.length > 0) {
        const detectedClass = response.data[0].class;
        const detectedConfidence = response.data[0].confidence;
  
        if (detectedConfidence > 0.5) {
          setDetectedLetter(detectedClass);
          setLastConfidence(detectedConfidence);
          setHistory((prevHistory) => [...prevHistory, { frame: `data:image/jpeg;base64,${frame}`, letter: detectedClass }]);
        }
      } else {
        setDetectedLetter("-");
      }
    } catch (err) {
      console.error("Error sending frame to server: ", err);
    }
  };

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);

    const newIntervalId = setInterval(sendFrameToServer, fetchInterval);
    setIntervalId(newIntervalId);

    return () => clearInterval(newIntervalId);
  }, [fetchInterval]);

  return (
    <div className='container'>
      <Navbar />

      <div className="detected">
        <video className="video" ref={videoRef} autoPlay playsInline style={{ width: "50%" }} />

        <div className="detectedSentence">
          <h2 className="a">TERDETEKSI SEBAGAI HURUF</h2>
          <p className="b">{detectedLetter}</p>
          <button className="button" onClick={() => setShowGuide(true)}>PANDUAN</button>
          {showGuide && <Guide onClose={() => setShowGuide(false)} />}
        </div>
      </div>

      <div className="history-container">
        <div className="history">
          <h2>History</h2>

          <div className="interval">
            <h2>Set Fetch Interval:</h2>
            <select className="intervalOption" onChange={(e) => setFetchInterval(Number(e.target.value))} value={fetchInterval}>
              <option value={500}>0.5 seconds</option>
              <option value={1000}>1 second</option>
              <option value={1500}>1.5 seconds</option>
              <option value={2000}>2 seconds</option>
              <option value={3000}>3 seconds</option>
              <option value={5000}>5 seconds</option>
            </select>
          </div>
        </div>
        
        <div className="history-grid">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <img src={item.frame} alt={`Detected ${item.letter}`} className="history-image" />
              <p className="historyText">{item.letter}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;