const pre_url = 'https://googledatacollectiondashboardapi.onrender.com/api/get_all_google_json_roads'
//const pre_url = 'http://127.0.0.1:8000/api/get_all_google_json_roads'
const pre_url2 = "https://googledatacollectiondashboardapi.onrender.com/api"
//const pre_url2 = "http://127.0.0.1:8000/api"

const { DeckGL, PathLayer, PolygonLayer, ColumnLayer } = deck;

const LINE_COLOR = [0, 255, 0]; // Green color for the lines

// Get the target element by id
const targetElement = document.getElementById('map');
let cameras = [1, 2, 3, 4, 5, 6];
const flexchildDivs = document.querySelectorAll('.flexchild');

//const lagUrl1 = pre_url + "?state_name=Lagos&skip=0&limit=10000"
//const lagUrl2 = pre_url + "?state_name=Lagos&skip=10001&limit=20000"
//const lagUrl3 = pre_url + "?state_name=Lagos&skip=20001&limit=30000"
//const lagUrl4 = pre_url + "?state_name=Lagos&skip=30001&limit=39000"
//const lagUrl5 = pre_url + "?state_name=Lagos&skip=39001"
const oyoUrl = pre_url + "?state_name=Oyo"
const ogunUrl = pre_url + "?state_name=Ogun"
const lagUrl = pre_url + "?state_name=Lagos"
const edoUrl = pre_url + "?state_name=Edo"
const deltaUrl = pre_url + "?state_name=Delta"
const kwaraUrl = pre_url + "?state_name=Kwara"
const osunUrl = pre_url + "?state_name=Osun"
const nigerUrl = pre_url + "?state_name=Niger"
const ondoUrl = pre_url + "?state_name=Ondo"

let uniObject = {}


let states = ["Ogun", "Lagos", "Oyo", "Osun", "Kwara", "Edo", "Delta", "Niger", "Ondo"];


//today's date
var today = new Date();


// DeckGL Container
const deckcontainer = new DeckGL({
    container: targetElement,
    mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    initialViewState: {
        longitude: 5.760269,
        latitude: 5.544230,
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

//Delete table rows
function deleteAllTableRows() {
    const table = document.getElementById('ownershipTable');
    while (table.rows.length > 1) {
        table.deleteRow(1); // Deleting rows starting from index 1 (index 0 is the header row)
    }
}


// Get General statistics
async function fetchAndFillFlexChild(url, cameraNumber) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        index = cameraNumber + 1

        flexchildDivs[index].querySelector('#title').textContent = `Camera ${data.camera_number}`;
        flexchildDivs[index].querySelector('#cam').textContent = data.length_with_camera_number;
        flexchildDivs[index].querySelector('#percent').textContent = data.percentage_covered;


    }
    catch (error) {
        console.error(`Error fetching data for camera ${cameraNumber}:`, error);
    }
}


async function fillFlexChildDivs(startdate = null, enddate = null) {
    let posturl = ""
    if (startdate) {
        posturl += `&start_date=${startdate}`
    }
    if (enddate) {
        posturl += `&end_date=${enddate}`
    }
    for (let i = 0; i < cameras.length; i++) {
        camurl = pre_url2 + `/stats_camera?camera_number=${cameras[i]}` + posturl;
        await fetchAndFillFlexChild(camurl, cameras[i]);
    }
}

fillFlexChildDivs();
//// General Statistcis End

// Function to fetch data for a state and append to the table
async function fetchDataAndAppend(state, serialNumber, address) {
    try {
        let response = await fetch(address);
        const data = await response.json();

        const tableRow = `
        <tr>
          <td>${serialNumber}</td>
          <td>${data.state_name}</td>
          <td>${data.total_length_status_100}</td>
          <td>${data.total_length}</td>
          <td>${data.percentage_covered}</td>
          <td>${data.first_date_status_100}</td>
        </tr>
      `;

        document.getElementById('ownershipTable').innerHTML += tableRow;
    } catch (error) {
        console.error(`Error fetching data for ${state}:`, error);
    }
}

// Function to iterate through states and fetch data
async function fetchDataForStates(startdate = null, enddate = null) {
    let posturl = ""
    if (startdate) {
        posturl += `&start_date=${startdate}`
    }
    if (enddate) {
        posturl += `&end_date=${enddate}`
    }
    for (let i = 0; i < states.length; i++) {
        stateurl = pre_url2 + `/google_road_stats?state_name=${states[i]}` + posturl;
        await fetchDataAndAppend(states[i], i + 1, stateurl);
    }
}

// Call the function to fetch data for all states
fetchDataForStates();
// Fetch data for all states ends


//// Get the total completed road done and fill it in
async function fetchProgressDataAndAppend(address) {
    try {
        let response = await fetch(address);
        const data = await response.json();
        flexchildDivs[0].querySelector('#title').textContent = "Collected Data 2023";
        flexchildDivs[0].querySelector('#cam').textContent = data.total_covered_2023;
        flexchildDivs[0].querySelector('#percent').textContent = data.percentage_2023;
        flexchildDivs[1].querySelector('#title').textContent = "Collected Data 2024";
        flexchildDivs[1].querySelector('#cam').textContent = data.total_covered_2024;
        flexchildDivs[1].querySelector('#percent').textContent = data.percentage_2024;


        ;

    } catch (error) {
        console.error(`Error fetching progress data`, error);
    }
}

// Function to iterate through states and fetch data
async function fetchDataForRoadUpdate(startdate = null, enddate = null) {
    let posturl = "/get_progress"
    if (startdate) {
        posturl += `?start_date=${startdate}`
    }
    if (enddate) {
        posturl += `&end_date=${enddate}`
    }
    progressurl = pre_url2 + posturl;
    await fetchProgressDataAndAppend(progressurl);
}

// Call the function to fetch data for all states
fetchDataForRoadUpdate();
// Fetch data for all states ends


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
////////////////////////////////////////////////////////////////////////////////////////////

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
        [
            fetchData(oyoUrl),
            fetchData(ogunUrl),
            fetchData(edoUrl),
            fetchData(deltaUrl),
            fetchData(kwaraUrl),
            fetchData(lagUrl),
            fetchData(osunUrl),
            fetchData(ondoUrl),
            fetchData(nigerUrl)
        ])
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
            getPath: d => d.geometry.coordinates,
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

    //Update State Statistics
    deleteAllTableRows()
    fetchDataForStates(startingDate, endingDate)
    // Update general stats
    fillFlexChildDivs(startingDate, endingDate);
    //Update the total road covered
    fetchDataForRoadUpdate(startingDate, endingDate)
    toggle();
}