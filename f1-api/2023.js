/* showing standings */

async function driverStandings(){
  const response = await fetch("http://ergast.com/api/f1/current/driverStandings.json");
  var data = await response.json();
  const standing = document.getElementById("driver-standing");
  const driverStandings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  driverStandings.forEach((driver) => {
    console.log(driver.position + " " + driver.Driver.givenName + " " + driver.Driver.familyName);
    // creating elements
    const pilota = document.createElement("div");
    pilota.className = "driver-s";
    const nomePilota = document.createElement("p");
    nomePilota.className = "driver-name";
    nomePilota.innerText = driver.Driver.givenName + " " + driver.Driver.familyName;
    const numPilota = document.createElement("p");
    numPilota.className = "driver-number";
    numPilota.innerText = driver.Driver.permanentNumber;
    const posPilota = document.createElement("p");
    posPilota.className = "driver-position";
    posPilota.innerText = driver.positionText;
    const puntiPilota = document.createElement("p");
    puntiPilota.className = "driver-points";
    puntiPilota.innerText = driver.points;
    // putting elements together and adding them to the web page
    pilota.appendChild(posPilota);
    pilota.appendChild(nomePilota);
    pilota.appendChild(numPilota);
    pilota.appendChild(puntiPilota);
    standing.appendChild(pilota);
  })

}

async function constructorStandings(){
  const response = await fetch("http://ergast.com/api/f1/current/constructorStandings.json");
  var data = await response.json();
  let standing = document.getElementById("constructor-standing");
  const constructorStandings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
  constructorStandings.forEach((constructor) => {
    console.log(constructor.positionText + " " + constructor.Constructor.name);
    // creating elements
    const costruttore = document.createElement("div");
    costruttore.className = "constructor-s";
    const nomeCostruttore = document.createElement("div");
    nomeCostruttore.className = "constructor-name";
    nomeCostruttore.innerText = constructor.Constructor.name;
    const posCostruttore = document.createElement("div");
    posCostruttore.className = "constructor-position";
    posCostruttore.innerText = constructor.positionText;
    const puntiCostruttore = document.createElement("div");
    puntiCostruttore.className = "constructor-points";
    puntiCostruttore.innerText = constructor.points;
    // putting elements together and adding them to the web page
    costruttore.appendChild(posCostruttore);
    costruttore.appendChild(nomeCostruttore);
    costruttore.appendChild(puntiCostruttore);
    standing.appendChild(costruttore);
  })
}

function updateStandings(){
  driverStandings();
  constructorStandings();
}

async function updateCalendar(){
  const response = await fetch("https://ergast.com/api/f1/current.json");
  const data = await response.json();
  const calendar = document.querySelector("#season-calendar");
  const raceTable = data.MRData.RaceTable.Races;
  let actualRow = document.querySelector(".c-row");
  let dateArray = new Array();
  raceTable.forEach((race) => {
    // creating a div event
    const event = document.createElement("div");
    event.className = "event";
    // creating sub elements (and rows)
    const row1 = document.createElement("div");
    row1.className = "e-row"; 
    const row2 = document.createElement("div");
    row2.className = "e-row";
    const row3 = document.createElement("div");
    row3.className = "e-row";
    // date
    const eventDate = document.createElement("div");
    eventDate.className = "e-date";
    // seeking for right dates
    const endingDate = new Date(race.date);
    let beginningDate = new Date(race.date);
    beginningDate.setDate(endingDate.getDate()-2);
    const printedDate = beginningDate.getDate() + "/" + (beginningDate.getMonth()+1) + " - " +
      endingDate.getDate() + "/" + (endingDate.getMonth()+1);
    eventDate.innerText = printedDate;
    // (add the date to the array, so that it can be used to determine the next scheduled race)
    const innerArray = new Array();
    innerArray.push(race.date);
    innerArray.push(race.time.substr(0, race.time.length-1));
    // image
    const imgContainer = document.createElement("div");
    imgContainer.className = "e-flag";
    const imgDiv = document.createElement("img");
    imgDiv.src = `media/flags/${race.Circuit.Location.country}.png`;
    imgContainer.appendChild(imgDiv);
    // event name
    const eventName = document.createElement("div");
    eventName.className = "event-name";
    eventName.innerText = race.raceName;
    innerArray.push(race.raceName);
    // track name
    const trackName = document.createElement("div");
    trackName.className = "track-name";
    trackName.innerText = race.Circuit.circuitName;
    innerArray.push(race.Circuit.circuitName);
    innerArray.push(race.Circuit.Location.country);
    dateArray.push(innerArray); 
    // putting all the elements together
    row1.appendChild(eventDate);
    row1.appendChild(imgContainer);
    row2.appendChild(eventName);
    row3.appendChild(trackName);
    event.appendChild(row1);
    event.appendChild(row2);
    event.appendChild(row3);
    // check on number of events on a single row
    if (race.round % 3 === 1 && race.round !== 1)
    {
      actualRow = document.createElement("div");
      actualRow.className = "c-row";
      calendar.appendChild(actualRow);
    }
      
    actualRow.appendChild(event);
  })
  return dateArray;
}

function combineDateAndTime(date, time) {
  const [hours, minutes, seconds] = time.split(":");
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, seconds);
}

async function determineNextRace() {
  try {
    const calendarData = await updateCalendar();
    const currentDate = new Date();
    let refDate = null;

    for (const [date, time, event, track, country] of calendarData) {
      const tempDate = combineDateAndTime(new Date(date), time);
      if (tempDate - currentDate > 0) {
        refDate = tempDate;
        document.querySelector("#next-event").innerText = event;
        document.querySelector("#next-track").innerText = track;
        document.querySelector("#next-flag").src =  `media/flags/${country}.png`;
        break;
      }
    }

    if (refDate) {
      console.log("Next race in:", refDate);
      return refDate;
    } else {
      console.log("No upcoming race found");
      return null;
    }
  } catch (error) {
    console.error("Error in determining the next race:", error);
    throw error;
  }
}

let asyncDate = null;

determineNextRace()
  .then(value => {
    asyncDate = value;
    setInterval(updateCountdown, 1000);
  })
  .catch(error => {
    console.error("Error in retrieving data");
  });

function updateCountdown() {
  if (asyncDate !== null) {
    const currentDate = new Date();
    const delta = asyncDate - currentDate;
    const days = Math.floor(delta / 86400000)+1;
    const hours = Math.floor(delta / 3600000) % 24 + 1; // The +1 is due to different time zone
    const minutes = Math.floor(delta / 60000) % 60;
    const seconds = Math.floor(delta / 1000) % 60;

    console.log("Days:", days, "Hours:", hours, "Minutes:", minutes, "Seconds:", seconds);

    const boxDay = document.querySelector("#days");
    const boxHour = document.querySelector("#hours");
    const boxMinute = document.querySelector("#minutes");
    const boxSecond = document.querySelector("#seconds");

    boxDay.innerText = days + "d";
    boxHour.innerText = hours + "h";
    boxMinute.innerText = minutes + "m";
    boxSecond.innerText = seconds + "s";

  } else {
    console.log("Waiting for async function");
  }
}

updateStandings();