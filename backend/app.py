from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os, uuid
from dotenv import load_dotenv

load_dotenv(override=True)

# ------------------ APP SETUP ------------------
app = Flask(__name__, static_folder="static", static_url_path="/static")
CORS(app)

# ------------------ DATABASE CONFIG ------------------
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
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

# ------------------ API ROUTES ------------------

# 🧍‍♂️ PATIENT SUBMITS DATA
@app.route("/api/patient/submit", methods=["POST"])
def patient_submit():
    name = request.form.get("name")
    symptoms = request.form.get("symptoms")
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    base_url = request.host_url.rstrip("/")
    public_url = f"{base_url}/static/uploads/{filename}"

    cnn_output = "Detected anomaly in Brain."
    analysis_output = "Possible Stage 2 Brain Tumor Cancer."

    case = PatientCase(
        patient_name=name,
        symptoms=symptoms,
        image_url=public_url,
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

    print("\n🧠 Fetching cases from database:")
    for c in cases:
        print(f"   🖼️ Image URL from DB: {c.image_url}")

    return jsonify([
        {
            "id": c.id,
            "patient_name": c.patient_name,
            "symptoms": c.symptoms,
            "image_url": c.image_url,
            "cnn_output": c.cnn_output,
            "analysis_output": c.analysis_output,
        } for c in cases
    ]), 200

# ------------------ FRONTEND SERVE ------------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    dist_dir = os.path.join(os.path.dirname(__file__), "dist")

    # If frontend build not found, show backend status JSON
    if not os.path.exists(dist_dir):
        return jsonify({"message": "✅ Backend running and connected to Render PostgreSQL!"})

    if path != "" and os.path.exists(os.path.join(dist_dir, path)):
        return send_from_directory(dist_dir, path)
    else:
        return send_from_directory(dist_dir, "index.html")

# ------------------ MAIN ENTRY ------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)
