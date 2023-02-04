// ---------------------------------------------------------
// open spotify button
// ---------------------------------------------------------

var openSpotifyButton = document.querySelector("#open-spotify");

openSpotifyButton.addEventListener("mouseover", () => {
    document.querySelector(".spotify-logo").src = "/static/img/Spotify_Icon_RGB_Black.png";
});

openSpotifyButton.addEventListener("mouseleave", () => {
    document.querySelector(".spotify-logo").src = "/static/img/Spotify_Icon_RGB_White.png";
});


// ---------------------------------------------------------
// colours for top genres and decades charts 
// ---------------------------------------------------------

const doughnutChartColor = ["#380EB9", "#1A0546", "#5B1DED","#1C2373","#1596C2"];
const barChartColor = "#00E0C6";
const labelTextColor = "white";


// ---------------------------------------------------------
// default top genres and decades charts 
// ---------------------------------------------------------

// TODO: find a better solution for this because currently have only been able to do it with global vars
// or passing chart as a parameter to many functions.
// try making seperate .js file

let barChart; // global variables (ik ik bad practice)
let doughnutChart;

if ( ((window.location.pathname).split("/").join("")) == "favourites" ) { // removes forward slashes
    barChart = createBarChart(); 
    loadData("genres", "short_term");

    doughnutChart = createDoughnutChart();
    loadData("decades", "short_term");
}   

// ---------------------------------------------------------
// top genres chart
// ---------------------------------------------------------

function createBarChart(labels = [], values = []) {

    // set-up block
    const data = {
        labels: labels,
        datasets: [{
            label: "# of songs",
            data: values,
            borderWidth: 1,
            backgroundColor: barChartColor,
        }]
    };
    
    // config block
    const config = {
        type: "bar",
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: labelTextColor,
                        font: {
                            family: "Lato"
                        },
                        autoSkip: false
                    }
                }
            },
            plugins: {
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                }
            }
        }
    };

    // render block
    const genresChart = new Chart (
        document.getElementById('genresBarChart'),
        config
    );

    return genresChart;
}

// ---------------------------------------------------------
// top decades chart 
// ---------------------------------------------------------

function createDoughnutChart(labels, values) {

    // set-up block
    const data = {
        labels: labels,
        datasets: [{
          label: '# of songs',
          data: values,
          backgroundColor: doughnutChartColor,
          hoverOffset: 4
        }]
      };

      // config
    const config = {
        type: 'doughnut',
        data: data, 
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        color: labelTextColor,
                        boxWidth: 50,
                        font: {
                            family: "Lato",
                            size: 15
                        }
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let currentValue = context.raw;
                            return ': ' + currentValue + '%';
                        }
                    }
                }
            }
        }

    };

      // render block
      const decadesChart = new Chart (
        document.getElementById('decadesDoughnutChart'),
        config
      );

      return decadesChart;
}

// ---------------------------------------------------------
// time range radio buttons
// ---------------------------------------------------------

var radioButtons = document.querySelectorAll(".time-range-menu input[type = 'radio']");

radioButtons.forEach( function (element) {
    element.addEventListener("click", timeRangeButton);
});

async function fetchData(itemType, timeRange) {
    const baseURL = "/favourites/itemType=" + itemType + "&" + "timeRange=" + timeRange + "/";
    const response = await fetch(baseURL); // await allows the code below to wait for this to be finished running
    const data = await response.json();
    return data;
}

// creating the top artists container for the given time range
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

// creating the top tracks container for the given time range
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
        trackImageCell.setAttribute("class", "track-image-cell");
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

        let trackContainerRow = document.createElement("div");
        trackContainerRow.setAttribute("class", "row");
        trackContainer.appendChild(trackContainerRow);

        let trackArtistNameContent = '<div class = "col-xs-6" id = "track-name">' + data[i].track_name + '</div><div class = "col-xs-6" id = "artist-name">' + data[i].artist_name + '</div>';
        trackContainerRow.insertAdjacentHTML("afterbegin", trackArtistNameContent);
    }
}

function formatTopGenres(data) {
    let labels = Object.keys(data);
    let values = Object.values(data);
    updateChart(barChart, labels, values);
}

// calculates the percentage of each decade
function getPercentage(data) {

    let labels = Object.keys(data);
    let values = Object.values(data);
    let sum = 0;

    values.forEach(val => {
        sum += val;
    });

    labels.forEach((label) => {
        data[label] = (((data[label] / sum)) * 100);
    });

    return data;
}

function formatTopDecades(data) {

    let percentData = getPercentage(data);

    let sortedArray = Object.entries(percentData).sort((a, b) => {
        if (a[1] == b[1]) {
            return 0;
        }
        else {
            return (a[1] < b[1]) ? -1 : 1;
        }

    }).reverse();

    let labels = [];
    let values = [];

    for (let i = 0; i < sortedArray.length; i++) {
        labels.push(sortedArray[i][0]);
        values.push(sortedArray[i][1]);
    }

    updateChart(doughnutChart, labels, values);
}

// removes labels and values from the chart
// assuming only one dataset is being used
function clearData(chart, noAnimation = "none") {
    // remove each of the labels
    while (chart.data.labels.length > 0) { 
        chart.data.labels.pop();
        chart.data.datasets[0].data.pop(); // remove all the data from the first dataset (assuming it's the only one)
    }
    chart.update(noAnimation);
}

// updates the chart with completely new labels and values
function updateChart(chart, labels, values, noAnimation = "none") {

    // first, remove the pre-existing labels and values
    clearData(chart);

    labels.forEach((label) => {
        chart.data.labels.push(label);
    });

    values.forEach((value) => {
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(value);
        });
    });

    // note to self: uncomment if want to remove animation
    //chart.update(noAnimation);
    chart.update();
}

// calls fetch API and retrieves information about corresponding item type
function loadData(itemType, timeRange) {
    fetchData(itemType, timeRange).then((data) => {
        if (itemType == "artists") { 
            formatTopArtists(data);
        }
        else if (itemType == "tracks") {
            formatTopTracks(data);
        }
        else if (itemType == "genres") {
            formatTopGenres(data);
        }
        else if (itemType == "decades") {
            formatTopDecades(data);
        }
    });
}

// defines behaviour of radio button depending which one in which group was selected
function timeRangeButton(e) {

    var clickedButton = e.target.value;
    var buttonParentID = e.target.parentNode.id; 

    // determining item type
    if (buttonParentID == "artist-buttons") { 
        itemType = "artists";
    }
    else if (buttonParentID == "track-buttons") {
        itemType = "tracks";
    }
    else if (buttonParentID == "genre-buttons") {
        itemType = "genres";
    }
    else if (buttonParentID == "decade-buttons") {
        itemType = "decades";
    }

    // determining time range
    if (clickedButton == "short-term-button") {
        timeRange = "short_term";
    }
    else if (clickedButton == "medium-term-button") {
        timeRange = "medium_term";
    }
    else { 
        timeRange = "long_term";
    }
    loadData(itemType, timeRange);
  }

