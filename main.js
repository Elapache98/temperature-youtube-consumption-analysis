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
    { xHappinessRating: 3, yMinutesOnYoutube: 10, manchesterUnitedWon: null },
    /*** 12/02/23 ***/
    { xHappinessRating: 4.5, yMinutesOnYoutube: 237, manchesterUnitedWon: true },
    /*** 13/02/23 ***/
    { xHappinessRating: 3, yMinutesOnYoutube: 90, manchesterUnitedWon: null },
    /*** 14/02/23 ***/
    { xHappinessRating: 3, yMinutesOnYoutube: 214, manchesterUnitedWon: null },
    /*** 15/02/23 ***/
    { xHappinessRating: 3, yMinutesOnYoutube: 102, manchesterUnitedWon: null },
    /*** 16/02/23 ***/
    { xHappinessRating: 4, yMinutesOnYoutube: 165, manchesterUnitedWon: false },
    /*** 17/02/23 ***/
    { xHappinessRating: 2, yMinutesOnYoutube: 100, manchesterUnitedWon: null },
    /*** 18/02/23 ***/
    { xHappinessRating: 3, yMinutesOnYoutube: 39, manchesterUnitedWon: null },
    /*** 19/02/23 ***/
    { xHappinessRating: 4, yMinutesOnYoutube: 60, manchesterUnitedWon: true },
    /*** 20/02/23 ***/
    { xHappinessRating: 4, yMinutesOnYoutube: 128, manchesterUnitedWon: null },
    /*** 21/02/23 ***/
    { xHappinessRating: 3.5, yMinutesOnYoutube: 135, manchesterUnitedWon: null },
];

let happinessRange = d3.scaleLinear()
    .domain([0, 5])
    .range([margin, svgWidth - margin]);

let minutesOnYoutube = d3.scaleLinear()
    .domain([0, 500])
    .range([svgHeight - margin, margin]);

let circles = svg.selectAll("circle")
    .data(dataset)
    .join("circle");

circles.attr("r", 8)
    .attr("cx", function (value) {
        return happinessRange(value.xHappinessRating);
    })
    .attr("cy", function (value) {
        return minutesOnYoutube(value.yMinutesOnYoutube);
    })
    .attr("fill", function (value)
    /****  the function takes into consideration the value of the x axis to depict what color the circle would be
    black = less than 3
    orange = less than 3.5 but more than 3
    green = more than 3.5
    (0-sad & black circles  - average & orange circles 5-very happy & green circles)
    this provides an easier way to visually discern how my my mood and my increase or decrease in youtube consumption are correlated****/ {
        if (value.xHappinessRating < 3) {
            return "black";
        } else if (value.xHappinessRating > 3.5) {
            return "green";
        } else { return "orange"; }
    })
    /*** here this function considers the radi of the circles. I added another property to the data set
     * that takes into considerations days where Manchester United played to see whether days the play affect my mood and 
     * how that correlates with the minutes I spend on Youtube. Days where United play will typically have bigger
     * circles than days when Manchester United don't play. If Manchester United wins - the circle is the biggest
     * If Manchester United, draw or lose, the circle is medium
     * if Manchester United, do not play the circle is rather quite small
     */
    .attr("r", function (value) {
        if (value.manchesterUnitedWon === true) {
            return 10;
        } else if (value.manchesterUnitedWon === false) {
            return 5;
        } else {
            return 3;
        }

    });

/**** label the axes ****/
let xAxisLabel = svg.append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - (margin / 4))
    .attr("text-anchor", "middle")
    .text("Happiness level scale: 0 being 😔 - 5 being 😃");

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
    .text("5");

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
        return "Happiness Rating: " + value.xHappinessRating + "\nMinutes on Youtube: " + value.yMinutesOnYoutube + "\nManchester United Win: " + value.manchesterUnitedWon;
    });

