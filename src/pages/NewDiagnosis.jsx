import React, { useEffect, useState } from "react";
import { User, Image as ImageIcon, Loader2, FileText } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_API_URL; // From .env

export default function NewDiagnosis() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/doctor/cases`);
        const data = await response.json();

        if (response.ok) {
          setCases(data);
          console.log("✅ Cases fetched:", data); // Debug full response
        } else {
          setError("Failed to fetch cases");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <div className="min-w-screen mx-auto p-6">
      <h1 className="flex items-center gap-3 text-3xl font-bold text-blue-600 mb-6">
        <FileText className="w-7 h-7" />
        Patient Diagnoses
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <p className="text-center text-red-600 mt-10">{error}</p>
      ) : cases.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No patient submissions available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c) => {
            console.log("🖼️ Image URL from DB:", c.image_url);

            return (
              <div
                key={c.id}
                className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-lg text-gray-800">
                    {c.patient_name || "Anonymous Patient"}
                  </h2>
                </div>

                <p className="text-sm text-gray-700 mb-1">
                  <strong>Symptoms:</strong> {c.symptoms}
                </p>

                {c.cnn_output && (
                  <p className="mt-3 text-sm text-gray-700">
                    <strong>CNN Output:</strong> {c.cnn_output}
                  </p>
                )}

                {c.analysis_output && (
                  <p className="mt-3 text-sm text-gray-700">
                    <strong>Bayesian Analysis:</strong> {c.analysis_output}
                  </p>
                )}

                {/* Confirm Button */}
                <div className="mt-4 text-right">
                  <button className="!bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition">
                    Confirm Diagnosis
                  </button>
                </div>

                {/* Image below button */}
                {c.image_url && (
                  <div className="mt-5 w-full flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      <ImageIcon className="w-4 h-4 text-blue-600" /> Uploaded
                      Scan:
                    </p>
                    <img
                      src={c.image_url}
                      alt="Patient Scan"
                      className="rounded-xl border border-gray-200 max-h-64 object-contain shadow-sm transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        console.warn("⚠️ Image failed to load:", c.image_url);
                        e.target.src =
                          "https://via.placeholder.com/600x400?text=Image+Unavailable";
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
