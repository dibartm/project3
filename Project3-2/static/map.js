// Define the getColor function
function getColor(category) {
    switch (category) {
        case 'Chinook':
            return 'blue';
        case 'Chum':
            return 'green';
        case 'Coho':
            return 'orange';
        case 'Sockeye':
            return 'red';
        case 'Steelhead':
            return 'yellow';
        default:
            return 'gray'; // Default color if category is not recognized
    }
}

var samap = L.map('map').setView([46.0119, -120.4842], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors'
}).addTo(samap);

// Create the legend control
var legend = L.control({ position: 'bottomleft' });
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var labels = ['<strong>Categories</strong>'];
    var categories = [
        { label: 'Chinook', color: 'blue' },
        { label: 'Chum', color: 'green' },
        { label: 'Coho', color: 'orange' },
        { label: 'Sockeye', color: 'red' },
        { label: 'Steelhead', color: 'yellow' }
    ];

    for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
            '<div class="legend-item">' +
            '<div class="legend-color" style="background-color:' + categories[i].color + ';width:40px;height:40px;border-radius:20px;"></div>' +
            '<span class="legend-label">' + categories[i].label + '</span>' +
            '</div>';
    }

    return div;
};
legend.addTo(samap);

// Fetch data and add markers to the map
fetch('/data')
  .then(rez => rez.json())
  .then(data => {
    console.log(data['Chinook_map_table']);
    data['Chinook_map_table'].forEach(item => {
      if (item['Longitude']) {
        const size = Math.log(item['Total Population']) * 1.5<4 ? 4:Math.log(item['Total Population'])*1.5;
        L.marker([item['Latitude'], item['Longitude']], {
          icon: L.icon({ iconUrl: 'static/images/bluemarker.png', iconSize: [size, size] })
        }).addTo(samap).bindTooltip(`<div>Stream Name:${item['Stream Name']}</div><div>Population:${item['Total Population']}</div>`).addTo(samap);
      }
    });
    data['Chum_map_table'].forEach(item => {
      if (item['Longitude']) {
        const size = Math.log(item['Total Population']) * 1.5<4 ? 4:Math.log(item['Total Population'])*1.5;
        L.marker([item['Latitude'], item['Longitude']], {
          icon: L.icon({ iconUrl: 'static/images/greenmarker.png', iconSize: [size, size] })
        }).addTo(samap).bindTooltip(`<div>Stream Name:${item['Stream Name']}</div><div>Population:${item['Total Population']}</div>`).addTo(samap);
      }
    });
    data['Coho_map_table'].forEach(item => {
      if (item['Longitude']) {
        const size = Math.log(item['Total Population']) * 1.5<4 ? 4:Math.log(item['Total Population'])*1.5;
        L.marker([item['Latitude'], item['Longitude']], {
          icon: L.icon({ iconUrl: 'static/images/orangemarker.png', iconSize: [size, size] })
        }).addTo(samap).bindTooltip(`<div>Stream Name:${item['Stream Name']}</div><div>Population:${item['Total Population']}</div>`).addTo(samap);
      }
    });
    data['Sockeye_map_table'].forEach(item => {
      if (item['Longitude']) {
        const size = Math.log(item['Total Population']) * 1.5<4 ? 4:Math.log(item['Total Population'])*1.5;
        L.marker([item['Latitude'], item['Longitude']], {
          icon: L.icon({ iconUrl: 'static/images/redmarker.png', iconSize: [size, size] })
        }).addTo(samap).bindTooltip(`<div>Stream Name:${item['Stream Name']}</div><div>Population:${item['Total Population']}</div>`).addTo(samap);
      }
    });
    data['Steelhead_map_table'].forEach(item => {
      if (item['Longitude']) {
        const size = Math.log(item['Total Population']) * 1.5<4 ? 4:Math.log(item['Total Population'])*1.5;
        console.log(size)
        L.marker([item['Latitude'], item['Longitude']], {
          icon: L.icon({ iconUrl: 'static/images/yellowmarker.png', iconSize: [size, size] })
        }).addTo(samap).bindTooltip(`<div>Stream Name:${item['Stream Name']}</div><div>Population:${item['Total Population']}</div>`).addTo(samap);
      }
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
