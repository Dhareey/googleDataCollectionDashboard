const pre_url = 'https://googledatacollectiondashboardapi.onrender.com/api/get_all_google_roads'
//const pre_url = 'http://127.0.0.1:8000/api/get_all_google_roads'
const pre_url2 = "https://googledatacollectiondashboardapi.onrender.com/api"
//const pre_url2 = "http://127.0.0.1:8000/api"

const { DeckGL, PathLayer, PolygonLayer, ColumnLayer } = deck;

const LINE_COLOR = [0, 255, 0]; // Green color for the lines

// Get the target element by id
const targetElement = document.getElementById('map');

const oyoUrl = pre_url + "?state_name=Oyo"
const ogunUrl = pre_url + "?state_name=Ogun"
const lagUrl1 = pre_url + "?state_name=Lagos&skip=0&limit=10000"
const lagUrl2 = pre_url + "?state_name=Lagos&skip=10001&limit=20000"
const lagUrl3 = pre_url + "?state_name=Lagos&skip=20001&limit=30000"
const lagUrl4 = pre_url + "?state_name=Lagos&skip=30001&limit=39000"
const lagUrl5 = pre_url + "?state_name=Lagos&skip=39001"
const lagUrl = pre_url + "?state_name=Lagos"
const edoUrl = pre_url + "?state_name=Edo"
const deltaUrl = pre_url + "?state_name=Delta"
const kwaraUrl = pre_url + "?state_name=Kwara"
let uniObject = {}

//Table Contents
//Get the containers
let total_col_km_24 = document.getElementById('km24');
let total_col_km_24_percent = document.getElementById('km24percent')
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
let cam_6_km_24 = document.getElementById("cam6km");
let cam_6_km_24_percent = document.getElementById("cam6kmpercent");

//Get State table details
let oyo_km = document.getElementById('oyoKm');
let oyo_tot = document.getElementById('oyoTot')
let oyo_date = document.getElementById('oyoDate')
let ogun_km = document.getElementById('ogunKm')
let ogun_tot = document.getElementById('ogunTot')
let ogun_date = document.getElementById('ogunDate')
let lagos_km = document.getElementById("lagosKm");
let lagos_tot = document.getElementById('lagosTot');
let lagos_date = document.getElementById("lagosDate");
let ondo_km = document.getElementById("ondoKm");
let ondo_date = document.getElementById("ondoDate");
let ondo_tot = document.getElementById("ondoTot");
let osun_km = document.getElementById("osunKm");
let osun_tot = document.getElementById("osunTot");
let osun_date = document.getElementById("osunDate");
let edo_km = document.getElementById("edoKm");
let edo_tot = document.getElementById("edoTot");
let edo_date = document.getElementById("edoDate");
let delta_km = document.getElementById("deltaKm");
let delta_tot = document.getElementById("deltaTot");
let delta_date = document.getElementById("deltaDate");

//today's date
var today = new Date();


// DeckGL Container
const deckcontainer = new DeckGL({
    container: targetElement,
    mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    initialViewState: {
        longitude: 3.3360,
        latitude: 6.5238,
        zoom: 11,
        maxZoom: 20,
        bearing: 0

    },
    controller: true,
});
// Date slider function
$(function () {
    var startDate = new Date('2024-02-21');
    $("#slider-range").slider({
        range: true,
        min: startDate.getTime() / 86400000, // Divide by milliseconds in a day to get just date
        max: today.getTime() / 86400000, // Divide by milliseconds in a day to get just date
        step: 1, // Step by one day
        values: [startDate.getTime() / 86400000, today.getTime() / 86400000], // Set initial values from startDate to today
        slide: function (event, ui) {
            document.getElementById('from').textContent = formatDate(new Date(ui.values[0] * 86400000))
            document.getElementById('to').textContent = formatDate(new Date(ui.values[1] * 86400000))
        }
    });
    document.getElementById('from').textContent = formatDate(new Date($("#slider-range").slider("values", 0) * 86400000))
    document.getElementById('to').textContent = formatDate(new Date($("#slider-range").slider("values", 1) * 86400000))

});

// Function to format date to 'yyyy-mm-dd' format
function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }

    return year + "-" + month + "-" + day;
}



// Get General statistics
function updateGeneralStats(url_to_check) {

    fetch(url_to_check).then(response => {
        if (!response.ok) {
            throw new Error("network response was not OK");
        }
        return response.json();
    })
        .then(data => {
            total_col_km_24.textContent = data["covered_km"].toFixed(2);
            total_col_km_24_percent.textContent = data["percent_covered"].toFixed(2);
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
            cam_6_km_24.textContent = data["cam6_km"].toFixed(2);
            cam_6_km_24_percent.textContent = data["cam6_percent"].toFixed(2);

        })
        .catch(error => {
            console.log("Error Fetching data:", error);
            return null;
        });
}

