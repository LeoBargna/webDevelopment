let selectYear = document.querySelector("#sel-year");
let selectDriver = document.querySelector("#sel-driver");
let driverContainer = document.querySelector(".container-driver");

function loadYears(){
    for(let i = 1996; i < 2024; i++){
        // add a new option to the year selection box
        const newOption = document.createElement("option");
        newOption.value = i;
        newOption.innerText = i;
        selectYear.appendChild(newOption);
    }
}

async function loadDrivers(){
    // retrieving the correct season
    let season = selectYear.value;
    // query to get drivers that have driven in that season
    let query = "http://ergast.com/api/f1/"+season+"/drivers.json";
    const response = await fetch(query);
    var data = await response.json();
    // putting drivers into the select
    const arrayDrivers = data.MRData.DriverTable.Drivers;
    selectDriver.innerHTML = "";
    // showing the drivers in the web page
    for(let i = 0; i < arrayDrivers.length; i++){
        selectDriver.innerHTML = selectDriver.innerHTML + `<option value="${arrayDrivers[i].driverId}">${arrayDrivers[i].givenName} ${arrayDrivers[i].familyName}</option>`;
    }
}

async function SearchDriverInfo(){
    let driverId = selectDriver.value;
    let query = "http://ergast.com/api/f1/drivers/"+driverId+"/driverStandings.json";
    const response = await fetch(query);
    var data = await response.json();
    // Retrieving driver information
    var driverObj = data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver;
    console.log(driverObj);
    // Retrieving informations about number points, championships and wins
    let points = 0, championships = 0, wins = 0;
    let arrayChamp = new Array();
    const standingsArray = data.MRData.StandingsTable.StandingsLists;
    standingsArray.forEach((year) => {
        let driverStanding = year.DriverStandings[0];
        points = points + parseInt(driverStanding.points);
        wins = wins + parseInt(driverStanding.wins);
        if(driverStanding.position === "1"){
            arrayChamp.push(year.season);
            championships++;
        }
        
    }); 
    // make a string to show the years when the driver won the championships:
    let champYearsString = "";
    if (championships > 0){
        champYearsString = "(" + arrayChamp[0];
        for(let i=1; i < arrayChamp.length; i++)
            champYearsString = champYearsString + ", " + arrayChamp[i];
        champYearsString = champYearsString + ")";
    }
    // path for the image
    var imgPath = "media/drivers/"+driverId+".png";
    console.log(imgPath);
    // Adding elements to the web page
    const imageColumn = document.getElementById("col-image");
    imageColumn.innerHTML = '<div class="driver-img"><img src="'+imgPath+'" id="driver-image"></div>';
    const dInfo = document.querySelector(".driver-info");
    const dAchiv = document.querySelector(".driver-achievements");
    // resetting the divs
    dInfo.innerHTML = "";
    dAchiv.innerHTML = "";
    // putting text in the divs
    dInfo.innerText = "Driver information";
    dAchiv.innerText = "Driver achievements";
    // making sub elements
    let eName = document.createElement("div");
    eName.innerText = "Name: " + driverObj.givenName + " " + driverObj.familyName;
    let eBirth = document.createElement("div");
    eBirth.innerText = "Birth date: " + driverObj.dateOfBirth;
    let eNationality = document.createElement("div");
    eNationality.innerText = "Nationality: " + driverObj.nationality;
    let ePoints = document.createElement("div");
    let eWins = document.createElement("div");
    let eChamp = document.createElement("div");
    ePoints.innerText = "Points: " + points;
    eWins.innerText = "Wins: " + wins;
    eChamp.innerText = "Championship: " + championships + " " + champYearsString;
    // adding them to the web page
    dInfo.appendChild(eName);
    dInfo.appendChild(eBirth);
    dInfo.appendChild(eNationality);
    dAchiv.appendChild(ePoints);
    dAchiv.appendChild(eWins);
    dAchiv.appendChild(eChamp);
}

loadYears();