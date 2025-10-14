import React, { useEffect, useState } from "react";
import { User, Image, Loader2, FileText } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default function NewDiagnosis() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/doctor/cases`);
        const data = await response.json();

        if (response.ok) setCases(data);
        else setError("Failed to fetch cases");
      } catch (err) {
        console.error(err);
        setError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-6xl">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-blue-600 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map((c) => (
              <div
                key={c.id}
                className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-lg text-gray-800">
                    {c.patient_name || "Anonymous Patient"}
                  </h2>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <strong>Symptoms:</strong> {c.symptoms || "N/A"}
                </p>

                {c.image_url && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      <Image className="w-4 h-4 text-blue-600" /> Uploaded Scan:
                    </p>
                    <img
                      src={c.image_url}
                      alt="Uploaded Scan"
                      className="mx-auto mt-2 rounded-lg border w-full max-w-sm object-contain"
                    />
                  </div>
                )}

                <p className="mt-4 text-sm text-gray-700">
                  <strong>CNN Output:</strong> {c.cnn_output}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Bayesian Analysis:</strong> {c.analysis_output}
                </p>

                <div className="mt-4 text-right">
                  <button className="!bg-blue-600 hover:!bg-blue-700 !text-white px-4 py-2 rounded-xl font-medium transition">
                    Confirm Diagnosis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
