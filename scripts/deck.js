const pre_url = 'http://54.226.124.34:8000/api/get_all_google_roads'
//const pre_url = 'http://127.0.0.1:8000/api/get_all_google_roads'
const pre_url2 = "http://54.226.124.34:8000/api"
//const pre_url2 = "http://127.0.0.1:8000/api"

const { DeckGL, PathLayer, PolygonLayer, ColumnLayer } = deck;

const LINE_COLOR = [0, 255, 0]; // Green color for the lines

// Get the target element by id
const targetElement = document.getElementById('map');

const deckcontainer = new DeckGL({
    container: targetElement,
    mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    //mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    initialViewState: {
        longitude: 3.3360,
        latitude: 6.5238,
        zoom: 11,
        maxZoom: 20,
        bearing: 0

    },
    controller: true,
});

//1. Get data

/* const apiUrl = "http://127.0.0.1:8000/api/get_all_google_roads"

function fetchDataandToggle() {
    let skip = 0;
    let limit = 10000
    let chuncksize = 10000
    while (limit < 179000) {

        //Fetch data from API
        fetch(`${apiUrl}?skip=${skip}&limit=${limit}`).then(response => {
            if (!response.ok) {
                throw new Error("Network response not OK");
            }

            //Parse the JSON response
            return response.json();
        }).then(data => {
            allData = allData.concat(data);
            toggle(data);
        }).catch(error => {
            console.error("There was a problem with the fetch operation: ", error);
        })

        skip += chuncksize;
        limit += chuncksize;
    }

}
fetchDataandToggle();

function updatedata(data) {

}


function toggle(data) {
    let layers = [
        new PathLayer({
            id: 'GridLayer',
            data: data, // Provide your route dataset here
            getPath: d => d.geometry, // Assuming your route dataset has a 'path' property
            getColor: [0, 255, 0], // Red color for routes
            getWidth: 20, // Width of the route lines
            getDashArray: [8, 4], // Dashed line effect
            pickable: true,
            visible: true
        }),
    ]

    deckcontainer.setProps({ layers });

}
 */

const oyoUrl = pre_url + "?state_name=Oyo"
const ogunUrl = pre_url + "?state_name=Ogun"
const lagUrl = pre_url + "?state_name=Lagos"
const edoUrl = pre_url + "?state_name=Edo"
const deltaUrl = pre_url + "?state_name=Delta"
const kwaraUrl = pre_url + "?state_name=Kwara"
let uniObject = {}


// Get General statistics
function updateGeneralStats() {
    //Get the containers
    let total_col_km_24 = document.getElementById('km24');
    let total_col_km_24_percent = document.getElementById('km24percent')
    let total_uploads_24 = document.getElementById('totaluploads')
    let total_uploads_km_24 = document.getElementById('totalkmupload')
    let cam_1_km_24 = document.getElementById('cam1km')
    let cam_1_km_24_percent = document.getElementById('cam1kmpercent')
    let cam_2_km_24 = document.getElementById("cam2km");
    let cam_2_km_24_percent = document.getElementById('cam2kmpercent');
    let cam_3_km_24 = document.getElementById("cam3km");
    let cam_3_km_24_percent = document.getElementById("cam3kmpercent");
    let cam_4_km_24 = document.getElementById("cam4km");
    let cam_4_km_24_percent = document.getElementById("cam4kmpercent");
    let cam_5_km_24 = document.getElementById("cam5km");
    let cam_5_km_24_percent = document.getElementById("cam5kmpercent");

    fetch(pre_url2 + "/get_stats").then(response => {
        if (!response.ok) {
            throw new Error("network response was not OK");
        }
        return response.json();
    })
        .then(data => {
            total_col_km_24.textContent = data["covered_km"].toFixed(2);
            total_col_km_24_percent.textContent = data["percent_covered"].toFixed(2);
            total_uploads_24.textContent = data["total_uploads"].toFixed(2);
            total_uploads_km_24.textContent = data["total_upload_km"].toFixed(2);
            cam_1_km_24.textContent = data["cam1_km"].toFixed(2);
            cam_1_km_24_percent.textContent = data["cam1_percent"].toFixed(2);
            cam_2_km_24.textContent = data["cam2_km"].toFixed(2);
            cam_2_km_24_percent.textContent = data["cam2_percent"].toFixed(2);
            cam_3_km_24.textContent = data["cam3_km"].toFixed(2);
            cam_3_km_24_percent.textContent = data["cam3_percent"].toFixed(2);
            cam_4_km_24.textContent = data["cam4_km"].toFixed(2);
            cam_4_km_24_percent.textContent = data["cam4_percent"].toFixed(2);
            cam_5_km_24.textContent = data["cam5_km"].toFixed(2);
            cam_5_km_24_percent.textContent = data["cam5_percent"].toFixed(2);

        })
        .catch(error => {
            console.log("Error Fetching data:", error);
            return null;
        });
}

// Get State statistics
function getStateStatistics() {
    fetch(pre_url2 + "/get_state_stats").then(response => {
        if (!respomnse.ok) {
            throw new Error('Network Response was not ok');
        }
        return response.json();
    })
        .then(data => {

        })
        .catch(error => {
            conaole.log('Error Fetching Data:', error);
            return null;
        })
}

// Select and edit road details and information
updateGeneralStats();

function fetchData(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        return response.json();
    })
        .then(data => {
            datakey = url.split("=")
            dkey = datakey[1]
            updateUniObject(uniObject, dkey, data);
        })
        .catch(error => {
            console.log("Error fetching data:", error);
            return null;
        });
}

Promise.all([fetchData(lagUrl), fetchData(oyoUrl), fetchData(ogunUrl), fetchData(edoUrl), fetchData(deltaUrl), fetchData(kwaraUrl)])

function updateUniObject(uniObj, objkey, data) {
    uniObj[objkey] = data;
    toggle();
}

function toggle() {
    let layers = Object.entries(uniObject).map(([key, value]) => {
        let visibility = document.getElementById(key).checked
        return new PathLayer({
            id: key,
            data: value,
            getPath: d => d.geometry, // Assuming your route dataset has a 'path' property
            getColor: d => {
                const stat = d.status;
                if (stat == 0) {
                    return [255, 0, 0];
                } else if (stat == 100) {
                    return [0, 255, 0];
                } else {
                    return [0, 0, 255];
                }
            }, // Red color for routes
            getWidth: 20, // Width of the route lines
            getDashArray: [8, 4], // Dashed line effect
            pickable: true,
            visible: visibility

        })
    })
    deckcontainer.setProps({ layers });
}


// Change Basemap on click
document.querySelectorAll('input[type="radio"][name="basemap"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.value == 'positron') {
            deckcontainer.setProps({
                mapStyle: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
            })
        } else if (event.target.value == "dark-matter") {
            deckcontainer.setProps({
                mapStyle: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
            })
        }

    });
});


