FROM python:3.10-slim

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y --no-install-recommends r-base build-essential && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN R -e "install.packages(c('data.table', 'BEDMatrix', 'dplyr', 'MASS', 'optparse'), repos='http://cran.rstudio.com/')"

COPY . .

EXPOSE 5000

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

CMD ["flask", "run"]
