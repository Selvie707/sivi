from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from ultralytics import YOLO
from flask_cors import CORS

# Inisialisasi aplikasi Flask
app = Flask(__name__)
CORS(app)

# Load YOLO model
model = YOLO('C:\\Users\\USER\\Downloads\\tes\\besty.pt')  # Ganti dengan path model Anda

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