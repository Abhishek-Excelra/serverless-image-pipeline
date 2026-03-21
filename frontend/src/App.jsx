import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      alert("Upload success");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h1>AWS Mastery 🚀</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Upload Image
      </button>
    </div>
  );
}

export default App;