// Get State statistics
function getStateStatistics(url_to_check) {
    fetch(url_to_check).then(response => {
        if (!response.ok) {
            throw new Error('Network Response was not ok');
        }
        return response.json();
    })
        .then(data => {
            oyo_km.textContent = data['Oyo']['covered_km'];
            oyo_tot.textContent = data['Oyo']['percent_covered'];
            oyo_date.textContent = data['Oyo']['start_date'];
            ogun_km.textContent = data['Ogun']['covered_km'];
            ogun_tot.textContent = data['Ogun']['percent_covered'];
            ogun_date.textContent = data['Ogun']['start_date'];
            lagos_km.textContent = data['Lagos']['covered_km'];
            lagos_tot.textContent = data['Lagos']['percent_covered'];
            lagos_date.textContent = data['Lagos']['start_date'];
            delta_km.textContent = data['Delta']['covered_km'];
            delta_tot.textContent = data['Delta']['percent_covered'];
            delta_date.textContent = data['Delta']['start_date'];
            ondo_km.textContent = data['Ondo']['covered_km'];
            ondo_date.textContent = data['Ondo']['start_date'];
            ondo_tot.textContent = data['Ondo']['percent_covered'];
            osun_km.textContent = data['Osun']['covered_km'];
            osun_date.textContent = data['Osun']['start_date'];
            osun_tot.textContent = data['Osun']['percent_covered'];
            edo_km.textContent = data['Edo']['covered_km'];
            edo_date.textContent = data['Edo']['start_date'];
            edo_tot.textContent = data['Edo']['percent_covered'];



        })
        .catch(error => {
            console.log('Error Fetching Data:', error);
            return null;
        })
}

// Select and edit road details and information
updateGeneralStats(pre_url2 + "/get_stats");
getStateStatistics(pre_url2 + "/get_state_stats");

// Get Lagos data
/*

async function fetchLagosData(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        return response.json();
    })
        .then(data => {
            updateLagosUniObject(uniObject, "Lagos", data);
        })
        .catch(error => {
            console.log("Error fetching data:", error);
            return null;
        });
}

async function fetchAllLagData() {
    await Promise.all([
        fetchLagosData(lagUrl1),
        fetchLagosData(lagUrl2),
        fetchLagosData(lagUrl3),
        fetchLagosData(lagUrl4),
        fetchLagosData(lagUrl5)]
    )
}

async function updateLagosUniObject(uniObj, objKey, data) {
    if (objKey in uniObj) {
        // If objKey already exists in uniObj, add data to its existing value
        uniObj[objKey] = uniObj[objKey].concat(data);
    } else {
        // If objKey doesn't exist, create it and assign data to it
        uniObj[objKey] = data;
    }

    toggle()
}

fetchAllLagData();
*/

async function fetchData(url) {
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


async function fetchAllData() {
    await Promise.all(
        [fetchData(lagUrl),
        fetchData(oyoUrl),
        fetchData(ogunUrl),
        fetchData(edoUrl),
        fetchData(deltaUrl),
        fetchData(kwaraUrl)])
}



async function updateUniObject(uniObj, objkey, data) {
    uniObj[objkey] = data;
    toggle();
}

fetchAllData();


function toggle() {
    let layers = Object.entries(uniObject).map(([key, value]) => {
        let visibility = document.getElementById(key).checked
        let sliderValues = $("#slider-range").slider("values");
        let startingDate = new Date(sliderValues[0] * 86400000)
        let endingDate = new Date(sliderValues[1] * 86400000)

        return new PathLayer({
            id: key,
            data: value,
            getPath: d => d.geometry,
            getColor: d => {
                let collectionDate = new Date(d.collection_date);
                if (collectionDate >= startingDate && collectionDate <= endingDate) {
                    return [0, 255, 0];
                } else {
                    return [255, 0, 0];
                }
            }, // Red color for routes
            getWidth: 20, // Width of the route lines
            getDashArray: [8, 4], // Dashed line effect
            pickable: true,
            visible: visibility,
            // Add updateTrigger for getFillColor based on ref
            updateTriggers: {
                getColor: [sliderValues] // Update when reference value changes
            }

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


// Update data on date slider
function queryData() {
    var startingDate = formatDate(new Date($("#slider-range").slider("values", 0) * 86400000));
    var endingDate = formatDate(new Date($("#slider-range").slider("values", 1) * 86400000));
    let url_to_get = pre_url2 + `/get_stats?col_start_date=${startingDate}&col_end_date=${endingDate}`
    let state_url_to_get = pre_url2 + `/get_state_stats?col_start_date=${startingDate}&col_end_date=${endingDate}`

    // Update general stats
    updateGeneralStats(url_to_get);
    // Update state statistics
    getStateStatistics(state_url_to_get);
    toggle();
}

