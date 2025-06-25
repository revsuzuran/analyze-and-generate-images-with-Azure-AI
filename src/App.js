import React, { useState, useRef } from 'react';
import { analyzeImage } from './api/ai-vision';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob); // Return image as Blob
      }, 'image/jpeg');
    });
  };

  const handleAnalyzeUrl = async () => {
    if (!imageUrl.trim()) return alert("Enter image URL");
    await handleAnalyze(imageUrl);
  };

  const handleAnalyzeCamera = async () => {
    const imageBlob = await captureImage();
    await handleAnalyze(imageBlob);
  };

  const handleAnalyze = async (input) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeImage(input);
      setResult(res);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '20px', fontFamily: 'serif', textAlign: 'center' }}>
      <h1>Azure Vision Analyzer</h1>

      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="https://example.com/image.jpg"
        style={{ width: '400px', padding: '8px' }}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleAnalyzeUrl} disabled={loading}>
          Analyze from URL
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <video ref={videoRef} style={{ width: '300px' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <br />
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={handleAnalyzeCamera} disabled={loading}>
          Capture & Analyze
        </button>
      </div>

      {loading && <p style={{ color: 'gray' }}>Analyzing image, please wait...</p>}

      {result && (
        <pre style={{
          textAlign: 'left',
          marginTop: '20px',
          backgroundColor: '#f4f4f4',
          padding: '15px',
          borderRadius: '6px'
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}

export default App;
