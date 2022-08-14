function showTooltip(text, x, y){
  let tooltip = d3.select("#tooltip");
  tooltip.html(text);
  tooltip.style("left", x + "px");
  tooltip.style("top", y + "px");
  tooltip.transition().duration(500).style("opacity", 1);
}
function hideTooltip(){
  let tooltip = d3.select("#tooltip");
  tooltip.transition().duration(500).style("opacity", 0);
}