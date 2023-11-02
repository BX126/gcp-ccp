from flask_cors import CORS
from flask import Flask, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
from multiprocessing import Process
import subprocess
import json

app = Flask(__name__)
CORS(app)


app.config['UPLOAD_FOLDER'] = '/Users/bx/Desktop/bccp/backend/data' 


def run_job(job_id, script_path):
    try:
        cmd = [
            'Rscript', "/Users/bx/Desktop/bccp/backend/methods/BLISS/BLISS_Association.R",
            '--sumstats', 'Stroke_eur_GBMI_CHR22.sumstats',
            '--sumstats_dir', '/Users/bx/Desktop/bccp/backend/methods/BLISS/',
            '--weights_models', 'UKB',
            '--CHR', '22',
            '--output_dir', '/Users/bx/Desktop/bccp/backend/methods/BLISS/out/',
            '--output_name', f'stroke_res_{job_id}.txt'
        ]
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()

        process.wait()
        
        if process.returncode == 0:
            
            with open("/Users/bx/Desktop/bccp/backend/jobs.json", "r") as f:
                jobs = json.load(f)
            
            for job in jobs["1"]:
                if job["id"] == job_id:
                    job["status"] = "completed"
                    job["result"] = f'stroke_res_{job_id}.txt'
                    break

            with open("/Users/bx/Desktop/bccp/backend/jobs.json", "w") as f:
                json.dump(jobs, f)

            print(f"Job {job_id} finished successfully")
        else:
            print(f"Job {job_id} failed with the following error:\n{stderr.decode('utf-8')}")

    except Exception as e:
        print(f"An error occurred while running job {job_id}: {str(e)}")

# def update_jobs(job_id, jobs):
#     print(len(jobs))
#     for job in jobs:
#         print(job["id"])
#         if job["id"] == job_id:
#             job["status"] = "completed"
#             job["result"] = f'stroke_res_{job_id}.txt'
#             break

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
    with open("/Users/bx/Desktop/bccp/backend/jobs.json", "r") as f:
        jobs = json.load(f)
    jobs = jobs["1"]
    return jsonify(jobs)

@app.route('/api/add_job', methods=['POST'])
def add_job():
    with open("/Users/bx/Desktop/bccp/backend/jobs.json", "r") as f:
        jobs = json.load(f)
    if "1" not in jobs:
        jobs["1"] = []
    job_id = len(jobs["1"]) + 1
    jobs["1"].append({
        'id': job_id,
        'name': request.get_json()['name'],
        'status': 'running',
    })

    with open("/Users/bx/Desktop/bccp/backend/jobs.json", "w") as f:
        json.dump(jobs, f)

    job = Process(target=run_job, args=(job_id,""))
    job.start()

    return jsonify(success=True)

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    print(filename)
    output_dir = '/Users/bx/Desktop/bccp/backend/methods/BLISS/out/' 
    filename = f'stroke_res_{filename}.txt'
    return send_from_directory(output_dir, filename, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, port=5000, threaded=True, processes=3)
