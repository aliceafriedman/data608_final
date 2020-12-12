// Referenes: 
// ArcGIS Hub, NYPD Precincts GeoJSON https://hub.arcgis.com/datasets/DCP::nyc-police-precincts/data
// NYC Historical Summons Data, https://data.cityofnewyork.us/Public-Safety/NYPD-Criminal-Court-Summons-Historic-/sv2w-rv3k
// Mapping Data with D3, MIT DUSP | Mike Foster http://duspviz.mit.edu/d3-workshop/mapping-data-with-d3/
// Legend tutorial: https://www.d3-graph-gallery.com/graph/custom_legend.html

const svg = d3.select('svg');

const width = +svg.attr("width");
const height = +svg.attr("height");

var projection = d3.geoAlbers()
    .scale( 75000 )
    .rotate( [73.935242,0] )
    .center( [0, 40.7] )
    .translate( [width/2,height/2] );
    
const geoPath = d3.geoPath().projection(projection);


//load data and set up map
Promise.all([
    d3.json('https://opendata.arcgis.com/datasets/c35786feb0ac4d1b964f41f874f151c1_0.geojson'), //basemap
    d3.json(filepath) //link to processed summons data
]).then(([precintData, summonsData]) => {

    //draw basemap

    svg.append("g").attr("id", "precinct-map")
    .selectAll('path')
    .data(precintData.features)
    .enter()
    .append('path')
        .attr("class", "precint")
        .attr( "fill", "#ccc" )
        .attr( "stroke", "#333")
        .attr('d', geoPath);

    //create var for summons data & sort by year
    var summons = summonsData.features;
    summons.sort(function (a,b) {return d3.ascending(a.properties.YEAR, b.properties.YEAR);});
    console.log(summons);

    //rollup by year
    var years = d3.nest()
        .key(function(d){return d.properties.YEAR; })
        .rollup(function(a){return a.length;})
        .entries(summons);

    //add "all" to top of list    
    years.unshift({
        "key": "All",
        "value": true
    });

    // create options in selector based on years
    var selector = d3.select("#selector");

    selector
        .selectAll("option")
        .data(years) 
        .enter()
        .append("option")
            .text(function(d){return d.key;})
            .attr("value", function(d){
                return d.key;
            });

    // create seperate 'g' for each year, which will make processing faster (i think?)
    //will also draw more recent years on top of older years

    for (let year of years) {

        svg.append( "g" )
        .attr("id", `year${year.key}`)
        .attr("opacity", .25) //initial state
        .attr("class", "data_years")
        .selectAll('path')
        .data(summons. filter(function(d){
            return d.properties.YEAR == year.key;
        }))
        .enter()
        .append('path')
            // .attr("class", "summons-dots")
            .attr( "d", geoPath )
            .attr("fill", function(d) {
                if(d.properties.cat == 'commercial'){
                    return "yellow";
                } else{
                    return "steelblue";
                }
            });

    } // end for


    // turn on and off layers based on selection
    selector.on("change", function(){
        var value = selector.property("value");

        if (value=='All'){

            d3.selectAll('.data_years')
                .attr("visibility", "visible")
                // .attr("opacity", 0.25);
            
                d3.select('h1')
                .text('NYC Cycling Summons: 2006-2019'); //update title
        } else {
            
            d3.selectAll('.data_years')
                .attr("visibility", "hidden"); //hide all the data years
            
            d3.select(`#year${value}`)
                .attr("visibility", "visible") //unhide the one data year
                .attr("opacity", .5); 
            
                d3.select('h1')
                .text(`NYC Cycling Summons, ${value}`); //update title

        }  

    });


}); //end then


// add legend. (script adapted from https://www.d3-graph-gallery.com/graph/custom_legend.html)

svg.append("circle").attr("cx",10).attr("cy",30).attr("r", 6).style("fill", "yellow");
svg.append("text")
    .attr("x", 30)
    .attr("y", 30)
    .text("Non-Commercial Cycling Infractions")
    .style("font-size", "15px")
    .attr("alignment-baseline","middle")

svg.append("circle").attr("cx",10).attr("cy",60).attr("r", 6).style("fill", "steelblue");
svg.append("text")
    .attr("x", 30)
    .attr("y", 60)
    .text("Commercial Cycling Infractions")
    .style("font-size", "15px")
    .attr("alignment-baseline","middle")


console.log("done");

// alice a friedman