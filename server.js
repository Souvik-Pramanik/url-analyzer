const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Function to calculate score based on threshold values
function calculateScore(value, goodThreshold, badThreshold) {
    if (value < goodThreshold) {
        return 100;
    } else if (value < badThreshold) {
        return 50;
    } else {
        return 0;
    }
}

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
    var chart = new Chart(ctx, {
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
    var chart = new Chart(ctx, {
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
    var chart = new Chart(ctx, {
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
            legend: {
                display: false
            }
        }
    });
}


// Function to analyze performance
async function analyzePerformance(html) {
    const { window } = new JSDOM(html);
    const document = window.document;

    // Calculate total load time
    const loadEventEnd = window.performance.timing ? window.performance.timing.loadEventEnd : 0;
    const navigationStart = window.performance.timing ? window.performance.timing.navigationStart : 0;
    const loadTime = loadEventEnd - navigationStart;

    // Calculate performance score based on load time
    const loadTimeScore = calculateScore(loadTime, 3000, 5000); // Ideal load time is less than 3 seconds

    return loadTimeScore;
}

// Function to analyze accessibility
async function analyzeAccessibility(html) {
    const { window } = new JSDOM(html);
    const document = window.document;

    // Initialize accessibility score
    let accessibilityScore = 100;

    // Check alt text for images
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        const alt = image.getAttribute('alt');
        if (!alt || alt.trim() === '') {
            accessibilityScore -= 10; // Deduct 10 points for each missing alt text
        }
    });

    // Check for non-semantic HTML elements
    const nonSemanticElements = document.querySelectorAll('div, span');
    nonSemanticElements.forEach(element => {
        accessibilityScore -= 5; // Deduct 5 points for each non-semantic element (e.g., div, span)
    });

    // Ensure accessibility score is within 0 to 100 range
    accessibilityScore = Math.max(0, Math.min(100, accessibilityScore));

    return accessibilityScore;
}

// Function to analyze SEO
async function analyzeSEO(html) {
    const { window } = new JSDOM(html);
    const document = window.document;

    // Initialize SEO score
    let seoScore = 100;

    // Check for title and description meta tags
    const title = document.querySelector('title');
    const description = document.querySelector('meta[name="description"]');
    if (!title) {
        seoScore -= 20; // Deduct 20 points for missing title tag
    }
    if (!description || !description.getAttribute('content')) {
        seoScore -= 10; // Deduct 10 points for missing description meta tag
    }

    // Check for structured data markup
    const schemaMarkup = document.querySelectorAll('[itemtype]');
    if (schemaMarkup.length === 0) {
        seoScore -= 10; // Deduct 10 points for missing structured data markup
    }

    // Check for mobile viewport meta tag
    const mobileViewport = document.querySelector('meta[name="viewport"][content*="width=device-width"]');
    if (!mobileViewport) {
        seoScore -= 10; // Deduct 10 points for missing mobile viewport meta tag
    }

    // Ensure SEO score is within 0 to 100 range
    seoScore = Math.max(0, Math.min(100, seoScore));

    return seoScore;
}


// Route to handle URL analysis
app.post('/analyze', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.get(url);
        const html = response.data;

        const performanceScore = await analyzePerformance(html);
        const accessibilityScore = await analyzeAccessibility(html);
        const seoScore = await analyzeSEO(html);

        res.json({
            performance: performanceScore,
            accessibility: accessibilityScore,
            seo: seoScore
        });
    } catch (error) {
        console.error('Error analyzing URL:', error);
        res.status(500).json({ error: 'An error occurred while analyzing the URL' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
