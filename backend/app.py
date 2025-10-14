from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os, uuid

app = Flask(__name__)
CORS(app)

# ------------------ DATABASE CONFIG ------------------
uri = os.environ.get("DATABASE_URL")
if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ------------------ MODEL ------------------
class PatientCase(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_name = db.Column(db.String(120))
    symptoms = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    cnn_output = db.Column(db.Text)
    analysis_output = db.Column(db.Text)

# Ensure upload folder exists
app.config['UPLOAD_FOLDER'] = 'static/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ------------------ ROUTES ------------------

@app.route('/')
def home():
    return jsonify({"message": "Backend is running!"})


# Patient uploads data
@app.route('/api/patient/submit', methods=['POST'])
def patient_submit():
    name = request.form.get('name')
    symptoms = request.form.get('symptoms')
    file = request.files.get('image')

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save uploaded file
    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Convert to public URL
    public_url = f"{request.host_url}static/uploads/{filename}"

    # === Temporary dummy model outputs (replace later with CNN/Bayesian) ===
    cnn_output = "Detected anomaly in left lung."
    analysis_output = "Possible pneumonia (80%), TB (15%), other (5%)."

    case = PatientCase(
        patient_name=name,
        symptoms=symptoms,
        image_url=public_url,
        cnn_output=cnn_output,
        analysis_output=analysis_output
    )
    db.session.add(case)
    db.session.commit()

    return jsonify({"message": "Case submitted successfully!"})


# Doctor views all patient cases
@app.route('/api/doctor/cases', methods=['GET'])
def doctor_cases():
    cases = PatientCase.query.all()
    return jsonify([
        {
            "id": c.id,
            "patient_name": c.patient_name,
            "symptoms": c.symptoms,
            "image_url": c.image_url,
            "cnn_output": c.cnn_output,
            "analysis_output": c.analysis_output
        } for c in cases
    ]), 200


# ------------------ MAIN ENTRY ------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
