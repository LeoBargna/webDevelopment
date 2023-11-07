let selectYear = document.querySelector("#sel-year");
let selectRound = document.querySelector("#sel-round");
let selectDriver = document.querySelector("#sel-driver");

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
        var lapArray = data.MRData.RaceTable.Races[0].Laps;
    let actualColumn = document.querySelector(".column");
    let lapTables = document.querySelector(".lap-tables");
    lapArray.forEach((lap) => {
        const lapNumber = lap.number;
        const lapPosition = lap.Timings[0].position;
        const lapTime = lap.Timings[0].time;
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
    }
    else{
        document.querySelector(".table-title").innerText = "No data available";
    }
    
}

loadYears();