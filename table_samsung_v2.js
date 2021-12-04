//formate time
// const TableformatTime = d3.timeFormat('%e %b %Y');

var tabulate_right = function (data,columns) {

    var table_right = d3.select('table#table-tweet-right')
    .style("position", "relative")
    .style("width", columnWidth + "px")
    .style("height", sectionHeight + "px")
    .style("top", adj + 30+ "px")
    .style("border-collapse", "collapse")
    .style("border", "2px black solid")
    .style("display", "block")
    .style("overflow", "scroll");
   

    var thead_right = table_right.append('thead')
    .style("width", columnWidth + "px");
   
    

    var tbody_right = table_right.append('tbody')
    .style("width", columnWidth + "px")
    .style("max-height", sectionHeight + "px");
 
    
    //header
    tableHeader = ["Date", "SAMSUNG random sampled tweet text"]
    thead_right.append('tr')
    .selectAll('th')
    .data(tableHeader)
    .enter()
    .append('th')
    .text(function (d) { return d })
    .style("border", "1px black solid")
    .style("padding", "5px")
    .style("background-color", "lightgray")
    .style("font-weight", "bold")
    .style("text-transform", "uppercase");
  
    var rows_right = tbody_right.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')
  
    var cells_right = rows_right.selectAll('td')
    .data(function(row) {
        return columns.map(function (column) {
            return { column: column, value: row[column] }
            })
        })
    .enter()

    var cells_td_right = cells_right.append('td')
    cells_td_right.style("border", "1px black solid")
    .style("padding", "5px")
    .on("mouseover", function(){
    d3.select(this).style("background-color", "powderblue");
    })
    .on("mouseout", function(){
    d3.select(this).style("background-color", "white");
    })
    .text(function (d) { 
        // console.log(d.value);});
        if (typeof(d.value) == "object") {
            //console.log("Yippee it's an object");
            return TableformatTime(d.value)
          } else {
            return d.value
          }})
    .style("font-size", "12px");
 

    return table_right;
    }       

// read data for stock line chart
d3.dsv(",", "tweets/tweets_samsung.csv", function(d) {

    // console.log(d);

    return {
        Date: new Date(d['timestamp']),
        id: Number(d[""]),
        Segmented: d['Segmented#'],
        hashtag: d['hashtag'],
        tweet_text: d['tweet_text'],
    }
}).then(function(data){
    
    // console.log("samsung TABLE data for extraction", data);

    var lengthOfdata = data.length;
    // console.log("samsung table length of data: ", lengthOfdata)

     //generate 50 random index number for extracting part of data from the dataset 
     //and use these extracted data for table building
    var randomNumbers = []
    for (i=0; i<50; i++) {
        var newNumber =  Math.round(Math.random() * lengthOfdata) ;
        randomNumbers.push(newNumber);
    };
    // console.log("samsung table section randomNumbers:" , randomNumbers)

    var DataForPlotTweets_right_filter = []; 

    //extract data according to 50 random index number
    for(i=0; i<randomNumbers.length; i++) {

        // console.log("samsung index and data for table:", randomNumbers[i], data[randomNumbers[i]])
        DataForPlotTweets_right_filter.push(data[randomNumbers[i]]);
    }

    // console.log("samsung sampled apple table Date and tweet_text", DataForPlotTweets_right_filter);
    var DataForPlotTweets_right = DataForPlotTweets_right_filter.map(function(d) {
        return { Date: d.Date, tweet_text: d.tweet_text }
    })
    // console.log("samsung  table Date and tweet_text", DataForPlotTweets_right);


    var columns = ["Date", "tweet_text"];
    tabulate_right(DataForPlotTweets_right,columns);

})

