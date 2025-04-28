document.addEventListener('DOMContentLoaded', () => {
    // League configurations
    const leagues = [
        { name: 'La Liga', file: 'laliga.csv', country: 'Spain', color: 'yellow', id: 'league-laliga' },
        { name: 'Premier League', file: 'premier_league.csv', country: 'England', color: 'red', id: 'league-premier' },
        { name: 'Ligue 1', file: 'ligue_1.csv', country: 'France', color: 'blue', id: 'league-laliga' },
        { name: 'Bundesliga', file: 'bundesliga.csv', country: 'Germany', color: 'green', id: 'league-bundesliga' },
        { name: 'Serie A', file: 'serie_A.csv', country: 'Italy', color: 'purple', id: 'league-seriea' }
    ];

    // Country bounds for zooming
    const countryBounds = {
        'Spain': { bounds: [[36.0, -9.5], [43.8, 3.5]], zoom: 6 },
        'England': { bounds: [[50.0, -5.7], [55.8, 1.8]], zoom: 6 },
        'France': { bounds: [[42.0, -4.8], [51.0, 8.2]], zoom: 6 },
        'Germany': { bounds: [[47.0, 5.9], [55.0, 15.0]], zoom: 6 },
        'Italy': { bounds: [[36.6, 6.6], [47.0, 18.5]], zoom: 6 }
    };

    // Define the max bounds for the map (bounding box)
    const maxBounds = [
        [30.0, -20.0],  // Southwest coordinates (lower-left)
        [60.0, 25.0]    // Northeast coordinates (upper-right)
    ];

    // Initialize the map with the new larger maxBounds
    const map = L.map('map', {
        center: [46.0, 2.0],
        zoom: 5,
        maxBounds: maxBounds,  // Set the new maxBounds
        maxBoundsViscosity: 1.0, // Allows the user to pan up to the max bounds
        worldCopyJump: false,   // Prevents the map from bouncing back to the center when moved beyond bounds
        zoomControl: true,
        minZoom: 5,  // Prevents zooming out beyond a certain level
        maxZoom: 8   // Optional: Set the max zoom level you want
    });

    // Add a tile layer with no roads and minimal details (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attributions">CartoDB</a>',
        noWrap: true
    }).addTo(map);

    // Add a legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        div.innerHTML = leagues.map(league => 
            `<div><i style="background:${league.color}"></i>${league.name} (${league.country})</div>`
        ).join('');
        return div;
    };
    legend.addTo(map);

    // Layer to hold country highlight
    let borderLayer = L.layerGroup().addTo(map);

    // Function to parse CSV data
    const parseCSV = (data) => {
        const rows = data.trim().split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        return rows.slice(1).map(row => {
            const values = row.split(',').map(v => v.trim());
            let match = {};
            headers.forEach((header, i) => {
                match[header] = values[i];
            });
            return match;
        });
    };

    // Function to calculate team stats
    const calculateTeamStats = (matches, leagueName) => {
        const teamStats = {};
        matches.forEach(match => {
            const homeTeam = match['home_team'];
            if (!stadiums[leagueName][homeTeam]) return; // Skip teams not in mapping

            if (!teamStats[homeTeam]) {
                teamStats[homeTeam] = { wins: 0, losses: 0, draws: 0, matches: 0 };
            }

            teamStats[homeTeam].matches++;
            const winner = match['winner'];
            if (winner === homeTeam) {
                teamStats[homeTeam].wins++;
            } else if (winner === 'DRAW') {
                teamStats[homeTeam].draws++;
            } else {
                teamStats[homeTeam].losses++;
            }
        });
        return teamStats;
    };

    // Function to create a custom marker icon
    const createMarkerIcon = (color) => {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid black;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    };

    // Function to highlight a country with a vibrant fill
    const highlightCountry = (country, countryGeoJSON) => {
        // Clear previous highlight
        borderLayer.clearLayers();

        // Add new highlight with vibrant fill
        if (countryGeoJSON[country]) {
            L.geoJSON(countryGeoJSON[country], {
                style: {
                    color: 'transparent',  // No border
                    weight: 0,            // Remove border
                    fillColor: '#FFD700', // Vibrant gold color for the fill
                    fillOpacity: 0.4      // Slightly higher opacity for a stronger effect
                }
            }).addTo(borderLayer);
        }
    };

    // Function to set active league link
    const setActiveLeague = (leagueId) => {
        // Remove active class from all links
        document.querySelectorAll('header ul li a').forEach(link => {
            link.classList.remove('active');
        });
        // Add active class to the clicked link
        const activeLink = document.getElementById(leagueId);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    };

    // Fetch country borders GeoJSON
    fetch('country_borders.json')
        .then(response => response.json())
        .then(countryGeoJSON => {
            // Process each league and store markers
            Promise.all(leagues.map(league => 
                fetch(league.file)
                    .then(response => response.text())
                    .then(data => {
                        const matches = parseCSV(data);
                        const teamStats = calculateTeamStats(matches, league.name);
                        return { league: league.name, teamStats, color: league.color, country: league.country };
                    })
            ))
            .then(results => {
                results.forEach(({ league, teamStats, color, country }) => {
                    Object.keys(teamStats).forEach(team => {
                        const { lat, lng, stadium, city } = stadiums[league][team];
                        const { wins, losses, draws, matches } = teamStats[team];

                        const popupContent = `
                            <div style="padding: 5px;">
                                <b>${team} (${league})</b><br>
                                Stadium: ${stadium}<br>
                                City: ${city}<br>
                                Home Matches: ${matches}<br>
                                Wins: ${wins}<br>
                                Losses: ${losses}<br>
                                Draws: ${draws}
                            </div>
                        `;

                        L.marker([lat, lng], { icon: createMarkerIcon(color) })
                            .addTo(map)
                            .bindPopup(popupContent);
                    });

                    // Add click event for each league link
                    const leagueLink = document.getElementById(leagues.find(l => l.name === league).id);
                    if (leagueLink) {
                        leagueLink.addEventListener('click', (e) => {
                            e.preventDefault();
                            const bounds = countryBounds[country].bounds;
                            const zoom = countryBounds[country].zoom;
                            map.fitBounds(bounds, { maxZoom: zoom });
                            highlightCountry(country, countryGeoJSON);
                            setActiveLeague(leagueLink.id);
                        });
                    }
                });
            })
            .catch(error => {
                console.error('Error loading CSV files:', error);
                alert('Failed to load football data. Please check the console for details.');
            });
        })
        .catch(error => {
            console.error('Error loading country borders:', error);
            alert('Failed to load country borders data. Please check the console for details.');
        });
});
