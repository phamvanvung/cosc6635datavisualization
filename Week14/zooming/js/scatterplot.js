//#region parameters for the scatter plot (same)
let width = 250, height = 250;
let margins = { left: 50, top: 20, bottom: 80, right: 60 };
let svgWidth = width + margins.left + margins.right;
let svgHeight = height + margins.top + margins.bottom;
let pointR = 2; // radius of the scatter plot
// color scale
let species = ["Setosa", "Versicolor", "Virginica"];
let colors = ["red", "green", "blue"];
// create color scale for the species
let colorScale = d3.scaleOrdinal()
  .domain(species)
  .range(colors);
//#endregion
function createScatterPlot(data) {
  //#region codes for the scatter plot (same)
  let svg = d3.select("body").append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  // The main container
  let container = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);
  // The scales
  let xScale = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d["petal.length"]))])
    .range([0, width]);
  let yScale = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d["petal.width"]))])
    .range([height, 0])

  // The points
  container.selectAll(".point").data(data).join("circle")
    .attr("cx", d => xScale(d["petal.length"]))
    .attr("cy", d => yScale(d["petal.width"]))
    .attr("r", pointR)
    .attr("fill", d => colorScale(d.species)); // update color for the species
  // Add the x-axis
  let xAxis = d3.axisBottom(xScale);
  let xAxisG = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top + height})`);
  xAxisG.call(xAxis);
  // Add the y-axis
  let yAxis = d3.axisLeft(yScale);
  let yAxisG = svg.append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);
  yAxisG.call(yAxis);
  // Add x label
  let xLabel = svg.append("g")
    .attr("transform", `translate(${margins.left + width / 2}, ${margins.top + height + 30})`)
    .append("text").text("Petal Length")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle");
  // Add y label
  let yLabel = svg.append("g")
    .attr("transform", `translate(${10}, ${margins.top + height / 2})`)
    .append('text').text("Petal Width")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("transform", "rotate(-90)");

  // Add the title
  let title = svg.append("g")
    .attr('transform', `translate(${margins.left + width / 2},
     ${0})`)
    .append('text').text("Petal Length vs. Petal Width")
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'hanging');
  // Add the legend
  let legends = svg.append("g")
    .attr('transform', `translate(${margins.left}, 
    ${margins.top + height + 40})`)
    .selectAll(".label").data(species);
  legends.join("circle")
    .attr("cx", 0)
    .attr("cy", (d, i) => -5 + i * 15)
    .attr("r", pointR)
    .attr("fill", d => colorScale(d));
  legends.join("text").text(d => d)
    .attr("x", 5)
    .attr("y", (d, i) => i * 15);
  //#endregion
  // Add zooming behaviors
  const zoom = d3.zoom()
    .scaleExtent([01, 32]).on("zoom", zoomed);
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

  function zoomed({ transform }) {
    xz = transform.rescaleX(xScale).interpolate(d3.interpolateRound);
    yz = transform.rescaleY(yScale).interpolate(d3.interpolateRound);
    // Transform the dots (semantics transform)
    container.selectAll("circle")
      .attr("cx", d => xz(d["petal.length"]))
      .attr("cy", d => yz(d["petal.width"]))
    // Change the scales
    xAxis = d3.axisBottom(xz);
    xAxisG.call(xAxis);
    yAxis = d3.axisLeft(yz)
    yAxisG.call(yAxis);
  }
}
