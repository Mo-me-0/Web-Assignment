// search.js

// Get references to the HTML elements
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results-container');

// A function to display search results on the page
function displayResults(albums) {
    searchResultsContainer.innerHTML = ''; // Clear existing results

    if (albums.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found. Try a different artist or album name.</p>';
        return;
    }

    // Loop through the filtered albums and create HTML elements
    albums.forEach(album => {
        const albumCard = document.createElement('div');
        albumCard.className = 'album-card';
        albumCard.innerHTML = `
            <h3>${album.albumName}</h3>
            <p>Artist: ${album.artist}</p>
            <img src="./${album.albumArt}" alt="${album.albumName} album art">
            <ul>
                ${album.tracks.map(track => `<li onclick="playSong('${album.artist}', '${album.albumName}', '${track.name}', '${track.src}')">${track.name}</li>`).join('')}
            </ul>
        `;
        searchResultsContainer.appendChild(albumCard);
    });
}

// Function to handle playing a song (this needs to be defined to link to your main player)
function playSong(artist, album, songName, songSrc) {
    // In a real application, you would navigate to the main page with a query parameter
    // or use a service worker to communicate with the main page's music player.
    // For this example, we will just log the action.
    console.log(`Playing: ${songName} by ${artist} from the album ${album}`);
    window.location.href = `index.html?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(songSrc)}`;
}

// Add an event listener to the search input
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();

    // Filter the music data
    const filteredAlbums = allAlbums.filter(album => {
        const albumMatch = album.albumName.toLowerCase().includes(query);
        const artistMatch = album.artist.toLowerCase().includes(query);
        // You could also search for a song name within the tracks array
        const songMatch = album.tracks.some(track => track.name.toLowerCase().includes(query));
        return albumMatch || artistMatch || songMatch;
    });

    displayResults(filteredAlbums);
});

// Optional: Display all albums initially when the page loads
window.addEventListener('load', () => {
    displayResults(allAlbums);
});