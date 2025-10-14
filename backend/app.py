from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os, uuid

# ------------------ APP SETUP ------------------
app = Flask(__name__, static_folder="static", static_url_path="/static")
CORS(app)

# ------------------ DATABASE CONFIG ------------------
# Directly connect to your Render PostgreSQL
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://diagnomed_ai_user:MHMkBNrYX8QhunAGnuoJEhTtSbYvQmRN@dpg-d3n82oemcj7s7385mlbg-a.oregon-postgres.render.com/diagnomed_ai"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ------------------ MODEL ------------------
class PatientCase(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_name = db.Column(db.String(120))
    symptoms = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    cnn_output = db.Column(db.Text)
    analysis_output = db.Column(db.Text)

# ------------------ FILE UPLOAD CONFIG ------------------
app.config["UPLOAD_FOLDER"] = "static/uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# ------------------ ROUTES ------------------

@app.route("/")
def home():
    return jsonify({"message": "✅ Backend is running and connected to Render PostgreSQL!"})

# 🧍‍♂️ PATIENT SUBMITS DATA
@app.route("/api/patient/submit", methods=["POST"])
def patient_submit():
    name = request.form.get("name")
    symptoms = request.form.get("symptoms")
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save uploaded file locally
    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    # Always use your Render backend domain for the image URL
    base_url = request.host_url.rstrip("/")  # e.g., http://ipd-website-abvc.onrender.com
    public_url = f"{base_url}/static/uploads/{filename}"

    # Dummy AI results
    cnn_output = "Detected anomaly in Brain."
    analysis_output = "Possible Stage 2 Brain Tumor Cancer."

    case = PatientCase(
        patient_name=name,
        symptoms=symptoms,
        image_url=public_url,  # ✅ store the full URL
        cnn_output=cnn_output,
        analysis_output=analysis_output,
    )
    db.session.add(case)
    db.session.commit()

    return jsonify({"message": "Case submitted successfully!"}), 200

# 👨‍⚕️ DOCTOR FETCHES CASES
@app.route("/api/doctor/cases", methods=["GET"])
def doctor_cases():
    cases = PatientCase.query.all()

    # 🧩 Console log for debugging
    print("\n🧠 Fetching cases from database:")
    for c in cases:
        print(f"   🖼️ Image URL from DB: {c.image_url}")

    return jsonify([
        {
            "id": c.id,
            "patient_name": c.patient_name,
            "symptoms": c.symptoms,
            "image_url": c.image_url,  # ✅ use URL directly from DB
            "cnn_output": c.cnn_output,
            "analysis_output": c.analysis_output,
        } for c in cases
    ]), 200

# ------------------ MAIN ENTRY ------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)
