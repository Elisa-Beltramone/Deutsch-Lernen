

async function loadData() {
    const res = await fetch('/api/progress');
    const data = await res.json();

    const labels = data.daily.map(d => d.session_date);
    const values = data.daily.map(d => d.total);

    // Total time display
    document.getElementById("totalTime").innerText =
        "Total time: " + data.total + " minutes";

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Minutes per day',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        }
    });
}

loadData();
