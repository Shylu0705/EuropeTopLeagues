const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const g = svg.append("g");
const backButton = d3.select("#back-button");
    
const projection = d3.geoMercator()
    .center([13, 52]) // Europe center
    .scale(600)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// 5 countries & respective league data files
const leagues = {
    "United Kingdom": { file: "data/premier_league.csv", code: "GB" },
    "Spain": { file: "data/laliga.csv", code: "ES" },
    "Germany": { file: "data/bundesliga.csv", code: "DE" },
    "France": { file: "data/ligue_1.csv", code: "FR" },
    "Italy": { file: "data/serie_A.csv", code: "IT" }
};

// Load Europe map (TopoJSON)
d3.json("https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson").then(geoData => {
    const countries = geoData.features;

    g.selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", d => Object.values(leagues).some(l => l.code === d.properties.ISO2) ? "#f39c12" : "#34495e")
        .attr("stroke", "#ecf0f1")
        .on("click", function (event, d) {
            const countryName = d.properties.NAME;
            if (leagues[countryName]) {
                const leagueFile = leagues[countryName].file;
                loadLeagueData(leagueFile, countryName);
                zoomToCountry(d);
                backButton.style("display", "block"); // Show back button
            }
        });
});


function zoomToCountry(d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    const dx = x1 - x0;
    const dy = y1 - y0;
    const x = (x0 + x1) / 2;
    const y = (y0 + y1) / 2;
    const scale = 0.8 / Math.max(dx / width, dy / height);
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    g.transition()
        .duration(1000)
        .attr("transform", `translate(${translate}) scale(${scale})`);
}

function loadLeagueData(csvFile, country) {
    d3.csv(csvFile).then(data => {
        console.log("Loaded CSV data:", data); // Check if data is being loaded

        // Extract home and away teams
        const teams = new Set();
        data.forEach(match => {
            teams.add(match.home_team); // Add home team
            teams.add(match.away_team); // Add away team
        });

        const totalTeams = teams.size;
        console.log(`Total teams in ${country}:`, totalTeams); // Log total teams

        // Show the data in the info-box
        d3.select("#info-box")
            .style("display", "block")
            .html(`<strong>${country} League</strong><br>Total Teams: ${totalTeams}`);
    }).catch(err => {
        console.error("Error loading CSV:", err);
        d3.select("#info-box")
            .style("display", "block")
            .html(`<strong>Error loading data for ${country} League</strong>`);
    });
}

backButton.on("click", () => {
    g.transition()
        .duration(1000)
        .attr("transform", "translate(0,0) scale(1)");

    backButton.style("display", "none"); // Hide the button
    d3.select("#info-box").html(""); // Clear info box if you want
});

