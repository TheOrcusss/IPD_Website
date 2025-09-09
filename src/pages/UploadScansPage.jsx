import React, { useState } from "react";
import { Upload } from "lucide-react";

export default function UploadScansPage() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) {
      alert(`Uploaded: ${file.name}`);
      setFile(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <h1 className="flex items-center gap-3 text-3xl font-bold text-blue-600 mb-6">
        <Upload className="w-7 h-7" />
        Upload CT / MRI / X-ray Scans
      </h1>

      {/* Description */}
      <p className="mb-6 text-gray-600">
        Upload your X-rays, MRIs, or CT scans for AI-assisted analysis. <br/>
        Our models detect patterns and anomalies in medical imaging with high accuracy.
      </p>

      {/* Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white shadow-md rounded-2xl p-6 space-y-4"
      >
        {/* File Input */}
        <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <span className="text-gray-500 mb-2">Click to select a file</span>
          <span className="text-sm text-gray-400">Supported: Images (PNG, JPG) & PDFs</span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Selected File */}
        {file && (
          <p className="text-gray-700 text-sm mt-2">Selected file: {file.name}</p>
        )}

        {/* Upload Button */}
        <button
          type="submit"
          className="w-full py-3 !bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>
    </div>
  );
}