let selectYear = document.querySelector("#sel-year");
let selectRound = document.querySelector("#sel-round");
let selectDriver = document.querySelector("#sel-driver");
let lapTimesChart;
let chartRound;  
let chartSeason;
let chartDriver;
let selectComparison = document.querySelector("#sel-compare");
let divCompare = document.querySelector("#container-compare");
let previousOptions = []; // to keep track of selected drivers
let chartDrivers = []; // to keep track of shown drivers, with correct chart data index

const colors = [
    'red',
    'darkred',
    'green',
    'darkgreen',
    'blue',
    'darkblue',
    'gold',
    'magenta', 
    'darkmagenta',
    'darkcyan',
    'gray',
    'darkgray',
    'orangered',
    'saddlebrown',
    'purple'
  ];
  

function loadYears(){
    for(let i = 1996; i < 2024; i++){
        // add a new option to the year selection box
        const newOption = document.createElement("option");
        newOption.value = i;
        newOption.innerText = i;
        selectYear.appendChild(newOption);
    }
}

/* functions to update rounds and drivers available in select boxes,
according to the season selected in the select box */
async function showRounds(season){
    // preparing and calling the query to the api
    const query = "http://ergast.com/api/f1/"+season+".json";
    const response = await fetch(query);
    var data = await response.json();
    // reset of selectRound options
    selectRound.innerHTML = '<option value="none">---</option>';
    // retrieving the array with all the rounds for the selected season
    const arrayRaces = data.MRData.RaceTable.Races;
    // showing the rounds in the web page
    for(let i = 0; i < arrayRaces.length; i++){
        selectRound.innerHTML = selectRound.innerHTML + `<option value="${arrayRaces[i].round}">${arrayRaces[i].raceName}</option>`;
    }
    showDrivers(season);
}

async function showDrivers(season){
    // preparing and calling the query to the api
    const query = "http://ergast.com/api/f1/"+season+"/drivers.json";
    const response = await fetch(query);
    var data = await response.json();
    // reset of selectDriver options
    selectDriver.innerHTML = '<option value="none">---</option>';
    // retrieving the array with all the rounds for the selected season
    const arrayDrivers = data.MRData.DriverTable.Drivers;
    // showing the drivers in the web page
    for(let i = 0; i < arrayDrivers.length; i++){
        selectDriver.innerHTML = selectDriver.innerHTML + `<option value="${arrayDrivers[i].driverId}">${arrayDrivers[i].givenName} ${arrayDrivers[i].familyName}</option>`;
    }
}

function loadSelects(){
    // retrieving season from the select box
    const selectedYear = selectYear.value;
    // calls to api to show correct rounds and drivers
    if(selectedYear !== "none"){
        showRounds(selectedYear);
    }
}

// function to show all the laptimes for a specific race and driver
async function SearchLaptimes(){
    const pSeason = selectYear.value;
    const pRound = selectRound.value;
    const pDriver = selectDriver.value;
    // resetting inner HTML of lap times container
    document.querySelector(".lap-tables").innerHTML = '<div class="column"><div class="single-lap"><div class="t-lapH">Lap</div><div class="t-positionH">Pos</div><div class="t-timeH">Time</div></div></div>';
    // call to the query
    const query = "https://ergast.com/api/f1/"+pSeason+"/"+pRound+"/drivers/"+pDriver+"/laps.json?limit=100";
    const response = await fetch(query);
    var data = await response.json();
    console.log(data);
    if(data.MRData.RaceTable.Races.length>0){
        var lapTimesArray = new Array();
        var lapArray = data.MRData.RaceTable.Races[0].Laps;
        let actualColumn = document.querySelector(".column");
        let lapTables = document.querySelector(".lap-tables");
        lapArray.forEach((lap) => {
            const lapNumber = lap.number;
            const lapPosition = lap.Timings[0].position;
            const lapTime = lap.Timings[0].time;
            // add the lap time to the array, to create the chart
            lapTimesArray.push(lapTime);
            // creating elements and sub elements
            const lapElement = document.createElement("div");
            lapElement.className = "single-lap";
            const numberElement = document.createElement("div");
            numberElement.className = "t-lap";
            numberElement.innerText = lapNumber;
            const positionElement = document.createElement("div");
            positionElement.className = "t-position";
            positionElement.innerText = lapPosition;
            const timeElement = document.createElement("div");
            timeElement.className = "t-time";
            timeElement.innerText = lapTime;
            // adding sub elements to the main element
            lapElement.appendChild(numberElement);
            lapElement.appendChild(positionElement);
            lapElement.appendChild(timeElement);
            // check on number of events on a single row
            if (lapNumber % 20 === 1 && lapNumber !== "1")
            {
                actualColumn = document.createElement("div");
                actualColumn.className = "column";
                actualColumn.innerHTML = "<div class='single-lap'><div class='t-lapH'>Lap</div><div class='t-positionH'>Pos</div><div class='t-timeH'>Time</div></div>"; 
                lapTables.appendChild(actualColumn);
            }
            actualColumn.appendChild(lapElement);
        });
        // updating table title
        var selectedDriver = selectDriver.options[selectDriver.selectedIndex].text;
        var selectedRound = selectRound.options[selectRound.selectedIndex].text;
        document.querySelector(".table-title").innerText = `${selectedDriver}, ${selectedRound}, ${selectYear.value}`;
        // converting strings laptime into numbers
        for(let i = 0; i<lapTimesArray.length; i++){
            var arrayParts = lapTimesArray[i].split(':');
            var minutes = parseInt(arrayParts[0], 10);
            var secondSplit = arrayParts[1].split('.');
            var seconds = parseInt(secondSplit[0], 10);
            var thousands = parseInt(secondSplit[1], 10);
            lapTimesArray[i] = minutes * 60 + seconds + thousands / 1000;
        }
        // creating chart
        createChart(lapTimesArray, pDriver);
        chartRound = pRound;
        chartSeason = pSeason;
        chartDriver = pDriver;
        // show comparable drivers in the correct select box
        showComparable(pRound, pSeason);
    }
    else{
        document.querySelector(".table-title").innerText = "No data available";
    }
}

