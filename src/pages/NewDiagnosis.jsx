import { useNavigate } from "react-router-dom";
import { Stethoscope, Image, LineChart } from "lucide-react"; // icons

export default function NewDiagnosis() {
  const navigate = useNavigate();

  return (
    <main className="p-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900">New Diagnostics</h2>
      <p className="text-gray-700 mt-2">
        Start a new patient entry: Symptom Analysis, Image Diagnostics.
      </p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Symptom Analysis */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <Stethoscope className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Symptom Analysis
          </h3>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            Input patient symptoms and get AI analysis. <br />
            Our AI analyzes symptoms and provides diagnostic probabilities
            based on comprehensive medical data.
          </p>
          <button
            onClick={() => navigate("/symptom-analysis")}
            className="mt-4 w-full inline-block px-5 py-3 rounded-lg !bg-blue-600 !hover:bg-blue-700 text-white font-medium shadow transition"
          >
            Start Analysis
          </button>
        </div>

        {/* Image Diagnostics */}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <Image className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Image Diagnostics
          </h3>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            Upload X-rays, MRIs or CT scans for AI analysis. <br />
            Our computer vision models detect patterns and anomalies
            in medical imaging with high accuracy.
          </p>
          <button
            onClick={() => navigate("/image-diagnostics")}
            className="mt-4 w-full inline-block px-5 py-3 rounded-lg !bg-blue-600 !hover:bg-blue-700 text-white font-medium shadow transition"
          >
            Upload Images
          </button>
        </div>

        {/* Diagnostic History*/}
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <LineChart className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">
                Diagnostic History
            </h3>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Review previous diagnoses and patient records. <br />
                Track progress over time, identify trends, and evaluate
                treatment outcomes with data-driven insights.
            </p>
            <button
                onClick={() => navigate("/diagnostic-history")}
                className="mt-4 w-full inline-block px-5 py-3 rounded-lg !bg-blue-600 !hover:bg-blue-700 text-white font-medium shadow transition"
            >
                View History
            </button>
        </div>
      </div>
    </main>
  );
}
