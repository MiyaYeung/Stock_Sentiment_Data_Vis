//*************** initialise parameters ******************//

// Set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 50, left: 50};
var width = columnWidth - margin.left - margin.right,
    height = sectionHeight - margin.top - margin.bottom;


//*************** line chart of stock (right) ******************//

//--------------- initialise line chart

//initialise canvas
var graph_stock_right = d3.select("svg#svg-stock-right")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.style("position", "relative")
.style("top", adj);

// set x scale and y scale
var xScale = d3.scaleTime().range ([0, width]),
    yScale = d3.scaleLinear().range ([height, 0]);

//Append the g#graph_stock_left to svg#graph_stock_left object
var plot_stock_right = graph_stock_right.append("g")
.attr("class", "plot-stock")   
.attr("id", "plot-stock-right")
.attr("width", width)
.attr("height", height)
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Append chart title
graph_stock_right.append("text")
.attr("id","title-graph-stock-right")
.attr("transform", "translate(100,0)")
.attr("x", 100)
.attr("y", 30)
.attr("font-size", "14px")
.attr("stroke", "black")
.text("Samsung stock performance"); 

//--------------- read data, draw line chart
// read data for stock line chart
d3.dsv(",", "stock/stock_samsung_with_prediction.csv", function(d) {

    // console.log("samsung stock with prediction: ", d);

    return {

        Date: new Date(d['Date']),  //Be CAREFULL about the timestamp format!!! if format in csv is %d/%m/%Y, don't use Date() method!!
        actual: Number(d['actual']),
        sigma: Number(d['sigma']),
        yhat: Number(d['yhat']),

    }
}).then(function(data){

    // console.log("Samsung stock data for extraction", data);
    
    // extract date and close price data for line chart
    var DataForPlotClose = data.map(function(d){
    return { Date: d.Date, actual: d.actual, yhat: d.yhat, sigma: d.sigma };
    })
    // console.log("Samsung stock with prediction", DataForPlotClose);

    var FilterDataForPlotClose = DataForPlotClose.filter(function(d, i) { return i < DataForPlotClose.length - 7 })
    // console.log("Samsung data for ploting the actual line: ", FilterDataForPlotClose)

    //get d.actual and d.yhat
    // console.log("Object.keys(DataForPlotClose[0]) ", Object.keys(DataForPlotClose[0]))
    var subgroups = Object.keys(DataForPlotClose[0]).slice(1);
    // console.log("Samsung actual and yhat subgroups of DataForPlotClose:" , subgroups);

    // ------ draw linechart
    xScale.domain(d3.extent(DataForPlotClose, function(d) { return d.Date; }));
    yScale.domain([0, d3.max(DataForPlotClose, function(d) { return Math.max(d.actual, d.yhat)})]);
    
    // -- add x axis
    //define x axis
    var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.timeFormat("%b %y"))
    .ticks(d3.timeMonth.every(3));

    //create x axis
    var x_axis = plot_stock_right.append("g")
    .call(xAxis)
    .attr("id","x-axis-stock-right")
    .attr("class","axis") //assign axis class
    .attr("transform", "translate(0," + height + ")") //postioning the axis
    
    //add x axis label
    x_axis.append("text")
    .attr("y", 30) //height + 50)
    .attr("x", width - 250)
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("Month");

    // -- Add the Y Axis
    //Define Y axis
    var yAxis = d3.axisLeft().scale(yScale)
    .ticks(10);
                
    //Create Y axis
    var y_axis = plot_stock_right.append("g")
    .call(yAxis)
    .attr("id","y-axis-stock-right")
    .attr("class", "axis")
    .attr("transform", "translate(" + 0 + ",0)");
    
    //add y axis label
    y_axis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -100)
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("stock price (currency: KRW)");

    // color palette = one color per subgroup
    //colorScale
    var legendLabelText = ['Actual', 'Prediction', 'Conf. Interval']
    var color = d3.scaleOrdinal()
    .domain(legendLabelText)
    .range(d3.schemeSet2)

    // color legend
    var colorLegend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .scale(color)
    .shapePadding(0.5)
    .shapeWidth(6)
    .shapeHeight(6)
    .labelOffset(0.5);

    graph_stock_right.append("g")
    .attr("class", "legend")
    .attr("id", "legend-stock-right")
    .attr("transform", "translate("+ width + ", 10)")
    .style("font-size", "12px")
    .call(colorLegend);


    // prepare line
    var line0 = d3.line()
    .x(function(d) { return xScale(d.Date); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.actual); })  // set the y values for the line generator 
    .curve(d3.curveMonotoneX); 

    var line1 = d3.line()
    .x(function(d) { return xScale(d.Date); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.yhat); })  // set the y values for the line generator 
    .curve(d3.curveMonotoneX);

    // Append the path, bind the data, and call the line generator 
    //create lines element to contain line path and line label
    var lines = plot_stock_right.append("g")
                .attr("class", "lines")
                .attr("id", "lines-plot-stock-right");

    lines.append("path")
    .datum(FilterDataForPlotClose) // Binds data to the line 
    .attr("fill", "none")
    .attr("stroke", color(legendLabelText[0]))
    .attr("stroke-width", 3)
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line0) // Calls the line generator 
    .style("opacity", 1)

    lines.append("path")
    .datum(DataForPlotClose) // Binds data to the line 
    .attr("fill", "none")
    .attr("stroke", color(legendLabelText[1]))
    .attr("stroke-width", 2)
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line1) // Calls the line generator 
    .style("opacity", 0.7)

    // Show confidence interval
    const curve = d3.curveLinear;
    lines.append("path")
    .datum(DataForPlotClose)
    .attr("fill", color(legendLabelText[2]))
    .attr("stroke", "none")
    .attr("d", d3.area()
        .x(function(d) { return xScale(d.Date) })
        .y0(function(d) { return yScale(d.yhat - 1.96 * d.sigma) })
        .y1(function(d) { return yScale(d.yhat + 1.96 * d.sigma) })
        .curve(curve)
        )
    .style("opacity", 0.4);


    // add the dots with tooltips
    plot_stock_right.selectAll("dot")
    .data(DataForPlotClose)
    .enter().append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return xScale(d.Date); })
    .attr("cy", function(d) { return yScale(d.actual); })
    .style("fill", "#FA8072")
    .style("opacity", 0)
    .on('mouseover', drawTooltip)
    .on('mouseout', removeTooltip)
    
    //initialise a tooltip
    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip-right")
    .style("opacity", 0);
    
    //build function for mouseover event
    function drawTooltip(d) {

        d3.selectAll('.tooltip').remove();

        console.log(d)

        //select the circle element previously created
        d3.select(this)
        .transition(200)
        .style("opacity", .7)

        //create tooltip
        var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip-right")
        .style("position","absolute")
        .style("opacity", 0);

        tooltip.transition()
        .duration(200)
        .style("opacity", .7)
        .style("background", "#FA8072");

        tooltip.html( formatTime(d.Date) +
        "<br/>"  + 
        "Actual: " + d.actual.toFixed(2) +
        "<br/>" +
        "Predicted: " + d.yhat.toFixed(2))      
        .style("left", (d3.event.pageX +20) + "px")             
        .style("top", (d3.event.pageY - 20) + "px");
        
    };

    function removeTooltip() {
        //turn the circle to unvisible
        d3.select(this)
        .transition(200)
        .style("opacity", 0);

        //remove element by class
        d3.selectAll('.tooltip').remove();

        //remove element by id
        // d3.select("div#tooltip").remove();
    };  })