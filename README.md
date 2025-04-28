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

## Working of the Project
![Screenshot 2025-04-27 231407](https://github.com/user-attachments/assets/5393d81b-b677-4850-858d-67ede6bf0c4c) ![Screenshot 2025-04-27 231653](https://github.com/user-attachments/assets/ee5fc740-dc59-4cf9-9649-65db58f4b1de)
![Screenshot 2025-04-27 231745](https://github.com/user-attachments/assets/f89f6f2c-1e36-48d8-aa3f-f5c7320c8b3c) ![Screenshot 2025-04-27 231819](https://github.com/user-attachments/assets/6fb50413-4422-4e49-bf2b-3057289ba342)

## Link to Github Pages
https://shylu0705.github.io/EuropeTopLeagues/




