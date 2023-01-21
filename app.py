from flask import Flask, request, url_for, session, redirect, render_template
# from flask_session import Session
import requests 
import base64
import json
from urllib.parse import urlencode, quote_plus
import logging

from collections import Counter
from datetime import datetime
from math import floor

from dotenv import load_dotenv
import os

load_dotenv()


### constants ### 

SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
CLIENT_URL = "http://127.0.0.1:5000"
REDIRECT_URI = f"{CLIENT_URL}/callback"
API_VERSION = "v1"
SPOTIFY_BASE_URL = f"https://api.spotify.com/{API_VERSION}"
SCOPE = "user-top-read"

NUMBER_OF_ARTISTS = 5
NUMBER_OF_TRACKS = 10
NUMBER_OF_GENRES = 50
NUMBER_OF_DECADES = 50

##############################

app = Flask(__name__)
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"
# Session(app)

app.secret_key = os.getenv("SECRET_KEY")

@app.route("/")
def index():
    return "hi"


