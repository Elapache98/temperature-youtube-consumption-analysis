"use strict"

/* Configuration variables: drawing */
let svgWidth = 600;
let svgHeight = 600;
let margin = 25;

/* Resize div to match width of visualization. */
d3.select("#container")
    .style("width", String(svgWidth) + "px");

/* Create drawing canvas */
let svg = d3.select("#canvas")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

/* Draw canvas border */
svg.append("rect")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

/* Draw margin border. */
svg.append("rect")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-dasharray", "5")
    .attr("x", margin)
    .attr("y", margin)
    .attr("width", svgWidth - margin * 2)
    .attr("height", svgHeight - margin * 2);

let dataset = [
    /*** 
     x= daily observation of happiness levels on a scale of 0-5 with 0 being sad and 5 being happy
     y= minutes spent on Youtube/day
     ***/
    /*** 11/02/23 ***/
    { xAvgTemperature: 44, yMinutesOnYoutube: 10, moodRange: 3 },
    /*** 12/02/23 ***/
    { xAvgTemperature: 51, yMinutesOnYoutube: 237, moodRange: 4.5 },
    /*** 13/02/23 ***/
    { xAvgTemperature: 43, yMinutesOnYoutube: 90, moodRange: 3 },
    /*** 14/02/23 ***/
    { xAvgTemperature: 51, yMinutesOnYoutube: 214, moodRange: 3 },
    /*** 15/02/23 ***/
    { xAvgTemperature: 59, yMinutesOnYoutube: 102, moodRange: 3 },
    /*** 16/02/23 ***/
    { xAvgTemperature: 63, yMinutesOnYoutube: 165, moodRange: 4 },
    /*** 17/02/23 ***/
    { xAvgTemperature: 60, yMinutesOnYoutube: 100, moodRange: 2 },
    /*** 18/02/23 ***/
    { xAvgTemperature: 41, yMinutesOnYoutube: 39, moodRange: 3 },
    /*** 19/02/23 ***/
    { xAvgTemperature: 48, yMinutesOnYoutube: 60, moodRange: 4 },
    /*** 20/02/23 ***/
    { xAvgTemperature: 61, yMinutesOnYoutube: 128, moodRange: 4 },
    /*** 21/02/23 ***/
    { xAvgTemperature: 40, yMinutesOnYoutube: 135, moodRange: 3.5 },
    /*** 22/02/23 ***/
    { xAvgTemperature: 44, yMinutesOnYoutube: 66, moodRange: 2 },

    /*** 23/02/23 ***/
    { xAvgTemperature: 32, yMinutesOnYoutube: 126, moodRange: 3.5 },
];

dataset.sort(function compareByTemperature(a, b) {
    return a.xAvgTemperature - b.xAvgTemperature
})




let tempRange = d3.scaleLinear()
    .domain([0, 100])
    .range([margin, svgWidth - margin]);

let minutesOnYoutube = d3.scaleLinear()
    .domain([0, 250])
    .range([svgHeight - margin, margin]);

let circles = svg.selectAll("circle")
    .data(dataset)
    .join("circle");

circles.attr("r", 8)
    .attr("cx", function (value) {
        return tempRange(value.xAvgTemperature);
    })
    .attr("cy", function (value) {
        return minutesOnYoutube(value.yMinutesOnYoutube);
    })
    .attr("fill", function (value) {
        // Set the color of the circle based on the xAvgTemperature value
        if (value.xAvgTemperature < 55) {
            return "blue"; // Cooler weather
        } else {
            return "red"; // More comfortable weather
        }
    })
    .attr("r", function (value) {
        // Set the radius of the circle based on the moodRange value
        if (value.moodRange >= 4) {
            return 10; // Mood is great
        } else if (value.moodRange <= 2) {
            return 3; // Mood is sour
        } else {
            return 6; // Mood is average
        }
    })
    .attr("opacity", 0.5); // Set the opacity of the circle to 50%

/**** label the axes ****/
let xAxisLabel = svg.append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - (margin / 4))
    .attr("text-anchor", "middle")
    .text("Temperature in degrees Fahrenheit");

let yAxisLabel = svg.append("text")
    .attr("x", -svgHeight / 2)
    .attr("y", margin / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text("Time spent on Youtube in minutes")
    .attr("transform", "rotate(-90)");

/**** label key graph coordinates ****/
let originLabel = svg.append("text")
    .attr("x", margin)
    .attr("y", svgHeight - (margin / 2))
    .attr("text-anchor", "middle")
    .text("0");

/* labels the max value of coordinates on the X axis */
let xAxisMaxValue = svg.append("text")
    .attr("x", svgWidth - margin)
    .attr("y", svgHeight - (margin / 2))
    .attr("text-anchor", "end")
    .text("100");

/* labels the max value of coordinates on the Y axis */

let yAxisMaxValue = svg.append("text")
    .attr("x", -margin)
    .attr("y", margin / 2)
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "middle")
    .text("500")
    .attr("transform", "rotate(-90)");

/* I learned about the tooltip functionality from previous courses and researched a way to use the tool tip in the 
d3.library. I thought it would make the data more intuitive for viewers. Here the function is just 
pulling the values of the datasets for each circle and shows the user what these values are when hovered
source: https://www.pluralsight.com/guides/create-tooltips-in-d3js */
circles.append("title")
    .text(function (value) {
        return "Temperature: " + value.xAvgTemperature + "\nMinutes on Youtube: " + value.yMinutesOnYoutube + "\nMood scale: " + value.moodRange;
    });

