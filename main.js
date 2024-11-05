// Initialize map layers
const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
});

const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    attribution: '© Google'
});

const stamenTerrain = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
    attribution: '© Stamen Design, OpenStreetMap contributors'
});

// Initialize the map
const map = L.map('map', {
    center: [0, 37],
    zoom: 5,
    layers: [openStreetMap]
});

// Layer control
const baseLayers = {
    "OpenStreetMap": openStreetMap,
    "Google Satellite": googleSatellite,
    "Terrain": stamenTerrain
};

L.control.layers(baseLayers).addTo(map);

// Add Leaflet Draw controls
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
const drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        rectangle: true,
        circle: false,
        polyline: false,
        marker: false
    }
});
map.addControl(drawControl);

// Event handler for drawn items
map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);
});

// Function to analyze the selected area
function analyzeDrawnArea() {
    const layers = drawnItems.getLayers();
    if (layers.length === 0) {
        alert('Please draw an area to analyze.');
        return;
    }

    layers.forEach(layer => {
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        alert(`Selected area is approximately ${Math.round(area / 1000000)} km²`);
    });
}

// Show the correct tab content
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

// Start drawing tool
function startDrawing() {
    new L.Draw.Polygon(map).enable();
}

// Initialize drag and drop for custom data
const uploadArea = document.querySelector('.upload-area');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#1B4F72';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    const files = e.dataTransfer.files;
    handleFiles(files);
});

function handleFiles(files) {
    // Add file handling logic here
    console.log('Files received:', files);
}

// Add event listeners for map controls
document.querySelector('.map-controls').addEventListener('click', (e) => {
    if (e.target.classList.contains('control-button')) {
        const action = e.target.textContent;
        switch(action) {
            case '+':
                map.zoomIn();
                break;
            case '-':
                map.zoomOut();
                break;
            case '⌖':
                map.setView([0, 37], 5);
                break;
        }
    }
});