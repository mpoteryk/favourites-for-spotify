
// time range buttons ----------------------------------------------------------------

var buttons = document.querySelectorAll(".time-range-menu");

buttons.forEach( function (element) {
    element.addEventListener("click", timeRangeButton);
});

async function fetchData(itemType, timeRange) {
    const baseURL = "/favourites/itemType=" + itemType + "&" + "timeRange=" + timeRange + "/";
    const response = await fetch(baseURL); // await allows the code below to wait for this to be finished running
    const data = await response.json();
    return data;
}

function formatTopArtists(data) {
    const topArtistsContainer = document.querySelector("#top-artists-container");
    topArtistsContainer.innerHTML = ""; // clear the content

    let rowElement = document.createElement("div");
    rowElement.setAttribute("class", "row");
    topArtistsContainer.appendChild(rowElement);

    for (let i = 0; i < data.length; i++) {
        let colElement = document.createElement("div");
        colElement.setAttribute("class", "col");
        rowElement.appendChild(colElement);

        let cardElement = document.createElement("card");
        cardElement.setAttribute("class", "card");
        cardElement.setAttribute("id", "artist-card");
        colElement.appendChild(cardElement);

        let artistImageElement = document.createElement("img");
        artistImageElement.setAttribute("class", "card-img-top");
        artistImageElement.setAttribute("id", "artist-img");
        artistImageElement.src = data[i].artist_images[0].url;
        cardElement.appendChild(artistImageElement);

        let artistNameElement = document.createElement("div");
        artistNameElement.setAttribute("class", "card-body");
        artistNameElement.setAttribute("id", "artist-text");
        let artistNameContent = '<p class = "card-text">' + data[i].artist_name + '</p>';
        artistNameElement.insertAdjacentHTML("afterbegin", artistNameContent);
        cardElement.appendChild(artistNameElement);
    }
}

function formatTopTracks(data) {
    const tracksTableBody = document.querySelector("#tracks-table-body");
    
    tracksTableBody.innerHTML = ""; // clear it so it does not just append it!

    // insert as many rows as the number of items in data (10)
    for (let i = 0; i < data.length; i++) {
        let row = tracksTableBody.insertRow(i); // add it to the ith position of the table

        // table cell for the track rank
        let rankCell = row.insertCell(0);
        rankCell.setAttribute("class", "rank");
        rankCell.innerText = i + 1;

        // table cell for the track image
        let trackImageCell = row.insertCell(1);
        let trackImage = document.createElement("img");
        trackImage.setAttribute("class", "track-image");
        trackImage.src = data[i].track_images[0].url;
        trackImageCell.appendChild(trackImage);

        // table cell for the container with rows of the track name and artist name
        let trackArtistNameCell = row.insertCell(2);
        trackArtistNameCell.setAttribute("class", "track-and-artist-name");

        let trackContainer = document.createElement("div");
        trackContainer.setAttribute("class", "container");
        trackArtistNameCell.appendChild(trackContainer);

        let trackArtistNameContent = '<div class = "row" id = "track-name">' + data[i].track_name + '</div><div class = "row" id = "artist-name">' + data[i].artist_name + '</div>';
        trackContainer.insertAdjacentHTML("afterbegin", trackArtistNameContent);
    }
}

function loadData(itemType, timeRange) {
    fetchData(itemType, timeRange).then((data) => {
        if (itemType == "artists") { 
            formatTopArtists(data);
        }
    
        else if (itemType == "tracks") {
            formatTopTracks(data);
        }
    });

}

function timeRangeButton(e) {
    var clickedButton = e.target.id;
    var buttonParentID = e.target.parentNode.id; 

    // determining item type
    if (buttonParentID == "artist-buttons") { 
        itemType = "artists";
    }
    else if (buttonParentID == "track-buttons") {
        itemType = "tracks";
    }

    // determining time range
    if (clickedButton == "short-term-button") {
        timeRange = "short_term";
    }
    else if (clickedButton == "medium-term-button") {
        timeRange = "medium_term";
    }
    else { // or just do else if?? or do all of these as switch statemetns
        timeRange = "long_term";
    }

    loadData(itemType, timeRange);
  }

