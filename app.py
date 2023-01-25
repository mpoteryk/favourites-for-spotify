from flask import Flask, request, url_for, session, redirect, render_template
from flask_session import Session
from datetime import timedelta
from dotenv import load_dotenv
import os

from api import getAuthURL, getAuthData, getCurrentUserProfile, getUserTopArtists, getUserTopTracks

load_dotenv()

NUMBER_OF_ARTISTS = 5
NUMBER_OF_TRACKS = 10
NUMBER_OF_GENRES = 50
NUMBER_OF_DECADES = 50

#TODO: change these to capitals?
clientID = os.getenv("CLIENT_ID")
clientSecret = os.getenv("CLIENT_SECRET")

# TO DO LIST:
# TODO: deal with the refesh token, add logic for it
# TODO: look into flask decorators to verify user is logged in before performing function
# TODO: on html page, simplify code and make more efficient

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours = 1)

Session(app)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/auth/")
def auth():
    authURL = getAuthURL(clientID)
    return redirect(authURL)


@app.route("/callback/")
def callback():

    if request.args.get("error") is not None:
        return "error :(" #TODO: change this to something obviously more informative

    authCode = request.args["code"]
    session["authHeader"] = getAuthData(authCode, clientID, clientSecret)
    return redirect(url_for("favourites"))


@app.route("/favourites/")
def favourites(): 

    accessToken = session["authHeader"]["access_token"]

    userProfile = getCurrentUserProfile(accessToken)
    displayName = userProfile["display_name"]
    profileImage = userProfile["images"][0]["url"]

    userProfileDict = {
        "display_name" : displayName, 
        "profile_image" : profileImage
    }

    userTopArtistsShort = getUserTopArtists(accessToken, NUMBER_OF_ARTISTS, "medium_term") 
    userTopTracksShort = getUserTopTracks(accessToken, NUMBER_OF_TRACKS, "short_term") 

    return render_template("favourites.html", 
    userProfile = userProfileDict, 
    userTopArtists = userTopArtistsShort,
    userTopTracks = userTopTracksShort)


@app.route("/logout")
def logout():
    return "logging out"

