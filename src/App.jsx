import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please upload an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      if (!API_URL) {
        throw new Error("VITE_API_URL is not defined");
      }

      const response = await fetch(`${API_URL}/predict-leaf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Backend error:", err);
      setError(
        "Server is waking up or unreachable. Please wait 30–60 seconds and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Plant Leaf Disease Detector</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div className="preview">
          <img src={preview} alt="Uploaded Leaf" />
        </div>
      )}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Predict"}
      </button>

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result">
          <h2>Prediction Result</h2>
          <p>
            <strong>Disease:</strong>{" "}
            <span className="prediction">{result.prediction}</span>
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            <span className="confidence">
              {(result.confidence * 100).toFixed(2)}%
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
