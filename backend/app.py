from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os, uuid

# ------------------ LOAD ENV FILE ------------------
load_dotenv()  # ✅ Reads .env file from the same folder
print("🔍 DATABASE_URL from .env:", os.getenv("DATABASE_URL"))  # Debug check

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)

# ------------------ DATABASE CONFIG ------------------
uri = os.getenv("DATABASE_URL")
if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)

if not uri:
    raise RuntimeError("❌ DATABASE_URL not found. Please check your .env file!")

app.config["SQLALCHEMY_DATABASE_URI"] = uri
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

# ------------------ FILE UPLOADS ------------------
app.config["UPLOAD_FOLDER"] = "static/uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# ------------------ ROUTES ------------------

@app.route("/")
def home():
    return jsonify({"message": "✅ Backend is running!"})


# 🧍‍♂️ Patient uploads data
@app.route("/api/patient/submit", methods=["POST"])
def patient_submit():
    name = request.form.get("name")
    symptoms = request.form.get("symptoms")
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save file to static/uploads
    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    # Public path relative to backend
    public_url = f"static/uploads/{filename}"

    # Dummy model outputs (replace later with CNN + Bayesian results)
    cnn_output = "Detected anomaly in left lung."
    analysis_output = "Possible pneumonia (80%), TB (15%), other (5%)."

    case = PatientCase(
        patient_name=name,
        symptoms=symptoms,
        image_url=public_url,
        cnn_output=cnn_output,
        analysis_output=analysis_output,
    )
    db.session.add(case)
    db.session.commit()

    return jsonify({"message": "Case submitted successfully!"})


# 👨‍⚕️ Doctor views all patient cases
@app.route("/api/doctor/cases", methods=["GET"])
def doctor_cases():
    cases = PatientCase.query.all()
    base_url = request.host_url  # e.g., http://127.0.0.1:5000/

    data = []
    for c in cases:
        image_full_url = f"{base_url}{c.image_url}" if c.image_url else None
        data.append({
            "id": c.id,
            "patient_name": c.patient_name,
            "symptoms": c.symptoms,
            "image_url": image_full_url,
            "cnn_output": c.cnn_output,
            "analysis_output": c.analysis_output,
        })

    return jsonify(data), 200


# ------------------ MAIN ENTRY ------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)
