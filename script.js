const playerContainer=document.querySelector(".player-container"),
    playerDisplay=playerContainer.querySelector(".player-display"),
    musicImg=playerContainer.querySelector(".song-img"),
    buttonImg=playerContainer.querySelector(".music-img"),
    musicName=playerContainer.querySelector(".title"),
    musicArtist=playerContainer.querySelector(".artist"),
    playPause=playerContainer.querySelector("#play-pause"),
    prevButton=playerContainer.querySelector("#prev"),
    nextButton=playerContainer.querySelector("#next"),
    mainAudio=playerContainer.querySelector("#song"),
    progressArea=playerContainer.querySelector(".progress-area"),
    progressBar=playerContainer.querySelector(".progress-bar");

let albumIndex = 0;
let songIndex = 0;

window.addEventListener("load", () => {
  loadMusic(albumIndex, songIndex);
});
function loadMusic(albumIdx, songIdx){
    const currentAlbum = allAlbums[albumIdx];
    const currentSong = currentAlbum.tracks[songIdx];

    musicName.innerText = currentSong.name;
    musicArtist.innerText = currentAlbum.artist;
    musicImg.src = buttonImg.src= `./Assets/Images/${currentAlbum.albumArt}`;
    mainAudio.src = `./Assets/musics/${currentSong.src}`;
}
function nextMusic(){
    songIndex++;

    // Check if we've gone past the last song in the current album
    if (songIndex >= allAlbums[albumIndex].tracks.length) {
    songIndex = 0;
    albumIndex++;

    // Check if we've gone past the last album
    if (albumIndex >= allAlbums.length) {
        albumIndex = 0;
    }
    }
    loadMusic(albumIndex, songIndex);
    playMusic();
}
function playMusic(){
    playerContainer.style.visibility="visible";
    playerContainer.classList.add("paused");
    playPause.innerHTML = "<i class='bx bx-pause'></i>";
    mainAudio.play();
}

function pauseMusic(){
    playerContainer.classList.remove("paused");
    playPause.innerHTML = "<i class='bx bx-play'></i>";
    mainAudio.pause();
}
function prevMusic(){
    songIndex--;

    // Check if we've gone before the first song
    if (songIndex < 0) {
    albumIndex--;
    if (albumIndex < 0) {
        albumIndex = allAlbums.length - 1;
    }
    songIndex = allAlbums[albumIndex].tracks.length - 1; 
    }
    loadMusic(albumIndex, songIndex);
    playMusic();
}

function playOrPause(){
    const isMusicPlaying = playerContainer.classList.contains("paused");
    isMusicPlaying ? pauseMusic() : playMusic();
}

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime/duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    let musicCurrentTime = playerContainer.querySelector(".current-time"),
        musicDuration = playerContainer.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {
        let mainDuration = mainAudio.duration,
            totalMin = Math.floor(mainDuration / 60),
            totalSec = Math.floor(mainDuration % 60);
        if(totalSec<10){
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    let currentMin = Math.floor(currentTime / 60),
        currentSec = Math.floor(currentTime % 60);
    if(currentSec<10){
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth,
        clickedOffsetX = e.offsetX,
        songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
});

mainAudio.addEventListener("ended", () => {
    nextMusic();
});

function toggleDisplay(){
    if(playerDisplay.style.opacity != "0"){
        playerDisplay.style.transform = "translateY(450px)";
        playerDisplay.style.opacity = "0";
    } else{
        playerDisplay.style.transform = "translateY(0)";
        playerDisplay.style.opacity = "1";
    }
}