document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed.");

    // --- Make sure ChartDataLabels plugin is loaded ---
    if (typeof ChartDataLabels === 'undefined') {
        console.error("ChartDataLabels plugin is not loaded! Make sure the script tag is included in the HTML.");
        // Optionally, prevent chart rendering or provide fallback
    } else {
         Chart.register(ChartDataLabels);
         console.log("ChartDataLabels plugin registered.");
    }


    const canvasElement = document.getElementById("expenseChart");
    console.log("Canvas element found:", canvasElement);

    if (typeof Chart === 'undefined') {
        console.error("Chart.js library is not loaded or defined!");
        return;
    } else {
        console.log("Chart.js library seems loaded.");
    }

    const ctx = canvasElement?.getContext("2d");
    console.log("Canvas 2D context:", ctx);

    // --- Data Extraction from HTML Table ---
    const budgetTableBody = document.getElementById('budgetBody');
    const categories = [];
    const spentData = [];

    if (budgetTableBody) {
        const rows = budgetTableBody.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            if (cells.length >= 3) {
                const category = cells[0].textContent.trim();
                const spentString = cells[2].textContent.replace(/[₱,]/g, '');
                const spentValue = parseFloat(spentString);

                if (!isNaN(spentValue)) {
                    categories.push(category);
                    spentData.push(spentValue);
                } else {
                     console.warn(`Could not parse spent value for category: ${category}`);
                }
            }
        }
        console.log("Extracted Categories:", categories);
        console.log("Extracted Spent Data:", spentData);
    } else {
        console.error("Could not find the budget table body with id 'budgetBody'.");
        if(canvasElement) canvasElement.style.display = 'none';
        const chartContainer = document.querySelector('.chart-container');
        if(chartContainer) {
            const errorMsg = document.createElement('p');
            errorMsg.textContent = "Could not load chart data: Table body not found.";
            errorMsg.style.color = 'red';
            chartContainer.appendChild(errorMsg);
        }
        return;
    }

    const totalSpent = spentData.reduce((sum, value) => sum + value, 0);
    console.log("Total Spent:", totalSpent);

    // --- Chart Colors ---
    const chartColors = [
        '#4CAF50', '#f875aa', '#3498db', '#f39c12', '#9b59b6',
        '#1abc9c', '#e74c3c', '#f1c40f', '#34495e', '#8d6e63'
    ];
    console.log("Using up to", chartColors.length, "colors.");

    let expenseChart;

    if (ctx && categories.length > 0) {
        console.log("Attempting to create pie chart with data labels...");
        try {
            // Destroy previous chart instance if it exists
            if (window.myPieChart instanceof Chart) {
                window.myPieChart.destroy();
            }

            window.myPieChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: categories,
                    datasets: [{
                        label: 'Spent Amount',
                        data: spentData,
                        backgroundColor: categories.map((_, index) => chartColors[index % chartColors.length]),
                        borderColor: '#ffffff',
                        borderWidth: 1
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        // --- Legend Configuration (Kept as requested) ---
                        legend: {
                            position: "bottom", // Keep legend at the bottom
                            display: true,      // Ensure legend is displayed
                            labels: {
                                padding: 20,
                                boxWidth: 15
                            }
                        },
                        tooltip: {
                            callbacks: {
                                // Tooltip still shows value and percentage on hover
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) { label += ': '; }
                                    if (context.parsed !== null) {
                                        const value = context.parsed;
                                        const percentage = totalSpent > 0 ? ((value / totalSpent) * 100).toFixed(1) : 0;
                                        // Using Philippine Peso format
                                        const formattedValue = value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
                                        label += `${formattedValue} (${percentage}%)`;
                                    }
                                    return label;
                                }
                            }
                        },
                        // --- DataLabels Plugin Configuration ---
                        datalabels: {
                            // Formatter function determines what text is shown on the slice
                            formatter: (value, ctx) => {
                                // Calculate percentage for the current slice
                                let percentage = totalSpent > 0 ? ((value / totalSpent) * 100).toFixed(1) : 0;
                                if (parseFloat(percentage) < 3) { // Example: hide labels for tiny slices
                                    return '';
                                }
                                return percentage + '%';
                            },
                            color: '#ffffff', // Color of the percentage text
                            font: {
                                weight: 'bold', // Make the text bold
                                size: 12        // Adjust font size as needed
                            },
                        }
                    },
                    // Layout padding to prevent labels/legend cutting off
                    layout: {
                        padding: {
                            top: 10,
                            bottom: 10, // Add some padding if needed for bottom legend
                            left: 10,
                            right: 10
                        }
                    }
                },
            });
            console.log("Pie chart with data labels created successfully:", window.myPieChart);
        } catch (error) {
            console.error("Error creating pie chart:", error);
        }
    } else {
         if (!ctx) {
            console.error("Could not get 2D context from canvas element.");
         }
         if (categories.length === 0 && budgetTableBody) {
             console.warn("No data extracted from the table to create the chart.");
             const chartContainer = document.querySelector('.chart-container');
             if(chartContainer) {
                 const noDataMsg = document.createElement('p');
                 noDataMsg.textContent = "No budget data available to display in the chart.";
                 noDataMsg.style.textAlign = 'center';
                 noDataMsg.style.marginTop = '20px';
                 chartContainer.appendChild(noDataMsg);
                 if(canvasElement) canvasElement.style.display = 'none';
             }
         }
    }
});