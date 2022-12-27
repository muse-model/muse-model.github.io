import os
import json

captions = list()
for file in os.listdir("."):
    if ".jpg" in file or ".png" in file:
        if "_" in file:
            caption = file[:file.find("_")]
        else:
            caption = file[:-4]
        captions.append(dict(src="./images/gallery/" + file, caption=caption))

print(json.dumps(captions))

    

