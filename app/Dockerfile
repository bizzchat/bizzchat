# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Install essential packages
RUN apt-get update && apt-get install -y build-essential

# Set the working directory to /app
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Set the environment variable for Flask
ENV FLASK_APP app.py

# Copy app
COPY . /app

# Run the command to start Flask
CMD ["flask", "run", "--host=0.0.0.0", "--debug"]
