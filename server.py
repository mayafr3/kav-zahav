import wakkaide.network_file
wakkaide.network_file.setup()
from flask import Flask
from flask import request
import requests
import time
import threading
import os

# This is an example of a basic Flask server.
# Feel free to try it for yourself!

app = Flask(__name__)

@app.route("/")
def index():
  f = open('APP!/public/openning_page.html', "r")
  print(f.read())
  return f.read(), 200, {'Content-Type': 'text/html'}

@app.route("/<path:path>")
def get_file(path):
  try:
    f = open('APP!/public/' + path, "rb" if is_binary(path) else "r")
    return f.read(), 200, {'Content-Type': get_content_type(path)}
  except FileNotFoundError:
    error_message = 'FileNotFoundError: No such file: ' + path
    print(error_message)
    return error_message, 500, {'Content-Type': 'text/html'}

def get_content_type(path):
  print(path)
  if path.endswith('.html'):
    return 'text/html'
  if path.endswith('.json'):
    return 'application/json'
  if path.endswith('.js'):
    return 'text/javascript'
  if path.endswith('.txt'):
    return 'text/plain'
  if path.endswith('.css'):
    return 'text/css'
  if path.endswith('.svg'):
    return 'image/svg+xml'
  if path.endswith('.ico'):
    return 'image/x-icon'
  if path.endswith('.png'):
    return 'image/png'
  if path.endswith('.jpg'):
    return 'image/jpeg'
  if path.endswith('.gif'):
    return 'image/gif'

def is_binary(path):
  _, file_extension = os.path.splitext(path)
  return file_extension in ['.ico', '.png', '.jpg', '.gif']

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000)


