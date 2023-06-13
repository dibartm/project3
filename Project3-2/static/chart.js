let ctx = document.getElementById('myChart').getContext('2d');
let myChart = null; // Declare a variable to store the Chart instance
// let geocodedData = null; // Variable to store the geocoded data

// Function to fetch and store the geocoded data
// function fetchGeocodedData() {
//   return fetch('/data')
//     .then(response => response.json())
//     .then(data => {
//       geocodedData = data;
//     });
// }

// Function to get the geocoded coordinates for a stream name
// function getGeocodedCoordinates(streamName) {
//   if (geocodedData && geocodedData[streamName]) {
//     return geocodedData[streamName];
//   }
//   return null;
// }

// Fetch and store the geocoded data when the page is loaded
// fetchGeocodedData().then(() => {
  // Enable the year select element once the data is loaded
  yearSelect.disabled = false;
// });

// Fetch chart data based on the selected year
yearSelect.addEventListener('change', function() {
  let year = yearSelect.value;  // Get the selected year

  fetch('/chart-data/' + year)
    .then(response => response.json())
    .then(data => {
      let labels = Object.keys(data);
      let hatcheryData = labels.map(label => data[label].hatchery);
      let wildData = labels.map(label => data[label].wild);

      // Destroy the existing Chart instance if it exists
      const destroyPromise = new Promise(resolve => {
        if (myChart) {
          myChart.destroy();
          myChart = null;
        }
        resolve();
      });

      // Create a new Chart instance after destroying the previous one
      destroyPromise.then(() => {
        myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Hatchery Salmon',
                data: hatcheryData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              },
              {
                label: 'Wild Salmon',
                data: wildData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      });
    });
});
