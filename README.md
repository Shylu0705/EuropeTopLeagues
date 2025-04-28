# Football Team Visualization and Head-to-Head Comparison

This project consists of two major parts:

## 1. Interactive Football Map (`index.html` + `script.js`)

- Visualizes major European football leagues (La Liga, Premier League, Ligue 1, Bundesliga, Serie A) on a Leaflet map.
- Stadiums are marked with colored circular markers based on league color.
- Clicking on a league zooms into its country and highlights it.
- Hovering and clicking markers shows information about the club, stadium, and match statistics (wins, losses, draws).
- Built with **Leaflet.js**, **vanilla JavaScript**, and **basic HTML/CSS**.

## 2. Head-to-Head Team Comparison (`index2.html`)

- Provides a UI for selecting a **league** and comparing **two teams**.
- Displays their **head-to-head match results**.
- Uses **D3.js v7** for data loading and simple dynamic UI updates.
- Fully responsive with simple animations and dark mode aesthetic.

## How to Use

1. Open a terminal in the project directory.
2. Run the following command to start a local HTTP server:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```
4. The main page (`Map Visualization`) will load automatically.
5. Use the navigation bar at the top to switch between (`Map Visualization`) and (`Head-to-head`).

## Technologies Used

- **Leaflet.js**: Interactive maps and markers.
- **D3.js v7**: Data binding and updating the DOM dynamically.
- **HTML5** + **CSS3**: Frontend layout and styling.
- **Vanilla JavaScript**: Application logic.
- **OpenStreetMap** + **CartoDB**: Tile provider for maps.
