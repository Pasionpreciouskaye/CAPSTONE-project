document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed."); // Log 1

    const canvasElement = document.getElementById("expenseChart");
    console.log("Canvas element found:", canvasElement); // Log 2

    // Check if Chart object is available (library loaded?)
    if (typeof Chart === 'undefined') {
        console.error("Chart.js library is not loaded or defined!"); // Error Log
        return; // Stop execution if library is missing
    } else {
         console.log("Chart.js library seems loaded."); // Log 3
    }

    const ctx = canvasElement?.getContext("2d");
    console.log("Canvas 2D context:", ctx); // Log 4

    // Ensure we still have 10 colors
    const chartColors = [
        '#4CAF50', // 1
        '#f875aa', // 2
        '#3498db', // 3
        '#f39c12', // 4
        '#9b59b6', // 5
        '#1abc9c', // 6
        '#e74c3c', // 7
        '#f1c40f', // 8
        '#34495e', // 9
        '#8d6e63'  // 10
    ];
     console.log("Using", chartColors.length, "colors."); // Log Color Count

    let expenseChart;

    if (ctx) {
        console.log("Attempting to create chart with updated categories..."); // Log 5
        try {
            expenseChart = new Chart(ctx, {
                type: "bar",
                data: {
                    // Labels represent the months/time axis
                    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    // Datasets represent the categories from your image
                    datasets: [
                        {
                            label: "Active Citizenship", // Category 1 from image
                            backgroundColor: chartColors[0 % chartColors.length],
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Replace with actual data
                        },
                        {
                            label: "Governance", // Category 2 from image
                            backgroundColor: chartColors[1 % chartColors.length],
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Replace with actual data
                        },
                         {
                            label: "Global Mobility", // Category 3 from image
                            backgroundColor: chartColors[2 % chartColors.length],
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Replace with actual data
                        },
                         {
                            label: "Economic Empowerment", // Category 4 from image
                            backgroundColor: chartColors[3 % chartColors.length],
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Replace with actual data
                        },
                        {
                            label: "Peace Building and Security", // Category 5 from image
                            backgroundColor: chartColors[4 % chartColors.length],
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Replace with actual data
                        },
                        {
                            label: "Health", // Category 6 from image
                            backgroundColor: chartColors[5 % chartColors.length],
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Replace with actual data
                        },
                        {
                            label: "Social Inclusion and Equity", // Category 7 from image
                            backgroundColor: chartColors[6 % chartColors.length],
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Replace with actual data
                        },
                        {
                            label: "Education", // Category 8 from image
                            backgroundColor: chartColors[7 % chartColors.length],
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Replace with actual data
                        },
                         {
                            label: "Environment", // Category 9 from image
                            backgroundColor: chartColors[8 % chartColors.length],
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Replace with actual data
                        },
                         {
                            label: "Agriculture", // Category 10 from image
                            backgroundColor: chartColors[9 % chartColors.length],
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Replace with actual data
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "bottom",
                             labels: {
                                padding: 20,
                                boxWidth: 15
                            }
                        },
                         tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                    },
                    scales: {
                         x: {
                            stacked: false, // Set to true if you want stacked bars
                        },
                         y: {
                            stacked: false, // Set to true if you want stacked bars
                            beginAtZero: true,
                            ticks: {
                                // stepSize: 50 // Example: uncomment to force y-axis steps
                            },
                        },
                    },
                },
            });
            console.log("Chart object created successfully:", expenseChart); // Log 6
        } catch (error) {
             console.error("Error creating chart:", error); // Error Log
        }

    } else {
        console.error("Could not get 2D context from canvas element. Chart cannot be created."); // Error Log
    }

});