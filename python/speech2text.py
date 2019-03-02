import speech_recognition as sr
import sys

r = sr.Recognizer()
audio = sys.argv[1]
with sr.AudioFile(audio) as source:
    audio = r.record(source)
try:
    text = r.recognize_google(audio, language = 'en-us')
    print(text)
    sys.stdout.flush()
except:
    pass 