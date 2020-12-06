
d3.select("body")
.selectAll("p")
.data([4, 8, 15, 16, 23, 42])
.enter().append("p")
  .text(function(d) { return "I\’m number " + d + "!"; });

  d3.selectAll("p")
  .data([4, 8, 15, 16, 23, 42])
    .style("font-size", function(d) { return d + "px"; });


const url = 'https://data.cityofnewyork.us/resource/sv2w-rv3k.csv';

d3.csv(url, function(data){
    console.log(data);

    var offenses = d3.nest()
    .key(function(d){return d.offense_description; })
    .entries((data));


    d3.select("body").selectAll('p').data(data).enter().text(function (d) {
        return "row";
    });
});




//Limit to data is default 1,000 rows, max 50,000 rows. Dataset has 5M+ rows -- need to figure out how to page through it