/**
 * Function to create stacked bar chart here
 * @param {*} data 
 */
function createStackedBarChart(data) {
  //#region "Same as stacked bar chart"
  let width = 300, height = 150;
  let margins = { left: 50, top: 20, right: 70, bottom: 50 };
  let paddings = { left: 10, bottom: 10 };
  let svg = d3.select("body").append('svg')
    .attr("width", margins.left + width + margins.right)
    .attr("height", margins.top + height + margins.bottom);

  let container = svg.append("g")
    .attr('transform', `translate(${margins.left + paddings.left}, ${margins.top})`);
  // negative, neutral, or positive comments
  let sentiments = ["0", "1", "2"];
  let sentimentNames = {
    "0": "negative",
    "1": "neutral",
    "2": "positive"
  };
  // the scales
  let colorScale = d3.scaleOrdinal()
    .domain(sentiments)
    .range(["red", "gray", "green"]);

  let xScale = d3.scaleLinear()
    .domain(d3.extent(data.map(d => d.date)))
    .range([0, width]);
  let maxY = d3.max(data.map(d => [d["0"] + d["1"] + d["2"]]));
  let yScale = d3.scaleLinear()
    .domain([0, maxY])
    .range([height, 0]);

  // this helper helps generate stacked data
  let stackGenerator = d3.stack().keys([0, 1, 2]);
  // generate data for stacked chart
  let stackedSeries = stackGenerator(data);
  // Create the areas
  let sel = container
    .selectAll('g.series')
    .data(stackedSeries, d => d.key)
    .join('g')
    .classed('series', true)
    .style('fill', (d) => colorScale(d.key));

  let bandWidth = width / (data.length - 1);
  sel.selectAll('rect')
    .data(d => d, item => item.data.date)
    .join('rect')
    .attr("id", d => d.data.date)
    .transition().duration(500)
    .attr('width', bandWidth - 2)
    .attr('y', (d) => yScale(d[1]))
    .attr('x', (d) => xScale(d.data.date))
    .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
    .attr('stroke', 'black')
    .attr('stroke-width', 0.3);

  // Add the x-axis
  let xAxis = d3.axisBottom(xScale)
    .ticks(data.length)
    .tickFormat(d => "" + d); // display years as text (not numbers)
  let xAxisG = svg.append("g")
    .attr("transform", `translate(${margins.left + paddings.left + bandWidth / 2},
     ${margins.top + height + paddings.bottom})`);
  xAxisG.call(xAxis);

  // Add the y-axis
  let yAxis = d3.axisLeft(yScale);
  let yAxisG = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);
  yAxisG.call(yAxis);
  // Add x label
  let xLabel = svg.append("g")
    .attr("transform", `translate(${margins.left + paddings.left + width / 2}, 
    ${margins.top + height + 30 + paddings.bottom})`)
    .append("text").text("Years")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle");
  // Add y label
  let yLabel = svg.append("g")
    .attr("transform", `translate(${10}, ${margins.top + height / 2})`)
    .append('text').text("Sentiments")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("transform", "rotate(-90)");

  // Add the title
  let title = svg.append("g")
    .attr('transform', `translate(${margins.left + width / 2}, ${0})`)
    .append('text').text("Sentiments of LV #MakeAPromise Campaign on Instagrams")
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'hanging');
  // Add the legend
  let legends = svg.append("g")
    .attr('transform', `translate(${margins.left + paddings.left + width - 50}, 
    ${margins.top + 20})`)
    .selectAll(".label").data(sentiments);
  legends.join("line")
    .attr("x1", 0)
    .attr("y1", (d, i) => -5 + i * 15)
    .attr("x2", 10)
    .attr("y2", (d, i) => -5 + i * 15)
    .attr("stroke", d => colorScale(d))
    .attr("stroke-width", 3);
  legends.join("text").text(d => sentimentNames[d])
    .attr("x", 15)
    .attr("y", (d, i) => i * 15);
  //#endregion
  // codes for mouse event
  sel.selectAll("rect")
    .on("mouseover", function(mouseEvent){
      let x = mouseEvent.clientX;
      let y = mouseEvent.clientY;
      let d = this.__data__;
      let count = d[1] - d[0]; //number of comments for this
      let sentimentName = sentimentNames[this.parentElement.__data__.key];
      showTooltip(`${count} ${sentimentName} sentiments`, x+15, y+15);
    })
    .on("mouseout", ()=>{
      hideTooltip();
    });
}
