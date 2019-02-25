import cv2
import numpy as np
import imutils
from scipy.spatial import distance as dist
from PIL import Image
import dlib
import sys 
import json


def eye_aspect_ratio(eye):
    # compute the euclidean distance between the vertical eye landmarks
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])

    # compute the euclidean distance between the horizontal eye landmarks
    C = dist.euclidean(eye[0], eye[3])

    # compute the EAR
    ear = (A + B) / (2 * C)
    return ear

def count_blinks(video):

    JAWLINE_POINTS = list(range(0, 17))
    RIGHT_EYEBROW_POINTS = list(range(17, 22))
    LEFT_EYEBROW_POINTS = list(range(22, 27))
    NOSE_POINTS = list(range(27, 36))
    RIGHT_EYE_POINTS = list(range(36, 42))
    LEFT_EYE_POINTS = list(range(42, 48))
    MOUTH_OUTLINE_POINTS = list(range(48, 61))
    MOUTH_INNER_POINTS = list(range(61, 68))

    EYE_AR_THRESH = 0.22
    EYE_AR_CONSEC_FRAMES = 3
    EAR_AVG = 0

    COUNTER = 0
    TOTAL = 0
    FIRST = 0

#    print("[INFO] loading facial landmark predictor...")
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor('/home/siddharthp538/Tiger-Auth/python/shape_predictor_68_face_landmarks.dat')

    stream = cv2.VideoCapture(video)
    #fps = FPS().start()
    #time.sleep(1.0)

    while True:
        grabbed, frame = stream.read()
        if not grabbed:
            break
        frame = imutils.resize(frame, width = 450)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if FIRST == 0:
            img = Image.fromarray(frame, 'RGB')
            #img.show()
            FIRST = 1

        rects = detector(gray, 0)

        for rect in rects:
            x = rect.left()
            y = rect.top()
            x1 = rect.right()
            y1 = rect.bottom()

            #get the facial landmarks
            landmarks = np.matrix([[p.x, p.y] for p in predictor(frame, rect).parts()])
            # get the left eye landmarks
            left_eye = landmarks[LEFT_EYE_POINTS]
            # get the right eye landmarks
            right_eye = landmarks[RIGHT_EYE_POINTS]
            # draw contours on the eyes
            left_eye_hull = cv2.convexHull(left_eye)
            right_eye_hull = cv2.convexHull(right_eye)
            cv2.drawContours(frame, [left_eye_hull], -1, (0, 255, 0), 1) # (image, [contour], all_contours, color, thickness)
            cv2.drawContours(frame, [right_eye_hull], -1, (0, 255, 0), 1)
            # compute the EAR for the left eye
            ear_left = eye_aspect_ratio(left_eye)
            # compute the EAR for the right eye
            ear_right = eye_aspect_ratio(right_eye)
            # compute the average EAR
            ear_avg = (ear_left + ear_right) / 2.0
            # detect the eye blink


            if ear_avg < EYE_AR_THRESH:
                COUNTER += 1
            else:
                if COUNTER >= EYE_AR_CONSEC_FRAMES:
                    TOTAL += 1
                    print("Eye Blinked")
                COUNTER = 0

    stream.release()
    #imgdesc = open(img, 'rb')
    #results = {
    #    'blinks': TOTAL,
    #    'media' : img
    #}
    results = {
        "blinks": TOTAL,
        "img": img
    }
    return [TOTAL, img]
path = sys.argv[1]
list   = count_blinks(path)
print(list)
sys.stdout.flush()
#stream = cv2.VideoCapture('/media/shruti/DATA/noderest/blink-detection/2019-02-20-130516.mp4')
#print(type(stream))
#desc = count_blinks(stream)
#desc["media"].show()
#print(desc)
#return results
