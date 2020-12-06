//References:
// 'Data Visualization with D3 by Michael Menz' https://www.youtube.com/watch?v=219xXJRh4Lw&t=2132s
// 'categorical colors' by Ariel Aizemberg http://bl.ocks.org/aaizemberg/78bd3dade9593896a59d
// 'Making a Bar Chart with D3.js and SVG [Reloaded]' by Curran Kelleher https://www.youtube.com/watch?v=NlBt-7PuaLk

// SETUP

//function returns categorial colors based on the number of categories given
function color_range(n) {
    var colors_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    return colors_g[n % colors_g.length];
  }


// LAYOUT
d3.select("#map").style("background-color", "AliceBlue")




// DATA
const url = 'https://data.cityofnewyork.us/resource/sv2w-rv3k.csv';
// const filename = '/docs/scratch/NYPD_Criminal_Court_Summons__Historic_.csv'

d3.csv(url, function(data){ //load from web

    // d3.csv(filename, function(data){ //load from file
    // console.log("message: loading from file")

    console.log(data);

    //sort alphabetically by offense_description
    data.sort(function (a,b) {return d3.ascending(a.offense_description, b.offense_description);});

    // creates a variable "summons" with a 'g' tag wiht location for each summons given
    var summons = d3.select("#map")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
            .attr("class", "summons")
            .attr("transform", function(d) {
                return "translate(" + 
                (d.x_coordinate_cd/400 - 2250) +
                "," +
                (-d.y_coordinate_cd/400 + 700) +
                ")";
            })
        // add annotation on mouseover
        .on("mouseover", function(d) { 
            d3.select(this).raise()
            .append("text")
            .attr("class", "offense")
            .text(d.offense_description);
        })
        // clear annotation on mouseout
        .on("mouseout", function (d){
            d3.selectAll("text.offense").remove();
        })

    // adds circle to each summons    
    summons.append("circle")
        .attr("r", 1)
        .attr("class", "circles")
        // .attr("fill", function(d) {
        //     if d.race = 

        // })
    
    // groups data by offense_description, counts number of offenses    
    var offenses = d3.nest()
    .key(function(d){return d.offense_description; })
    .rollup(function(a){return a.length;})
    .entries(data);

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
            d3.selectAll(".circles")
                .attr("fill", "blue")
                .attr("r", 5);
            var value = selector.property("value");
            if (value != "All") {
                d3.selectAll(".circles")
                    .filter( function(d) {
                        return d.offense_description != value;
                    })
                    .attr("fill", "gray")
                    .attr("r", 1);
            } else {
                d3.selectAll(".circles")
                .attr("r", 1)
                .attr("fill", "black")
            }

        });

    

// END DATA FUNCTION
});
