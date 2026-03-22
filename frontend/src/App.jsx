import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Select an image to start");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setStatus(`Ready to upload: ${selected.name}`);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please choose an image first.");
      return;
    }

    setLoading(true);
    setStatus("Uploading image... Please wait.");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      setStatus("Upload success! Lambda/SQS pipeline triggered.");
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed. Check console and backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <h1>Serverless Image Pipeline</h1>
        <p className="description">
          A React app uploads an image via Django to S3, triggers Lambda, and pushes
          a task to SQS for async processing.
        </p>
      </section>

      <section className="uploader">
        <label htmlFor="imageUpload" className="file-input-label">
          {file ? file.name : "Select image file"}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        {previewUrl && (
          <div className="preview-container">
            <img src={previewUrl} alt="preview" className="preview-image" />
          </div>
        )}

        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload to S3"}
        </button>

        <div className="status-message">{status}</div>
      </section>
    </main>
  );
}

export default App;
