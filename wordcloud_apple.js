// Set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 50, left: 50};
var width = columnWidth - margin.left - margin.right,
    height = sectionHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
//initialise canvas
var graph_wordcloud_left = d3.select("#svg-wordcloud-left")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.style("position", "relative")
.style("top", adj);

var plot_wordcloud_left = graph_wordcloud_left.append("g")
.attr("class", "plot-wordcloud")   
.attr("id", "plot-wordcloud-left")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Append chart title
graph_wordcloud_left.append("text")
.attr("id","title-graph-wordcloud-left")
.attr("transform", "translate(100,0)")
.attr("x", 100)
.attr("y", 30)
.attr("font-size", "14px")
.attr("stroke", "black")
.text("Apple Wordcloud"); 

//--------------- read data, draw wordcloud
// read data for wordcloud
d3.dsv(",", "wordcloud/wordcloud_apple.csv", function(d) {

    // console.log(d);

    return {
        text: d['text'],  
        frequency: Number(d['frequency']),

    }
}).then(function(data){

    //sort the text frequency in descending order, pick the top 50 text with high frequency
    var sortedText = data.slice().sort((a, b) => d3.descending(a.frequency, b.frequency))
    // console.log("apple sorted Text: ", sortedText)
    
    //keep the first 50 rows
    var top50sortedText = sortedText.filter(function (d, i) { return i<50 })
    // console.log("top 50 apple sorted Text: ", top50sortedText)

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
    .size([width, height])
    .words(top50sortedText.map(function(d) { return {text: d.text, frequency:d.frequency}; }))
    .padding(5)        //space between words
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.frequency; })      // font size of words
    .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        var plot_wordcloud_left_enter = plot_wordcloud_left.append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter()
        
        var plot_wordcloud_left_enter_text = plot_wordcloud_left_enter.append("text")
        .style("font-size", function(d) { return d.frequency; })
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; })
        .on('mouseover', drawTooltip)
        .on('mouseout', removeTooltip);
    }

    //build function for mouseover event
    function drawTooltip(d) {

        d3.selectAll('.tooltip').remove();

        // console.log("apple data when mouseover", d)

        //create tooltip
        var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip-right")
        .style("position","absolute")  //VIP otherwise the tooltip will fly out
        .style("opacity", 0);

        tooltip.transition()
        .duration(200)
        .style("opacity", .9)

        tooltip.html(d.text)     
        .style("left", (d3.event.pageX +20) + "px")             
        .style("top", (d3.event.pageY - 20) + "px");
        
    };

    function removeTooltip() {

        //remove element by class
        d3.selectAll('.tooltip').remove();

        //remove element by id
        // d3.select("div#tooltip").remove();
    };


})


