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
          const spentString = cells[2].textContent.replace(/[₱,]/g, ''); // Handle Peso sign and commas
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
      if(canvasElement) canvasElement.style.display = 'none'; // Hide canvas if no data source
      const chartContainer = document.querySelector('.chart-container');
      if(chartContainer) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Could not load chart data: Table body not found.";
        errorMsg.style.color = 'red';
        chartContainer.appendChild(errorMsg);
      }
      return; // Stop execution if table body isn't found
    }
  
    const totalSpent = spentData.reduce((sum, value) => sum + value, 0);
    console.log("Total Spent:", totalSpent);
  
    // --- Chart Colors ---
    const chartColors = [
      '#4CAF50', '#f875aa', '#3498db', '#f39c12', '#9b59b6',
      '#1abc9c', '#e74c3c', '#f1c40f', '#34495e', '#8d6e63'
      // Add more colors if you expect more categories
    ];
    console.log("Using up to", chartColors.length, "colors.");
  
    let expenseChart; // Changed from window.myPieChart to local variable
  
    if (ctx && categories.length > 0) {
      console.log("Attempting to create pie chart with data labels...");
      try {
        // Destroy previous chart instance if it exists on this specific canvas
          // Checking the Chart instance attached to the canvas context
        if (Chart.getChart(ctx)) {
          Chart.getChart(ctx).destroy();
          console.log("Previous chart instance destroyed.");
        }
  
  
        expenseChart = new Chart(ctx, { // Assign to local variable
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
              // --- Legend Configuration ---
              legend: {
                position: "bottom",
                display: true,
                labels: {
                  padding: 20,
                  boxWidth: 15
                }
              },
              tooltip: {
                callbacks: {
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
                formatter: (value, ctx) => {
                  let percentage = totalSpent > 0 ? ((value / totalSpent) * 100).toFixed(1) : 0;
                  if (parseFloat(percentage) < 3) { // Hide labels for slices smaller than 3%
                    return '';
                  }
                  return percentage + '%';
                },
                color: '#ffffff', // Color of the percentage text
                font: {
                  weight: 'bold',
                  size: 12
                },
              }
            },
            layout: {
              padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
              }
            }
          },
        });
        console.log("Pie chart created successfully:", expenseChart);
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
                // Clear previous messages/canvas if any
                if(canvasElement) canvasElement.style.display = 'none';
                // Remove previous error/no-data messages if they exist
                const existingMsg = chartContainer.querySelector('p.chart-message');
                if (existingMsg) existingMsg.remove();
  
                const noDataMsg = document.createElement('p');
                noDataMsg.textContent = "No budget data available to display in the chart.";
                noDataMsg.className = 'chart-message'; // Add class for potential removal later
                noDataMsg.style.textAlign = 'center';
                noDataMsg.style.marginTop = '20px';
                chartContainer.appendChild(noDataMsg);
  
            }
        }
    }
  });
  
  const menuButton = document.getElementById('menuButton');
  const dropdownMenu = document.getElementById('dropdownMenu');
  // Check if projectpage.js already handled this, maybe check if listeners exist?
  // Simple check: if menuButton exists but has no click listeners yet (basic check)
  let hasClickListener = false;
  // Note: Checking for listeners directly is complex/hacky. Assume projectpage.js might handle it.
  // This inline script will run regardless, potentially adding a duplicate listener if projectpage.js also adds one.
  // A more robust solution would involve flags or checking if projectpage.js defined specific functions/variables.
  if (menuButton && dropdownMenu) {
      console.log("Setting up inline dropdown listener.");
      menuButton.addEventListener('click', () => {
          dropdownMenu.classList.toggle('hidden');
      });
      document.addEventListener('click', (event) => {
          if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
              dropdownMenu.classList.add('hidden');
          }
      });
  }
  
  const footer = document.getElementById('pageFooter');
  function checkScrollBottom() {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 5;
      const isContentShort = document.body.offsetHeight <= window.innerHeight;
      if (isAtBottom || isContentShort) {
          footer.classList.add('visible');
      } else {
          footer.classList.remove('visible');
      }
  }
  window.addEventListener('scroll', checkScrollBottom);
  document.addEventListener('DOMContentLoaded', checkScrollBottom); // Ensure initial check runs