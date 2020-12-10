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

Promise.all([
    d3.json('https://opendata.arcgis.com/datasets/c35786feb0ac4d1b964f41f874f151c1_0.geojson'),
    d3.json(filepath)
]).then(([precintData, summonsData]) => {

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
            .attr( "fill", "#900" )
            .attr( "stroke", "#999" )
            .attr( "d", geoPath )
    // add annotation on mouseover
    .on("mouseover", function(d){
        d3.select("#anno-text").text(
            `Race of Sumonsee: ${d.properties.RACE}`
            );
    })
    .on("mouseout", function(d){
		d3.select("#anno-text").text("");
	});

    console.log(summonsData);

});

console.log("done");