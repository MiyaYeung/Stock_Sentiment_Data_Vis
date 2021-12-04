//formate time
// const TableformatTime = d3.timeFormat('%e %b %Y');

var tabulate_left = function (data,columns) {

    var table_left = d3.select('table#table-tweet-left')
    .style("position", "relative")
    .style("width", columnWidth + "px")
    .style("height", sectionHeight + "px")
    .style("top", adj + 30+ "px")
    .style("border-collapse", "collapse")
    .style("border", "2px black solid")
    .style("display", "block")
    .style("overflow", "scroll");

    var thead_left = table_left.append('thead')
    .style("width", columnWidth + "px");

    var tbody_left = table_left.append('tbody')
    .style("width", columnWidth + "px")
    .style("height", sectionHeight + "px");
       
    //header
    tableHeader = ["Date", "APPLE random sampled tweet text"]
    thead_left.append('tr')
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
  
    var rows_left = tbody_left.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')
  
    var cells_left = rows_left.selectAll('td')
    .data(function(row) {
        return columns.map(function (column) {
            return { column: column, value: row[column] }
            })
        })
    .enter()

    var cells_td_left = cells_left.append('td')
    cells_td_left.style("border", "1px black solid")
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

    return table_left;
    }       

// read data for stock line chart
d3.dsv(",", "tweets/tweets_apple.csv", function(d) {

    // console.log(d);

    return {
        Date: new Date(d['timestamp']),
        id: Number(d[""]),
        Segmented: d['Segmented#'],
        hashtag: d['hashtag'],
        tweet_text: d['tweet_text'],
    }
}).then(function(data){

    // console.log("apple TABLE data for extraction", data);

    var lengthOfdata = data.length;
    // console.log("apple table length of data: ", lengthOfdata)

    //generate 50 random index number for extracting part of data from the dataset 
    //and use these extracted data for table building
    var randomNumbers = []
    for (i=0; i<50; i++) {
        var newNumber =  Math.round(Math.random() * lengthOfdata) ;
        randomNumbers.push(newNumber);
    };
    // console.log("apple table section randomNumbers:" , randomNumbers)

    var DataForPlotTweets_left_filter = []; 

    //extract data according to 50 random index number
    for(i=0; i<randomNumbers.length; i++) {

        // console.log("apple index and data for table:", randomNumbers[i], data[randomNumbers[i]])
        DataForPlotTweets_left_filter.push(data[randomNumbers[i]]);
    }

    // console.log("apple sampled apple table Date and tweet_text", DataForPlotTweets_left_filter);
    var DataForPlotTweets_left = DataForPlotTweets_left_filter.map(function(d) {
        return { Date: d.Date, tweet_text: d.tweet_text }
    })
    // console.log("apple table Date and tweet_text", DataForPlotTweets_left);

    

    var columns = ["Date", "tweet_text"];
    tabulate_left(DataForPlotTweets_left,columns);

})

