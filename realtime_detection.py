import cv2
import supervision as sv
from ultralytics import YOLO
import os

# Load model YOLO
model = YOLO('C:\\Users\\USER\\Downloads\\tes\\besty.pt')  # Ganti dengan path model Anda

bounding_box_annotator = sv.BoundingBoxAnnotator()
label_annotator = sv.LabelAnnotator()

# Buka kamera
cap = cv2.VideoCapture(0)  # Gunakan '0' untuk kamera default laptop

if not cap.isOpened():
    print("Unable to read camera feed")

img_counter = 0

while True:
    ret, frame = cap.read()

    if not ret:
        break

    results = model(frame)[0]
    detections = sv.Detections.from_ultralytics(results)

    annotated_image = bounding_box_annotator.annotate(scene=frame, detections=detections)
    annotated_image = label_annotator.annotate(scene=annotated_image, detections=detections)

    cv2.imshow("Webcam", annotated_image)

    k = cv2.waitKey(1)

    if k%256 == 27:
        print("Escape hit, closing...")
        break

# Lepaskan kamera dan tutup jendela
cap.release()
cv2.destroyAllWindows()