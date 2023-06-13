let ctx = document.getElementById('myChart').getContext('2d');

fetch('/chart-data')
  .then(response => response.json())
  .then(data => {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.streams,
            datasets: [{
                label: 'Total Population',
                data: data.populations,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
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
