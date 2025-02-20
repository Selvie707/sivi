from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt #pip install Flask-Bcrypt = https://pypi.org/project/Flask-Bcrypt/
import cv2
import numpy as np
import base64
from ultralytics import YOLO
from flask_cors import CORS, cross_origin #ModuleNotFoundError: No module named 'flask_cors' = pip install Flask-Cors
from models import db, User
from flask_mail import Mail, Message  # Tambahkan ini

# Inisialisasi aplikasi Flask
app = Flask(__name__)
CORS(app)

# Konfigurasi SMTP
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Bisa diganti dengan SMTP lain
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'via.work707@gmail.com'  # Ganti dengan emailmu
app.config['MAIL_PASSWORD'] = 'cqqg qnxp sfgn gzmf'  # Gunakan App Password jika pakai Gmail
app.config['MAIL_DEFAULT_SENDER'] = 'via.work707@gmail.com'

mail = Mail(app)  # Inisialisasi Flask-Mail

# Load YOLO model
model = YOLO('D:\\github\\sivi\\besty.pt')  # Ganti dengan path model Anda

app.config['SECRET_KEY'] = 'viavia-via'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sivi.db'

SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
db.init_app(app)

with app.app_context():
    db.create_all()

def send_payment_email(email):
    try:
        msg = Message('Instruksi Pembayaran', recipients=[email])
        msg.body = f"""
        Halo,

        Terima kasih telah mendaftar. Untuk mengaktifkan akun Anda, silakan lakukan pembayaran sesuai instruksi berikut:

        - Nomor Rekening: 1234567890 (BCA)
        - Nama Penerima: Nama Anda
        - Jumlah: Rp 50.000 (contoh)
        - Kirim bukti transfer ke email ini.

        Setelah pembayaran dikonfirmasi, akun Anda akan diaktifkan.

        Terima kasih!
        """
        mail.send(msg)
        print(f"Email terkirim ke {email}")
    except Exception as e:
        print(f"Error mengirim email: {str(e)}")

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()  # Ambil semua data user dari database
    users_data = [{
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_paid": user.is_paid,
        "role": user.role
    } for user in users]
    
    return jsonify(users_data), 200

@app.route("/signup", methods=["POST"])
def signup():
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]
    is_paid = request.json["is_paid"]
    role = request.json.get("role", "user")

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password, is_paid=is_paid, role=role)
    db.session.add(new_user)
    db.session.commit()

    # Kirim email pembayaran
    send_payment_email(email)

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "is_paid": new_user.is_paid,
        "role": new_user.role
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "unauthorized"}), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    if not user.is_paid:  # Cek apakah pengguna belum membayar
        return jsonify({"error": "Payment required"}), 402
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
        "is_paid": user.is_paid,
        "role": user.role
    })

@app.route('/update-payment', methods=['POST'])
def update_payment():
    data = request.get_json()
    email = data.get('email')

    # Mencari pengguna berdasarkan email
    user = User.query.filter_by(email=email).first()

    if user:
        # Mengubah status pembayaran menjadi True
        user.is_paid = True
        db.session.commit()  # Simpan perubahan ke database
        return jsonify({"is_paid": user.is_paid}), 200
    else:
        return jsonify({"error": "Email not found"}), 404
    
@app.route('/update-role', methods=['POST'])
def update_role():
    data = request.get_json()
    email = data.get('email')

    # Mencari pengguna berdasarkan email
    user = User.query.filter_by(email=email).first()

    if user:
        # Mengubah role pengguna menjadi Admin
        user.role = "admin"
        db.session.commit()  # Simpan perubahan ke database
        return jsonify({"role": user.role}), 201
    else:
        return jsonify({"error": "Email not found"}), 404

@app.route('/process_frame', methods=['POST'])
def process_frame():
    try:
        # Ambil data frame dari request
        data = request.json
        frame_base64 = data.get("frame")
        if not frame_base64:
            return jsonify({"error": "No frame provided"}), 400

        # Decode base64 ke numpy array
        frame_data = base64.b64decode(frame_base64)
        np_arr = np.frombuffer(frame_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Deteksi objek dengan YOLO
        results = model(frame)[0]
        detections = [{"class": results.names[class_id], "confidence": round(float(conf), 2)}
                      for class_id, conf in zip(results.boxes.cls.cpu().numpy(), results.boxes.conf.cpu().numpy())]

        return jsonify(detections)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, threaded=True)