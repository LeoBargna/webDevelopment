const apiKey = "4829b3b08c67de3be5af7a6b11874718";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city){
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    // error handling
    if(response.status == 404){
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
    else{
        

        // updating data
        var data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    
        weatherIcon.src = `images/${data.weather[0].main}.png`;

        // shown div handling
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

    }

   

}

searchBtn.addEventListener("click", ()=>{
    checkWeather(searchBox.value);
})

//checkWeather();