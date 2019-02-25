import face_recognition
import sys
p1 = sys.argv[1]
p2 = sys.argv[2]
known_image = face_recognition.load_image_file(p1)
unknown_image = face_recognition.load_image_file(p2)
 
biden_encoding = face_recognition.face_encodings(known_image)[0]
unknown_encoding = face_recognition.face_encodings(unknown_image)[0]
 
results = face_recognition.compare_faces([biden_encoding], unknown_encoding)
print(results)