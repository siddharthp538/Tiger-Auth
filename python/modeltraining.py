import pickle
import numpy as np
from scipy.io.wavfile import read
from sklearn.mixture import GaussianMixture
#from sklearn import datasets
from featureextraction import extract_features
#from speakerfeatures import extract_features
import warnings
import sys
warnings.filterwarnings("ignore")


training = sys.argv[1]
#path to training data
# source   = "development_set/"
#source   = "trainingData/"   

#path where training speakers will be saved

# dest = "speaker_models/"
# train_file = "development_set_enroll.txt"

dest = sys.argv[2]
#train_file = "trainingDataPath.txt"        
file_paths = open(training,'r')

count = 1
# Extracting features for each speaker (5 files per speaker)
features = np.asarray(())
for path in file_paths:    
    path = path.strip()   
    #print (path)
    
    # read the audio
    sr,audio = read(path)
    
    # extract 40 dimensional MFCC & delta MFCC features
    vector   = extract_features(audio,sr)
    #print(vector)
    
    if features.size == 0:
        features = vector
    else:
        features = np.vstack((features, vector))
    # when features of 5 files of speaker are concatenated, then do model training
	# -> if count == 5: --> edited below
    if count == 5:    
        gmm = GaussianMixture(n_components = 16, max_iter = 200, covariance_type='diag',n_init = 3)
        gmm.fit(features)
        
        # dumping the trained gaussian model
        picklefile = "voice.gmm"
        pickle.dump(gmm,open(dest + picklefile,'wb'))
        print ('+ modeling completed for speaker:',picklefile," with data point = ",features.shape)    
        features = np.asarray(())
        count = 0
    count = count + 1
