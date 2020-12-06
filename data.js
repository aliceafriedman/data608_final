d3.json('https://data.cityofnewyork.us/resource/sv2w-rv3k.json', function(data){
    console.log(data);
})

//Limit to data is default 1,000 rows, max 50,000 rows. Dataset has 5M+ rows -- need to figure out how to page through it