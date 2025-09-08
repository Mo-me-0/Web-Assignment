const playerContainer = document.querySelector(".player-container"),
    playerDisplay = playerContainer.querySelector(".player-display"),
    musicImg = playerContainer.querySelector(".song-img"),
    buttonImg = playerContainer.querySelector(".music-img"),
    musicName = playerContainer.querySelector(".title"),
    musicArtist = playerContainer.querySelector(".artist"),
    playPause = playerContainer.querySelector("#play-pause"),
    prevButton = playerContainer.querySelector("#prev"),
    nextButton = playerContainer.querySelector("#next"),
    mainAudio = playerContainer.querySelector("#song"),
    progressArea = playerContainer.querySelector(".progress-area"),
    progressBar = playerContainer.querySelector(".progress-bar");

// Global variables to keep track of the current music selection
let albumIndex = 0;
let songIndex = 0;

window.addEventListener("load", () => {
    // Check for a specific song to play from a URL parameter
    const params = new URLSearchParams(window.location.search);
    const playAlbum = params.get('album');
    const playSong = params.get('song');
    
    if (playAlbum) {
        // Find the index of the album in the allAlbums array
        const albumIdx = allAlbums.findIndex(album => album.albumName === decodeURIComponent(playAlbum));
        if (albumIdx !== -1) {
            // Check for a specific song within the album
            const songIdx = playSong ? allAlbums[albumIdx].tracks.findIndex(track => track.name === decodeURIComponent(playSong)) : 0;
            
            // Play the album (or specific song in the album)
            loadMusic(albumIdx, songIdx !== -1 ? songIdx : 0);
            playMusic();
            return;
        }
    }
    // If no specific music is selected, load the default track
    loadMusic(albumIndex, songIndex);
});

// A function to be called from other pages to play a specific song
window.playSpecificMusic = function(albumIdx, songIdx) {
    albumIndex = albumIdx;
    songIndex = songIdx;
    loadMusic(albumIndex, songIndex);
    playMusic();
};

// Loads the music details into the player
function loadMusic(albumIdx, songIdx) {
    const currentAlbum = allAlbums[albumIdx];
    const currentSong = currentAlbum.tracks[songIdx];

    musicName.innerText = currentSong.name;
    musicArtist.innerText = currentAlbum.artist;
    musicImg.src = buttonImg.src = `./Assets/Images/${currentAlbum.albumArt}`;
    mainAudio.src = `./Assets/musics/${currentSong.src}`;
    saveToHistory(albumIdx, songIdx);
}

// Function to play music
function playMusic() {
    playerContainer.style.visibility = "visible";
    playerContainer.classList.add("playing");
    playPause.innerHTML = "<i class='bx bx-pause'></i>";
    mainAudio.play();
}

// Function to pause music
function pauseMusic() {
    playerContainer.classList.remove("playing");
    playPause.innerHTML = "<i class='bx bx-play'></i>";
    mainAudio.pause();
}

// Plays the previous music in the playlist
function prevMusic() {
    songIndex--;
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

// Plays the next music in the playlist
function nextMusic() {
    songIndex++;
    if (songIndex >= allAlbums[albumIndex].tracks.length) {
        songIndex = 0;
        albumIndex++;
        if (albumIndex >= allAlbums.length) {
            albumIndex = 0;
        }
    }
    loadMusic(albumIndex, songIndex);
    playMusic();
}

// Toggles between play and pause
function playOrPause() {
    const isMusicPlaying = playerContainer.classList.contains("playing");
    isMusicPlaying ? pauseMusic() : playMusic();
}

// Event listener for time updates and progress bar
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    let musicCurrentTime = playerContainer.querySelector(".current-time"),
        musicDuration = playerContainer.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {
        let mainDuration = mainAudio.duration,
            totalMin = Math.floor(mainDuration / 60),
            totalSec = Math.floor(mainDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    let currentMin = Math.floor(currentTime / 60),
        currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Event listener to allow clicking on the progress bar to change cuurent time
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth,
        clickedOffsetX = e.offsetX,
        songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
});

// Automatically plays the next song when the current one ends
mainAudio.addEventListener("ended", () => {
    nextMusic();
});

// Toggles the visibility of the full music player display
function toggleDisplay() {
    if (playerDisplay.style.opacity != "0") {
        playerDisplay.style.transform = "translateY(450px)";
        playerDisplay.style.opacity = "0";
    } else {
        playerDisplay.style.transform = "translateY(0)";
        playerDisplay.style.opacity = "1";
    }
}
// Scrolls the given container to the right by its full width
function scrollRight(container) {
    container = document.getElementById(container);
    container.scrollBy({
        left: container.offsetWidth,
        behavior: 'smooth'
    });
}
// Scrolls the given container to the left by its full width
function scrollBack(container) {
    container = document.getElementById(container);
    container.scrollBy({
        left: -container.offsetWidth,
        behavior: 'smooth'
    });
}
// Function to save the current song to history
function saveToHistory(albumIdx, songIdx) {
    const history = JSON.parse(localStorage.getItem('musicHistory')) || [];
    const currentSong = {
        albumIndex: albumIdx,
        songIndex: songIdx,
        name: allAlbums[albumIdx].tracks[songIdx].name,
        artist: allAlbums[albumIdx].artist,
        albumArt: allAlbums[albumIdx].albumArt
    };

    // Prevent duplicates and keep the list at a reasonable length
    const existingIndex = history.findIndex(item => item.name === currentSong.name && item.artist === currentSong.artist);
    if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
    }
    
    // Add the new song to the top of the history list
    history.unshift(currentSong);

    // Limit the history to the last 20 songs
    if (history.length > 20) {
        history.pop();
    }
    
    localStorage.setItem('musicHistory', JSON.stringify(history));
}