async function loadDashboard() {
    try {
        // ---------------------------
        // 1️⃣ Fetch progress
        // ---------------------------
        const progressRes = await fetch("/api/progress");
        const progressData = await progressRes.json();

        const dailyData = Array.isArray(progressData.daily) ? progressData.daily : [];

        // Update total time
        document.getElementById("totalTime").innerText =
            "Total time: " + (progressData.total || 0) + " minutes";

        // Prepare chart data
        const labels = dailyData.map(d => d.session_date);
        const values = dailyData.map(d => Number(d.total));

        // Draw chart
        const ctx = document.getElementById("myChart");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Minutes per day",
                    data: values,
                    backgroundColor: "rgba(75, 192, 192, 0.6)"
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } }
            }
        });

        // ---------------------------
        // 2️⃣ Fetch writings
        // ---------------------------
        const writingsRes = await fetch("/api/writings");
        console.log("Status:", writingsRes.status);

        if (!writingsRes.ok) {
            console.error("Server error response:", text);
            throw new Error("Server error: " + writingsRes.status);
        }

        const writings = await writingsRes.json();

        console.log("Writings:", writings);

        const writingsList = document.getElementById("writingsList");
        writingsList.innerHTML = "";

        writings.forEach(w => {

            const li = document.createElement("li");

            li.innerHTML = `
                    <strong>${w.level || "N/A"}</strong>: 
                    ${w.content}
                    <em>(${w.created_at ? new Date(w.created_at).toLocaleDateString() : ""})</em>
                `;
            writingsList.appendChild(li);
        });

    } catch (err) {
        console.error("Error loading dashboard:", err);
        document.getElementById("totalTime").innerText = "Error loading data";
    }
}

loadDashboard();