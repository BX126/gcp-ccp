from flask_cors import CORS
from flask import Flask, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
from multiprocessing import Process
import subprocess
import json
from redis import Redis
from rq import Queue
from run_job import run_job

app = Flask(__name__)
CORS(app)


app.config['UPLOAD_FOLDER'] = './data' 

# redis_conn = Redis(port=6379, decode_responses=True)
redis_conn =  Redis(host = "redis", port=6379, decode_responses=True)
q = Queue(connection=redis_conn) 

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    email = request.form['email']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    directory = os.path.join(app.config['UPLOAD_FOLDER'], str(email))
    if not os.path.exists(directory):
        os.makedirs(directory)
    filename = str(email) + "/" + secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    return jsonify({"message": "File uploaded successfully", "path": filepath}), 200


@app.route('/api/get_jobs', methods=['GET'])
def get_jobs():
    email = request.args.get('email')
    with open("./jobs.json", "r") as f:
        jobs = json.load(f)
    if email not in jobs:
        jobs[email] = []
    jobs = jobs[email]
    return jsonify(jobs)


@app.route('/api/add_job', methods=['POST'])
def add_job():
    with open("./jobs.json", "r") as f:
        jobs = json.load(f)
    email = request.get_json()["data"]['email']
    if email not in jobs:
        jobs[email] = []
    job_id = len(jobs[email]) + 1
    name = request.get_json()["data"]['name']
    ancestry = request.get_json()["data"]['ancestry']
    models = request.get_json()["data"]['models']
    chrNumber = request.get_json()["data"]['CHR']
    file = request.get_json()["data"]['file']
    for i in models:
        for j in chrNumber:
            job_info = {
                'id': job_id,
                'name': name + "_" + i + "_CHR" + str(j),
                'ancestry': ancestry,
                'models': i,
                'CHR': j,
                'file': file,
                'status': 'queued', 
            }
            jobs[email].append(job_info)
   
            job = q.enqueue(run_job, job_id, email, ancestry, i, j, file)
            job_id += 1

    with open("./jobs.json", "w") as f:
        json.dump(jobs, f)

    return jsonify(success=True)

@app.route('/api/download/<user>/<filename>', methods=['GET'])
def download_file(user, filename):
    print(user)
    print(filename)
    name = ""
    output_dir = './methods/BLISS/out/' 
    with open("./jobs.json", "r") as f:
        jobs = json.load(f)
    for job in jobs[str(user)]:
        if job["id"] == int(filename):
            name = job["result"]
            break
    return send_from_directory(output_dir, name, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, port=5000, threaded=True)
