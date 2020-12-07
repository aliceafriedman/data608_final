//References:
// 'Data Visualization with D3 by Michael Menz' https://www.youtube.com/watch?v=219xXJRh4Lw&t=2132s
// 'categorical colors' by Ariel Aizemberg http://bl.ocks.org/aaizemberg/78bd3dade9593896a59d
// 'Making a Bar Chart with D3.js and SVG [Reloaded]' by Curran Kelleher https://www.youtube.com/watch?v=NlBt-7PuaLk

// SETUP

//function returns categorial colors based on the number of categories given
// function color_range(n) {
//     var colors_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
//     return colors_g[n % colors_g.length];
//   }

console.log("message: loading js")
// LAYOUT
d3.select("#map").style("background-color", "AliceBlue")

// CHART FUNCTION
const graph = d3.select("#graph");

const g_width = +graph.attr("width");
const g_height = +graph.attr("height");


const renderGraph = data => {
    data.sort(function (a,b) {return d3.ascending(-a.value, -b.value);});

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([0, g_width])
    
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.key))
        .range([0, g_height])

    d3.select("#graph")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d.key))
        .attr("width", d => xScale(d.value))
        .attr("height", yScale.bandwidth())
};

// MAP FUNCTION

const myMap = d3.select("#map") 

const m_width = +myMap.attr("width");
const m_height = +myMap.attr("height");

const renderMap = data => {

    const xVal = d => +d.x_coordinate_cd;
    const yVal = d => +d.y_coordinate_cd; 

    // const xScale = d3.scaleLinear()
    //     .domain([0, d3.max(data, d => xVal)])
    //     .range([0, m_width])
    
    // const yScale = d3.scaleBand()
    //     .domain(data.map(d => yVal))
    //     .range([0, m_height])
    
    // creates a variable "summons" with a 'g' tag wiht location for each summons given
    var summons = d3.select("#map")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
        .attr("class", "summons")
        .attr("transform", function(d) {
            return "translate(" + 
            (+d.x_coordinate_cd / 400 - 2250) +
            "," +
            (-d.y_coordinate_cd/ 400 + 700) +
            ")";
        })
    // // add annotation on mouseover
    // .on("mouseover", function(d) { 
    //     d3.select(this).raise()
    //     .append("text")
    //     .attr("class", "offense")
    //     .text(d.offense_description);
    // })
    // // clear annotation on mouseout
    // .on("mouseout", function (d){
    //     d3.selectAll("text.offense").remove();
    // })

    // adds circle to each summons    
    summons.append("circle")
        .attr("r", 2)
        .attr("fill", "gray")
        .attr("class", "circles")
        .attr("opacity", 0.1)
        // .attr("fill", function(d) {
        //     if d.race = 

        // })

};

// DATA & MAP

// const url = 'https://data.cityofnewyork.us/resource/sv2w-rv3k.csv';
// d3.csv(url, function(data){ //load from web
//     console.log("message: loading from web")


d3.json(jsonPath, function(data){ // csvPath defined in index.html
    console.log("message: loading from file")
    
    console.log(data);

    //sort alphabetically by offense_description
    data.sort(function (a,b) {return d3.ascending(a.offense_description, b.offense_description);});

    // groups data by offense_description, counts number of offenses    
    var offenses = d3.nest()
        .key(function(d){return d.offense_description; })
        .rollup(function(a){return a.length;})
        .entries(data);

    console.log(offenses);

    // add "All" to top of list
    offenses.unshift({
        "key": "All",
        "value":d3.sum(offenses, function (d){return d;})
    });


    // creates options in the select based on the offenses listed in the data
    var selector = d3.select("#selector");

    selector
        .selectAll("option")
        .data(offenses) 
        .enter()
        .append("option")
            .text(function(d){return d.key;})
            .attr("value", function(d){
                return d.key;
            });
    
    // fade out summonses if not selected, highlights selected summons in blue, larger circle
    selector
        .on("change", function(){
            // d3.selectAll(".summons").raise(); //takes too long
            console.log("message: working");
            d3.selectAll(".circles")
                .attr("fill", "blue")
                .attr("opacity", 1.0)
                .attr("r", 6);
            var value = selector.property("value");
            if (value != "All") {
                d3.selectAll(".circles")
                    .filter( function(d) {
                        return d.offense_description != value;
                    })
                    .attr("fill", "gray")
                    .attr("opacity", 0.1)
                    .attr("r", 2);
            } 
            // else {
            //     d3.selectAll(".circles")
            //     .attr("r", 1)
            //     .attr("fill", "black")
            // }

        });

    renderGraph(offenses);

    renderMap(data);

// END DATA FUNCTION
});