function createChart(lapTimesArray, driverId){
    const ctx = document.getElementById('lapChart');
    if(lapTimesChart)
        lapTimesChart.destroy();
    lapTimesChart = new Chart(ctx, {
        type: 'line', 
        data:{
            labels: lapTimesArray.map((_, index) => (index % 5 === 0) ? `Giro ${index + 1}` : ''),
            datasets: [{
                label: driverId,
                data: lapTimesArray,
                borderColor: 'rgba(74, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options:{
            scales:{
                y:{
                    beginAtZero: false, 
                    min: Math.min(lapTimesArray),
                    max: Math.max(lapTimesArray)
                },
                x: {
                    ticks: {
                        maxTicksLimit: 12,
                        stepSize: 5
                    }
                }
            }
        }
    });
    var canvas = document.getElementById('lapChart');
    canvas.width = "800px";
    canvas.height = "500px";
}

async function showComparable(round, season){
    // 1. retrieve available drivers
    let query = "http://ergast.com/api/f1/"+season+"/"+round+"/drivers.json";
    const response = await fetch(query);
    var data = await response.json();
    const arrayDrivers = data.MRData.DriverTable.Drivers;
    // 2. update select content
    selectComparison.innerHTML = "";
    for(let i = 0; i < arrayDrivers.length; i++){
        selectComparison.innerHTML = selectComparison.innerHTML + `<option value="${arrayDrivers[i].driverId}">${arrayDrivers[i].givenName} ${arrayDrivers[i].familyName}</option>`;
    }
}

function updateChart(){
    let opSelected = selectComparison.selectedOptions;
    // check if the driver has been deselected
    var currentOptions = Array.from(opSelected).map(option => option.value);
    var unselected = previousOptions.filter(option => !currentOptions.includes(option));
    if(unselected.length > 0){
        // console.log("Hai deselezionato " + unselected[0]);
        // remove data of the unselected driver from the chart
        removeOldData(unselected[0]);
    }
    // check if a driver has been selected
    var newSelection = currentOptions.filter(option => !previousOptions.includes(option));
    if(newSelection.length > 0){
        // console.log("Hai selezionato " + newSelection[0]); 
        // add data of the selected driver to the chart 
        addNewData(newSelection[0]);
    }
    // updating previous options for the next execution
    previousOptions = currentOptions;
}

async function addNewData(driverId){
    console.log("adding");
    const query = "https://ergast.com/api/f1/"+chartSeason+"/"+chartRound+"/drivers/"+driverId+"/laps.json?limit=100"
    const response = await fetch(query);
    var data = await response.json();
    var lapArray = data.MRData.RaceTable.Races[0].Laps;
    var times = new Array();
    lapArray.forEach((lap) =>{
        const stringLap = lap.Timings[0].time;
        var arrayParts = stringLap.split(':');
        var minutes = parseInt(arrayParts[0], 10);
        var secondSplit = arrayParts[1].split('.');
        var seconds = parseInt(secondSplit[0], 10);
        var thousands = parseInt(secondSplit[1], 10);
        times.push(minutes * 60 + seconds + thousands / 1000); 
    });
    // append the driver to the driversArray
    chartDrivers.push(driverId);
    console.log(chartDrivers);
    // add the new set of data to the chart
    lapTimesChart.data.datasets.push({
        label: driverId,
        data: times,
        borderColor: colors[(chartDrivers.length-1)%colors.length],
        borderWidth: 2,
        fill: false
    });
    lapTimesChart.update();
}

function removeOldData(driverId){
    // find the correct dataset that has to be removed
    console.log("removing");
    let index = chartDrivers.indexOf(driverId) + 1;
    // remove the driver from chartDrivers array
    chartDrivers.splice(index-1, 1);
    console.log(chartDrivers);
    // actually remove the data
    lapTimesChart.data.datasets.splice(index, 1);
    console.log()
    lapTimesChart.update();
}

loadYears();