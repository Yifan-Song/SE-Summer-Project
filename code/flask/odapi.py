from flask import Flask, render_template, request, json
import os
import odapi_server
import numpy as np
import sys
from PIL import Image
import json
import re
import time
import subprocess as sp
import base64
from io import BytesIO
import csv
UPLOAD_FOLDER = '/Users/darlenelee/Documents/vir_env/models/research/object_detection/upload'
WEBURL = "http://47.106.8.44:8080/"
VIDEO_URL = WEBURL + "live/camera2.m3u8"
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route("/")
def index():
    return render_template('index.html')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


class JsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(JsonEncoder, self).default(obj)


@app.route("/receiver", methods=['POST'])
def receive():
    postValues= request.form.get("img")
    image_data = re.sub('^data:image/.+;base64,', '', postValues)
    im = Image.open(BytesIO(base64.b64decode(image_data)))
    im.save('query.jpg')
    csvfile = open('query.csv','a')
    writer = csv.writer(csvfile)
    writer.writerow([1,'query.jpg'])
    csvfile.close()
    return json.dumps({'result': 'success'}), 200, {'ContentType': 'application/json'}

    
@app.route("/stream", methods=['GET','POST'])
def video():
    postValues= request.form.get("img")
    image_data = re.sub('^data:image/.+;base64,', '', postValues)
    im = Image.open(BytesIO(base64.b64decode(image_data)))
    im.save('query.jpg')
    csvfile = open('query.csv','wb')
    writer = csv.writer(csvfile)
    writer.writerow([1,'query.jpg'])
    csvfile.close()
    index = 0
    while True:
        print("test----")
        pipe = sp.Popen([ "ffmpeg", "-i", VIDEO_URL,
                "-loglevel", "quiet", # no text output
                "-an",   # disable audio
                "-f", "image2pipe",
                "-pix_fmt", "bgr24",
                "-vcodec", "rawvideo", "-"],
                stdin = sp.PIPE, stdout = sp.PIPE)
        index = index+1
        while True:
            raw_image = pipe.stdout.read(1280*720*3)
            image =  np.fromstring(raw_image, dtype='uint8')
            image = np.array(image).reshape(720,1280,3)
            result = odapi_server.detect(image,'gallery.csv',index)
            print(result)
            break
    return json.dumps(result, cls=JsonEncoder)

if __name__ == '__main__':
    port = 5000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    app.run(host='0.0.0.0',port = port)
