// Referenes: 
// ArcGIS Hub, NYPD Precincts GeoJSON https://hub.arcgis.com/datasets/DCP::nyc-police-precincts/data
// NYC Historical Summons Data, https://data.cityofnewyork.us/Public-Safety/NYPD-Criminal-Court-Summons-Historic-/sv2w-rv3k
// Mapping Data with D3, MIT DUSP | Mike Foster http://duspviz.mit.edu/d3-workshop/mapping-data-with-d3/

const svg = d3.select('svg');

const width = +svg.attr("width");
const height = +svg.attr("height");

var projection = d3.geoAlbers()
    .scale( 90000 )
    .rotate( [73.935242,0] )
    .center( [0, 40.7] )
    .translate( [width/2,height/2] );
    
const geoPath = d3.geoPath().projection(projection);

//timeslider functions adapted from http://duspviz.mit.edu/d3-workshop/mapping-data-with-d3/
var inputValue = null;
var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];




//load data and set up map
Promise.all([
    d3.json('https://opendata.arcgis.com/datasets/c35786feb0ac4d1b964f41f874f151c1_0.geojson'), //basemap
    d3.json(filepath) //link to processed summons data
]).then(([precintData, summonsData]) => {

    console.log(summonsData);


    svg.append("g").attr("id", "precinct-map")
    .selectAll('path')
    .data(precintData.features)
    .enter()
    .append('path')
        .attr("class", "precint")
        .attr( "fill", "#ccc" )
        .attr( "stroke", "#333")
        .attr('d', geoPath)
    .append("title").text("hello");

    svg.append( "g" ).attr("id", "summons-dots")
        .selectAll('path')
        .data(summonsData.features).enter()
        .append('path')
            .attr("class", "summons")
            .attr( "stroke", "#999" )
            // .attr("opacity", 1)
            .attr( "fill", "#999")
            .attr( "d", geoPath );
    // add annotation on mouseover
    // .on("mouseover", function(d){
    //     d3.select("#anno-text").text(
    //         `Age: ${d.properties.RACE}, Race: ${d.properties.RACE}, Gender: ${d.properties.SEX}`
    //         );
    // })
    // .on("mouseout", function(d){
	// 	d3.select("#anno-text").text("");
    // });

    var 

    



});






console.log("done");