# Favourites for Spotify

## Getting Started

Favourites for Spotify is a web application that displays a user's Spotify listening statistics in an intuitive and informative way. This is one of my first "full stack" projects.

I started this project in October 2022 by learning about REST APIs and interacting with Spotify's API. I then wrote code to connect with Spotify's API using Authorization Code Flow. During the middle of December I began designing the UI and its functionality. I then implemented this throughout the rest of December and January. Since then, I have been refactoring code and working on the features under [future development](https://github.com/mpoteryk/favourites-for-spotify#future-development).

### Demo

<img src="demo/demo1.gif" width="500" height="auto"> <img src="demo/demo3.gif" width="500" height="auto">
<!-- <img src="demo/demo2.gif" width="500" height="auto"> -->


<!-- ### Prerequisites
You will need to have the following installed on your machine:
* Python
-->

### Installation (_in progress_)

1. Clone this repository to your local machine 
```
git clone https://github.com/YOUR-USERNAME/favourites-for-spotify.git
```

2. Create a virtual environment within the project directory and activate it
```
python3 -m venv venv
```
```
source venv/bin/activate
```

3. Install the required packages 
```
pip install -r requirements.txt
```
4. Start the web application
```
flask run
```

## Features
* Top 5 artists
* Top 10 tracks
* Top 10 genres (bar chart)
* (Up to) Top 5 decades (doughnut chart)

__Note__: for each of these features, one of three time ranges may be selected: short term (approximately last 4 weeks), medium term (approximately last 6 months), and long term (past several years)

## Technologies & Frameworks
* Python
* Flask
* Jinja2
* HTML/CSS
* Bootstrap
* JavaScript
* Chart.js

## Future Development
* (Formal) Testing!
* Add links to artists and tracks
* Recommendations for creating playlists
* Ensuring secure web dev practices
* (Eventual) deployment

## Acknowledgements 
* [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/reference/#/)

