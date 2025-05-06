// --- Configuration ---
// Replace this with your Minecraft server's IP address or domain name.
// If your server uses a non-standard port, include it (e.g., "play.myserver.com:25577")
const serverAddress = "play.jackpotmc.com";

// --- Get HTML Elements ---
// Find the HTML elements we need to update using their IDs.
const ipElement = document.getElementById("server-ip");
const statusIndicatorElement = document.getElementById("server-status-indicator");
const statusTextElement = document.getElementById("server-status-text");
const playersElement = document.getElementById("server-players");

// --- Function to Fetch and Update Status ---
function fetchServerStatus() {
    // Construct the API URL for mcsrvstat.us (using API version 3 for Java Edition)
    const apiUrl = `https://api.mcsrvstat.us/3/${serverAddress}`;

    // Display the configured server address (optional, useful if you don't hardcode it in HTML)
    if (ipElement) {
       ipElement.textContent = serverAddress;
    }

    // Use the Fetch API to get data from the mcsrvstat.us API
    fetch(apiUrl)
        .then(response => {
            // Check if the network request itself was successful
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            // Parse the JSON data from the response
            return response.json();
        })
        .then(data => {
            // --- Process the API data ---
            console.log("API Response:", data); // Log the data for debugging

            // Reset status indicator classes
            statusIndicatorElement.className = 'status-indicator'; // Reset classes

            if (data.online) {
                // Server is ONLINE
                statusIndicatorElement.classList.add("status-online");
                statusIndicatorElement.classList.remove("status.checking");
                statusTextElement.textContent = "Online";
                // Display player count (use 0 if 'players' object is missing)
                const onlinePlayers = data.players ? data.players.online : 0;
                const maxPlayers = data.players ? data.players.max : 0;
                playersElement.textContent = `${onlinePlayers} / ${maxPlayers}`;
            } else {
                // Server is OFFLINE
                statusIndicatorElement.classList.add("status-offline");
                statusIndicatorElement.classList.remove("status.checking");
                statusTextElement.textContent = "Offline";
                playersElement.textContent = "0 / 0";
            }
        })
        .catch(error => {
            // --- Handle Errors ---
            console.error("Error fetching server status:", error);

            // Reset status indicator classes and add error class
            statusIndicatorElement.className = 'status-indicator';
            statusIndicatorElement.classList.add("status-error");

            // Display error message
            statusTextElement.textContent = "Error";
            playersElement.textContent = "? / ?";
        });
}

// --- Initial Fetch on Page Load ---
// Call the function once when the script loads to get the initial status.
fetchServerStatus();

// --- Optional: Auto-Refresh ---
// Uncomment the following lines to automatically refresh the status every 60 seconds (60000 milliseconds).

setInterval(fetchServerStatus, 10000); // Refresh every 1 minute
