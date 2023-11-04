
let progressBar = document.getElementById("progress-bar");
let song = document.getElementById("song");
let controlIcon = document.getElementById("play-icon");
let previousIcon = document.getElementById("prev-icon");
let nextIcon = document.getElementById("next-icon");
let songName = document.getElementById("song-name");
let songDescription = document.getElementById("song-desc");
let reset = 0;

const audio1 = new Audio('media/make-it-loud.mp3');

const songs = [
    {ele: audio1, audioName: 'make it loud', audioDesc: 'unknow author (20xx)', imgPath: '468-thumbnail.jpg'},
    {ele: audio1, audioName: 'make it loud2', audioDesc: 'unknow author2 (20xx)', imgPath: '468-thumbnail.jpg'}
];

for (const song of songs){
    song.ele.addEventListener('ended', () => {
        updateSong('next');
        playPause();
    })
}

let current = 0;
let currentSong = songs[current].ele;
songName.textContent = songs[current].audioName;
songDescription.textContent = songs[current].audioDesc;

currentSong.onloadedmetadata = function (){
    progressBar.max = currentSong.duration;
    progressBar.value = currentSong.currentTime;
    currentSong.play();
}

function playPause(){
    if(controlIcon.classList.contains("fa-pause")){
        currentSong.pause();
        controlIcon.classList.remove("fa-pause");
        controlIcon.classList.add("fa-play");
    }
    else{
        currentSong.play();
        controlIcon.classList.remove("fa-play");
        controlIcon.classList.add("fa-pause");
    }
}

if(currentSong.play()){
    setInterval(()=>{
        progressBar.value = currentSong.currentTime;
    }, 500);
}

progressBar.onchange = function(){
    currentSong.play();
    currentSong.currentTime = progressBar.value;
    controlIcon.classList.add("fa-pause");
    controlIcon.classList.remove("fa-play");
}

nextIcon.addEventListener('click', ()=>{
    updateSong('next');
    playPause();
});

previousIcon.addEventListener('click', ()=>{
    updateSong('prev');
    playPause();
});

function updateSong(action) {
    currentSong.pause();
    currentSong.currentTime = 0;
    if (action === 'next'){
        current++;
        if(current >= songs.length)
            current = 0;
    }
    else {
        current--;
        if(current < 0)
            current = songs.length - 1;
    }
    currentSong = songs[current].ele;
    songName.innerText = songs[current].audioName;
    songDescription.textContent = songs[current].audioDesc;
    setTimeout(function () {      
        currentSong.play();
     }, 150);
}