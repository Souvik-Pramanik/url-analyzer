// Function to analyze URL and update charts
async function analyzeURL() {
    var url = document.getElementById("urlInput").value;

    try {
        const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error('Failed to analyze URL');
        }

        const analysisData = await response.json();
        updatePerformanceChart(analysisData.performance);
        updateAccessibilityChart(analysisData.accessibility);
        updateSEOChart(analysisData.seo);
    } catch (error) {
        console.error('Error analyzing URL:', error);
        // Handle error
    }
}

// Function to update the performance circular percentage chart
function updatePerformanceChart(percentage) {
    var remainingPercentage = 100 - percentage;
    var ctx = document.getElementById("performanceChart").getContext("2d");
    var performanceChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Performance"],
            datasets: [{
                label: "Performance",
                backgroundColor: ["#36a2eb", "#ffffff"],
                data: [percentage, remainingPercentage]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 70, // Adjust as needed
            legend: {
                display: false
            }
        }
    });
}

// Function to update the accessibility circular percentage chart
function updateAccessibilityChart(percentage) {
    var remainingPercentage = 100 - percentage;
    var ctx = document.getElementById("accessibilityChart").getContext("2d");
    var accessibilityChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Accessibility"],
            datasets: [{
                label: "Accessibility",
                backgroundColor: ["#ffcd56", "#ffffff"],
                data: [percentage, remainingPercentage]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 70, // Adjust as needed
            legend: {
                display: false
            }
        }
    });
}

// Function to update the SEO circular percentage chart
function updateSEOChart(percentage) {
    var remainingPercentage = 100 - percentage;
    var ctx = document.getElementById("seoChart").getContext("2d");
    var seoChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["SEO"],
            datasets: [{
                label: "SEO",
                backgroundColor: ["#ff6384", "#ffffff"],
                data: [percentage, remainingPercentage]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 70, // Adjust as needed
            legend: {
                display: false
            }
        }
    });
}

// Function to show loading overlay
function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex";
}

// Function to hide loading overlay
function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none";
}

// Function to analyze URL and update charts
async function analyzeURL() {
    showLoading(); // Show loading overlay while fetching data

    var url = document.getElementById("urlInput").value;

    try {
        const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error('Failed to analyze URL');
        }

        const analysisData = await response.json();
        updatePerformanceChart(analysisData.performance);
        updateAccessibilityChart(analysisData.accessibility);
        updateSEOChart(analysisData.seo);
    } catch (error) {
        console.error('Error analyzing URL:', error);
        // Handle error
    } finally {
        hideLoading(); // Hide loading overlay after fetching data
    }
}
