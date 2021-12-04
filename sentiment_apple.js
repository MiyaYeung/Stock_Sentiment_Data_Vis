// Set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 50, left: 50};
var width = columnWidth - margin.left - margin.right,
    height = sectionHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
//initialise canvas
var graph_sentiment_left = d3.select("#svg-sentiment-left")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.style("position", "relative")
.style("top", adj);

//Append the g#graph_stock_left to svg#graph_stock_left object
var plot_sentiment_left = graph_sentiment_left.append("g")
.attr("class", "plot-sentiment")   
.attr("id", "plot-sentiment-left")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Append chart title
graph_sentiment_left.append("text")
.attr("id","title-graph-sentiment-left")
.attr("transform", "translate(100,0)")
.attr("x", 100)
.attr("y", 30)
.attr("font-size", "14px")
.attr("stroke", "black")
.text("Apple sentiment performance"); 

//--------------- read data, draw barchart
// read data for sentiment bar chart
d3.dsv(",", "sentiment/sentiment_apple_per_month.csv", function(d) {

    // console.log(d);

    return {

        year_month: d['year_month'],
        neg: Number(d['neg']),
        neg_pctg: Number(d['neg_pctg']),
        neu: Number(d['neu']),
        neu_pctg: Number(d['neu_pctg']),
        pos: Number(d['pos']),
        pos_pctg: Number(d['pos_pctg']),
        sum: Number(d['sum']),

    }
}).then(function(data) {

    // console.log("apple data for sentiment", data)

    //extract the percentage data
    var DataForPlotSentimentPctg_left = data.map(function(d) {
        return { year_month: d.year_month, negative: d.neg_pctg, neutral: d.neu_pctg, positive: d.pos_pctg }
    })
    // console.log("apple  DataForPlotSentimentPctg_left ", DataForPlotSentimentPctg_left)

    // List of subgroups = header of the csv files, i.e., neg/pos/neu here
    // console.log("apple DataForPlotSentimentPctg_left keys", Object.keys(DataForPlotSentimentPctg_left[0]))
    var subgroups = Object.keys(DataForPlotSentimentPctg_left[0]).slice(1)  //data.columns for csv, not for js object. Use Object.keys instead
    // console.log("apple neg/pos/neu", subgroups)

    // List of groups = sentiments here = value of the first column called year_month -> show them on the X axis
    var groups = d3.map(DataForPlotSentimentPctg_left, function(d){return(d.year_month)}).keys()
    // console.log("apple year_month", groups)

    // Add X axis
    var x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.2])

    var xAxis = plot_sentiment_left.append("g")
    .attr("id","x-axis-sentiment-left")
    .attr("class","axis") //assign axis class
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))

    //rotate the axis labels
    xAxis.selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.6em")
    .attr("dy", ".13em")
    .attr("transform", "rotate(-65)");

    //add x axis title
    xAxis.append("text")
    .attr("class", "axis-title")
    .attr("id", "x-axis-title")
    .attr("y", 30) //height + 50)
    .attr("x", -10)
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("Month");

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0 ]);

    var yAxis = plot_sentiment_left.append("g")
    .attr("id","y-axis-sentiment-left")
    .attr("class","axis") //assign axis class
    .call(d3.axisLeft(y));

    //add x axis title
    yAxis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -30)
    .attr("x", -100)
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("percentage");

    // color palette = one color per subgroup
    //colorScale
    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(colorbrewer.Set2[3])

    // color legend
    var colorLegend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .scale(color)
    .shapePadding(0.5)
    .shapeWidth(6)
    .shapeHeight(6)
    .labelOffset(0.5);

    graph_sentiment_left.append("g")
    .attr("class", "legend")
    .attr("id", "legend-sentiment-left")
    .attr("transform", "translate("+ width + ", 10)")
    .style("font-size", "12px")
    .call(colorLegend);

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
    .keys(subgroups)
    (DataForPlotSentimentPctg_left)
    // console.log("stackedData: ", stackedData)

    // Show the bars
    var plot_sentiment_left_enter = plot_sentiment_left.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter()
    
    plot_sentiment_left_enter.append("g")
    .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return x(d.data.year_month); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("width",x.bandwidth())

})