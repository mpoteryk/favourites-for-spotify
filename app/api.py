
from urllib.parse import urlencode, quote_plus
import requests 
import base64
import json
from collections import Counter
from datetime import datetime
from math import floor

# TODO: rename to auth or spotifyapi?? then put this + helpers.py in a folder just called SpotifyAPI (find folder naming conv)
# (call these auth)

SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
CLIENT_URL = "http://127.0.0.1:5000"
REDIRECT_URI = f"{CLIENT_URL}/callback"
API_VERSION = "v1"
SPOTIFY_BASE_URL = f"https://api.spotify.com/{API_VERSION}"
SCOPE = "user-top-read"


# returns the url to redirect the user to spotify's authorization endpoint
def getAuthURL(clientID):
    params = {
        "client_id" : clientID, 
        "response_type" : "code", 
        "redirect_uri" : REDIRECT_URI,
        "scope" : SCOPE
    }

    queryParams = urlencode(params, quote_via = quote_plus)
    result = f"{SPOTIFY_AUTH_URL}?{queryParams}"
    return result


# returns a dictionary of the data of the access and refresh tokens
def getAuthData(authCode, clientID, clientSecret):
    params = {
        "grant_type" : "authorization_code", 
        "code": authCode,
        "redirect_uri" : REDIRECT_URI
    }

    headers = {
        "Authorization" : f"Basic {getAuthKey(clientID, clientSecret)}",
        "Content-Type" : "application/x-www-form-urlencoded"
    }

    response = requests.post(SPOTIFY_TOKEN_URL, data = params, headers = headers)
    responseJSON = json.loads(response.text)

    authData = {
        "access_token" : responseJSON["access_token"],
        "token_type" : responseJSON["token_type"],
        "expires_in" : responseJSON["expires_in"],
        "refresh_token" : responseJSON["refresh_token"]
    }

    return authData


# returns base 64 encoded auth string of client ID and client secret
def getAuthKey(clientID, clientSecret):
    clientCreds = f"{clientID}:{clientSecret}"
    clientCreds_b64 = base64.b64encode(clientCreds.encode())
    return clientCreds_b64.decode()


# returns the header used with access token to make requests to the api
def getHeader(accessToken):
    header = {
        "Authorization" : f"Bearer {accessToken}"
    }
    return header

# -----------------------------------------------
# functions that use spotify api (helpers)

def getCurrentUserProfile(accessToken):

    # TODO: add check for refresh token

    userProfileEndPoint = f"{SPOTIFY_BASE_URL}/me"
    response = requests.get(userProfileEndPoint, headers = getHeader(accessToken)) # TODO: add error checking
    userProfileObject = response.json()
    return userProfileObject

# returns the user's top items specified (returns unformatted JSON) 
def getUserTopItems(accessToken, itemType, limit, timeRange):
    
    userTopItemsEndPoint = f"{SPOTIFY_BASE_URL}/me/top/{itemType}"

    params = {
        "limit" : limit, 
        "time_range" : timeRange
    }

    queryParams = urlencode(params, quote_via = quote_plus)
    result = f"{userTopItemsEndPoint}?{queryParams}"
    response = requests.get(result, headers = getHeader(accessToken))
    userTopItemsObject = response.json()
    itemsJSON = userTopItemsObject["items"]
    return itemsJSON

# given the itemsJSON for type = "artists", format it 
# returns ....
def getUserTopArtists(accessToken, limit, timeRange):
    itemType = "artists"
    itemsJSON = getUserTopItems(accessToken, itemType, limit, timeRange)
    # create a list where each element is a dictionary of two keys of the artist name and artist images
    
    # if len(itemsJSON) < limit:
    #     return "the full number of artists could not be displayed at this time"

    artistList = []
    for artist in itemsJSON:
        artistImages = artist["images"]
        artistName = artist["name"]
        artistDict = {"artist_name" : artistName, "artist_images" : artistImages}
        artistList.append(artistDict)
    return artistList

# returns...
def getUserTopTracks(accessToken, limit, timeRange):
    itemType = "tracks"
    itemsJSON = getUserTopItems(accessToken, itemType, limit, timeRange)
    trackList = []
    for track in itemsJSON:
        trackName = track["name"]
        trackImage = track["album"]["images"]
        artistName = track["artists"][0]["name"]
        trackDict = {"track_name" : trackName, "track_images" : trackImage, "artist_name" : artistName}
        trackList.append(trackDict)
    return trackList 

# returns ... 
# get user top tracks
# get user genres from their top artists
# return a list of the top 10 user genres
def getUserTopGenres(accessToken, limit, timeRange):

    artistList = getUserTopItems(accessToken, "artists", limit, timeRange)
    genresList = []
    for artist in artistList:
        artistGenres = artist["genres"]
        for genre in artistGenres:
            genresList.append(genre)

    # get the 10 largest values in the dict (note: they will always be out of order)
    userTop10Genres = dict(Counter(genresList).most_common(10))
    return userTop10Genres


# given release date precision, returns the year released
def getReleaseYear(relDateStr, relDatePrecision):
    if relDatePrecision == "day":
        dateFormat = "%Y-%m-%d"
    elif relDatePrecision == "month":
        dateFormat = "%Y-%m"
    else:
        dateFormat = "%Y"
    relDate = datetime.strptime(relDateStr, dateFormat).date()
    return relDate.year

# returns a list of release years for tracks
def getTracksReleaseYear(accessToken, limit, timeRange):
    itemsJSON = getUserTopItems(accessToken, "tracks", limit, timeRange)
    releaseYears = []
    for track in itemsJSON:
        relDateStr = track["album"]["release_date"]
        relDatePrecision = track["album"]["release_date_precision"]
        releaseYear = getReleaseYear(relDateStr, relDatePrecision)
        releaseYears.append(releaseYear)
    return releaseYears

# for the given list of track release years, find the decade that each belongs to
# returns a dictionary of the user's top 5 most listened to decades for a given list of track release years
def getUserTopDecades(accessToken, limit, timeRange):
    releaseYears = getTracksReleaseYear(accessToken, limit, timeRange)
    decades = []
    for year in releaseYears:
        decade = floor(year/10)*10
        decades.append(decade)
    # gets the unique decades (use as the labels)
    decadeFreq = dict(Counter(decades).most_common(5))
    return decadeFreq



