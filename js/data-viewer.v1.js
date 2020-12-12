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

    var summons = summonsData.features;

    //sort by year
    summons.sort(function (a,b) {return d3.ascending(a.properties.YEAR, b.properties.YEAR);});

    var years = d3.nest()
        .key(function(d){return d.properties.YEAR; })
        .rollup(function(a){return a.length;})
        .entries(summons);


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

    svg.append( "g" ).attr("id", "summons-map")
        .selectAll('path')
        .data(summons)
        .enter()
        .append('path')
            .attr("class", "summons-dots")
            // .attr("opacity", .1)
            .attr( "d", geoPath )
            .attr("fill", function(d) {
                if(d.properties.cat == 'commercial'){
                    return "yellow";
                } else{
                    return "steelblue";
                }
            });

    selector.on("change", function(){
        var value = selector.property("value");
        console.log(value);

        d3.selectAll('.summons-dots')
            .filter(function(d){
                
                return d.properties.YEAR != value;
            })
            .attr("opacity", 0);

        d3.selectAll('.summons-dots')
            .filter(function(d){
                
                return d.properties.YEAR == value;
            })
            .attr("opacity", 1);
        

    });
    // add annotation on mouseover
    // .on("mouseover", function(d){
    //     d3.select("#anno-text").text(
    //         `Age: ${d.properties.RACE}, Race: ${d.properties.RACE}, Gender: ${d.properties.SEX}`
    //         );
    // })
    // .on("mouseout", function(d){
	// 	d3.select("#anno-text").text("");
    // });


    



});






console.log("done");