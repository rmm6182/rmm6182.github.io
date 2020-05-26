var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(censusData,chosenYAxis){
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
    d3.max(censusData, d => d[chosenYAxis]) * 1.2
  ])
  .range([0, height]);
  
  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;

}

function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis) {

  var label;

  if (chosenXAxis === "age") {
    label = "Age (Median):";
  }
  else if (chosenXAxis === "income") {
    label = "Household Income:";
  }
  else if (chosenXAxis === "poverty"){
    label = "Poverty (%)";
  }
  
  else if (chosenYAxis === "obesity"){
    label = "Obese (%)";
  }
  else if (chosenYAxis ==="smokes"){
    label = "Smokes (%)";
  }
  else if (chosenYAxis ==="healthcare"){
    label = "Lacks Healthcare (%)";
  }



  // var toolTip = d3.tip()
  //   .attr("class", "tooltip")
  //   .offset([80, -60])
  //   .html(function(d) {
  //     return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
  //   });

  // circlesGroup.call(toolTip);

  // circlesGroup.on("mouseover", function(data) {
  //   toolTip.show(data);
  // })
  //   // onmouseout event
  //   .on("mouseout", function(data, index) {
  //     toolTip.hide(data);
  //   });

  // return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
(async function(){
  var censusData = await d3.csv("data.csv").catch(err => console.log(err))

  // parse data
  censusData.forEach(function(d) {
    d.poverty = +d.poverty;
    d.abbr = d.abbr;
    d.age =  +d.age;
    d.income = +d.income;
    d.healthcare = +d.healthcare;
    d.obesity = +d.obesity;
    d.smokes = +d.smokes;
    d.state = d.state;
    //console.log(censusData);
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(censusData,chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    //.attr("transform", `translate(0, ${height})`)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  // Create group for  x-axis labels
  var labelsGroupX = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 40})`);

  var incomeLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  var povertyLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  // Create group for  y-axis labels
  var labelsGroupY = chartGroup.append("g")
    .attr("transform", `translate(${-40}, ${height / 2})`);
  
  var smokesLabel = labelsGroupY.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -20)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");
    
  var obesityLabel = labelsGroupY.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", 0)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obesity (%)");
  
    var healthcareLabel = labelsGroupY.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", 0)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

  // // append y axis
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .text("Number of Billboard 500 Hits");

  // updateToolTip function above csv import
 // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroupX.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        // updates circles with new x values
        circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
      }
      else if (chosenXAxis === "poverty") {
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
    }
  }});
    // y axis labels event listener
    labelsGroupY.selectAll("text")
      .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      console.log(chosenYAxis)

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(censusData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      //circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "healthcare") {
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "smokes") {
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });

})()





// // Cast the hours value to a number for each piece of censusData
// censusData.forEach(function(d) {
//   d.poverty = +d.poverty;
//   d.abbr = d.abbr;
//   d.age =  +d.age;
//   d.income = +d.income;
//   d.healthcare = +d.healthcare;
//   d.obesity = +d.obesity;
//   d.smokes = +d.smokes;
//   d.state = d.state;
// });


// //Create scale functions
// var xLinearScale = d3.scaleLinear()
//   .domain(d3.extent(censusData, d => d.poverty))
//   .range([0, chartWidth]);

// var yLinearScale = d3.scaleLinear()
//   .domain([0, d3.max(censusData, d => d.healthcare)])
//   .range([chartHeight, 0]);

// // Create axis functions
// var bottomAxis = d3.axisBottom(xLinearScale);
// var leftAxis = d3.axisLeft(yLinearScale);

// // Append axes to the chart
// chartGroup.append("g")
//   .attr("transform", `translate(0, ${chartHeight})`)
//   .call(bottomAxis);

// chartGroup.append("g")
//   .call(leftAxis);

// // Create circles
// var circlesGroup = chartGroup.selectAll("Circle")
//   .data(censusData)
//   .enter()
//   .append("circle")
//   .attr("cx", d => xLinearScale(d.poverty))
//   .attr("cy", d => yLinearScale(d.healthcare))
//   .attr("r", "15")
//   .attr("fill", "blue")
//   .attr("opacity", "0.5");

// var circleLabels = chartGroup.selectAll(null).data(censusData).enter().append("text");

// circleLabels
//   .attr("x", function(d) {
//     return xLinearScale(d.poverty);
//   })
//   .attr("y", function(d) {
//     return yLinearScale(d.healthcare);
//   })
//   .text(function(d) {
//     return d.abbr;
//   })
//   .attr("font-family", "sans-serif")
//   .attr("font-size", "10px")
//   .attr("text-anchor", "middle")
//   .attr("fill", "white");

// // Create axes labels
// chartGroup.append("text")
//   .attr("transform", "rotate(-90)")
//   .attr("y", 0 - chartMargin.left - 10)
//   .attr("x", 0 - (chartHeight / 2))
//   .attr("dy", "1em")
//   .attr("class", "axisText")
//   .text("Lacks Healthcare (%)");

// chartGroup.append("text")
//   .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top})`)
//   .attr("class", "axisText")
//   .text("In Poverty (%)");

// })()
