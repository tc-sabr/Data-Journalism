var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create svg wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//append svg group to hold chart
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

//import data
d3.csv('data/data.csv').then(function(stateData) {
    console.log(stateData)

    //cast data as numbers
    stateData.forEach(function(data) {
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.healthcare = +data.healthcare;
        data.healthcareHigh = +data.healthcareHigh;
        data.healthcareLow = +data.healthcareLow;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.obesity = +data.obesity;
        data.obesityHigh = +data.obesityHigh;
        data.obesityLow = +data.obesityLow;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.smokes = +data.smokes;
        data.smokesHigh = +data.smokesHigh;
        data.smokesLow = +data.smokesLow;
    })

    //create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(stateData, d => d.poverty))
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(stateData, d => d.healthcare))
        .range([height, 0]);

    //create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axis to charts
    chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);

    //create cirles on chart
    chartGroup.selectAll('circle')
        .data(stateData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.healthcare))
        .attr('r', '10')
        .attr('fill', 'blue')
        .attr('opacity', '.5')
        .classed('stateCircle', true);

    //add state abbr to circles
    chartGroup.selectAll('text')
        .data(stateData)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .classed('stateText', true)
        .attr('dx', d => xLinearScale(d.poverty))
        .attr('dy', d => yLinearScale(d.healthcare))

    //add x & y axis labels
    //x axis
    chartGroup.append('text')
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("x", 0)
        .attr("y", 20)  
        .classed("active", true)
        .text("In Poverty (%)");

    //y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

});
