import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
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

    try {
      const response = await fetch("/api/predict-leaf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setResult(data); // save the JSON object
    } catch (err) {
      console.error("Error contacting backend:", err);
      alert("Error contacting backend");
    }

    setLoading(false);
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

      {result && (
        <div className="result">
          <h2>Prediction Result</h2>
          <p>
            <strong>Disease:</strong>{" "}
            <span className="prediction">{result.prediction}</span>
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            <span className="confidence">{(result.confidence * 100).toFixed(2)}%</span>
          </p>
        
        </div>
      )}
    </div>
  );
}

export default App;
