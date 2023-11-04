import os
import subprocess
import json
from flask import current_app as app


def run_job(job_id,email,ancestry,models,chrNumber,file):

    directory = "../../data/" + str(email)

    with open("./jobs.json", "r") as f:
        jobs = json.load(f)

    for job in jobs[email]:
            if job["id"] == job_id:
                job["status"] = "running"
                break

    with open("./jobs.json", "w") as f:
                json.dump(jobs, f)

    try:
        cmd = [
            'Rscript', "./methods/BLISS/BLISS_Association.R",
            '--sumstats', file,
            '--sumstats_dir', directory,
            '--weights_models', models,
            '--CHR', str(chrNumber),
            '--output_dir', './out',
            '--output_name', f'stroke_res_{models}_CHR{chrNumber}.txt'
        ]
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()

        process.wait()
        
        if process.returncode == 0:
            
            with open("./jobs.json", "r") as f:
                jobs = json.load(f)
            
            for job in jobs[email]:
                if job["id"] == job_id:
                    job["status"] = "completed"
                    job["result"] = f'stroke_res_{job["models"]}_CHR{job["CHR"]}.txt'
                    break

            with open("./jobs.json", "w") as f:
                json.dump(jobs, f)

            print(f"Job {job_id} finished successfully")
        else:
            print(f"Job {job_id} failed with the following error:\n{stderr.decode('utf-8')}")

    except Exception as e:
        print(f"An error occurred while running job {job_id}: {str(e)}")
