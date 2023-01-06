import os
import json

# Call from root directory to generate captions.json

captions = list()
for file in os.listdir("assets/images/gallery"):
    if ".jpg" in file or ".png" in file:
        if "_" in file:
            caption = file[:file.find("_")]
        else:
            caption = file[:-4]
        captions.append(dict(src="./assets/images/gallery/" + file, caption=caption))

# captions.json is read-in by $.getJSON() in index.js

with open("assets/captions.json", "w") as f:
    json.dump(captions, f)
