import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, User, Image, Loader2 } from "lucide-react";
import PatientChart from "../components/PatientChart";
import DiagnosisDistribution from "../components/DiagnosisDistribution";
import RecentPatients from "../components/RecentPatients";
import Card from "../components/Card";

const BACKEND_URL = import.meta.env.VITE_API_URL; // from .env

export default function Dashboard() {
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
        } else {
          setError("Failed to fetch cases");
        }
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
    <main className="p-6 w-full space-y-4">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome Back, Dr. Yash
          </h2>
        </div>

        <div className="mt-4 md:mt-0">
          <Link
            to="/NewDiagnosis"
            className="inline-block px-5 py-3 rounded-lg !bg-blue-600 hover:!bg-blue-700 !text-white font-medium shadow transition"
          >
            View Patients
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <Card title="Total Patients" value="1,248" color="text-gray-900" />
        <Card title="Pending Diagnoses" value="32" color="text-red-500" />
        <Card title="Completed Reports" value="846" color="text-green-600" />
        <Card title="Activity" value="+12%" color="text-blue-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <PatientChart />
        <DiagnosisDistribution />
      </div>

      {/* 🔹 New Section: Patient Cases from Database */}
      <section className="w-full mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
          <Activity className="w-5 h-5 text-blue-600" />
          Patient Cases (from database)
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : cases.length === 0 ? (
          <p className="text-center text-gray-600">
            No new patient submissions yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {item.patient_name || "Anonymous Patient"}
                  </h3>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <strong>Symptoms:</strong> {item.symptoms}
                </p>

                {item.image_url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 mb-1 flex items-center gap-1">
                      <Image className="w-4 h-4 text-blue-600" /> Uploaded Scan:
                    </p>
                    <img
                      src={`${BACKEND_URL}/${item.image_url}`}
                      alt="Uploaded Scan"
                      className="rounded-xl border border-gray-200 max-h-56 object-contain"
                    />
                  </div>
                )}

                {item.cnn_output && (
                  <p className="mt-3 text-sm text-gray-700">
                    <strong>CNN Output:</strong> {item.cnn_output}
                  </p>
                )}

                {item.analysis_output && (
                  <p className="mt-3 text-sm text-gray-700">
                    <strong>Bayesian Analysis:</strong>{" "}
                    {item.analysis_output}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Patients with "View All" */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold m-0 text-lg font-bold text-black">
            Recent Patients
          </h2>
          <Link
            to="/patients"
            className="text-blue-600 hover:underline font-medium"
          >
            View All →
          </Link>
        </div>
        <RecentPatients />
      </section>
    </main>
  );
}
