import speech_recognition as sr
r = sr.Recognizer()

audio = 'test.wav'
with sr.AudioFile(audio) as source:
    audio = r.record(source)
try:
    text = r.recognize_google(audio, language = 'en-us')
    print(text)
except:
    pass 