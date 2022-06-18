var world = d3.json("./worldmap.json");
var Covid_Data = d3.csv("./Covid_Data.csv");
var Top_6 = d3.csv("./Top_6.csv");

// Download data
Promise.all([world, Covid_Data, Top_6]).then(function ([
  world,
  Covid_Data,
  Top_6,
]) {
  Covid_Data = Covid_Data.map((d) => {
    d.Covid_Data = JSON.parse(
      d.Covid_Data.replaceAll('"', "").replaceAll("'", '"')
    );
    return d;
  });
  Covid_Data = Covid_Data.filter((d) => {
    if (d.Contry == "World") {
      return false;
    }
    return true;
  });
  console.log(Covid_Data, Top_6);
  drawmap(world, Covid_Data);
  drawbar(Top_6);
  drawBubble(Covid_Data);
});

// draw bubble
function drawBubble(Covid_Data) {
  Covid_Data = Covid_Data.filter((d) => {
    if (
      d.Covid_Data.confired != "N/A" &&
      d.Covid_Data.deaths != "N/A" &&
      d.Covid_Data.recovered != "N/A" &&
      d.Contry != "USA"
    ) {
      return true;
    }
    return false;
  });
  var extent1 = d3.extent(Covid_Data, (d) => 1 * d.Covid_Data.confired);
  var extent2 = d3.extent(Covid_Data, (d) => 1 * d.Covid_Data.deaths);
  var extent3 = d3.extent(Covid_Data, (d) => 1 * d.Covid_Data.recovered);

  var rScale = d3.scaleLinear().domain(extent3).range([5, 20]);

  var outerHeight = 600;
  var outerWidth = 800;
  var margin = {
    top: 50,
    left: 150,
    right: 50,
    bottom: 150,
  };
  var width = outerWidth - margin.left - margin.right;
  var height = outerHeight - margin.top - margin.bottom;
  svg = d3
    .select("#bubble")
    .attr("width", outerWidth)
    .attr("height", outerHeight);
  cg = svg
    .append("g")
    .attr("class", "cg")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("g")
    .append("text")
    .style("text-anchor", "middle")
    .attr(
      "transform",
      "translate(" + margin.left + "," + (margin.top - 10) + ")"
    )
    .text("Confired");

  svg
    .append("g")
    .append("text")
    .style("text-anchor", "middle")
    .attr(
      "transform",
      "translate(" +
        (margin.left + width) +
        "," +
        (margin.top + height - 10) +
        ")"
    )
    .text("Death");

  var x = d3.scaleLinear().domain([0, extent2[1]]).range([0, width]);

  var xAxis = d3.axisBottom().scale(x);
  var cgx = cg.append("g").attr("transform", `translate(0,${height})`);
  cgx.transition().duration(1000).call(xAxis);
  cgx
    .selectAll("text")
    .attr("text-anchor", "start")
    .attr("transform", `translate(0,${5}) rotate(25)`);
  var y = d3
    .scaleLinear()
    .domain([extent1[1] * 1.1, 0])
    .range([0, height]);
  var yAxis = d3.axisLeft().scale(y).tickSizeOuter(0);
  var yaxisg = cg.append("g");
  yaxisg.transition().duration(1000).call(yAxis);
  var colors = d3.schemeCategory10;
  var circles = cg.selectAll("circle").data(Covid_Data);

  circles
    .enter()
    .append("circle")
    .merge(circles)
    .on("mouseover", (event, d) => {
      d3.select("#tip")
        .style("display", "block")
        .style("top", event.pageY + "px")
        .style("left", event.pageX + 5 + "px")
        .html(
          `${d.Contry}-confired:${d.Covid_Data.confired},deaths:${d.Covid_Data.deaths},recovered:${d.Covid_Data.recovered}`
        );
    })
    .on("mousemove", (event, d) => {
      d3.select("#tip")
        .style("display", "block")
        .style("top", event.pageY + "px")
        .style("left", event.pageX + 5 + "px")
        .html(
          `${d.Contry}-confired:${d.Covid_Data.confired},deaths:${d.Covid_Data.deaths},recovered:${d.Covid_Data.recovered}`
        );
    })
    .on("mouseout", (event, d) => {
      d3.select("#tip").style("display", "none");
    })
    .attr("cy", (d, i) => {
      return y(d.Covid_Data.confired);
    })
    .attr("r", (d, i) => {
      return rScale(d.Covid_Data.recovered);
    })
    .attr("cx", (d) => {
      return x(d.Covid_Data.deaths);
    })
    .style("fill", (d, i) => colors[i % 10]);

  circles.exit().remove();
}

//draw bar chart
function drawbar(Top_6) {
  var maxValuesExtent = d3.extent(Top_6, (d) => 1 * d.Value);
  var outerHeight = 600;
  var outerWidth = 800;
  var margin = {
    top: 50,
    left: 150,
    right: 50,
    bottom: 50,
  };
  var width = outerWidth - margin.left - margin.right;
  var height = outerHeight - margin.top - margin.bottom;
  svg = d3.select("#bar").attr("width", outerWidth).attr("height", outerHeight);

  svg
    .append("g")
    .append("text")
    .style("text-anchor", "middle")
    .attr(
      "transform",
      "translate(" + margin.left + "," + (margin.top - 10) + ")"
    )
    .text("Confired");

  svg
    .append("g")
    .append("text")
    .style("text-anchor", "middle")
    .attr(
      "transform",
      "translate(" +
        (margin.left + width) +
        "," +
        (margin.top + height - 10) +
        ")"
    )
    .text("Country");

  cg = svg
    .append("g")
    .attr("class", "cg")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3
    .scaleBand()
    .domain(Top_6.map((d) => d.Country))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  var xAxis = d3.axisBottom().scale(x);
  var cgx = cg.append("g").attr("transform", `translate(0,${height})`);
  cgx.transition().duration(1000).call(xAxis);
  cgx
    .selectAll("text")
    .attr("text-anchor", "start")
    .attr("transform", `translate(0,${5}) rotate(25)`);
  var y = d3
    .scaleLinear()
    .domain([maxValuesExtent[1] * 1.1, 0])
    .range([0, height]);
  var yAxis = d3.axisLeft().scale(y).tickSizeOuter(0);
  var yaxisg = cg.append("g");
  yaxisg.transition().duration(1000).call(yAxis);

  var colors = d3.schemeCategory10;

  var rects = cg.selectAll("rect").data(Top_6);

  rects
    .enter()
    .append("rect")
    .merge(rects)
    .on("mouseover", (event, d) => {
      d3.select("#tip")
        .style("display", "block")
        .style("top", event.pageY + "px")
        .style("left", event.pageX + 5 + "px")
        .html(d.Value);
    })
    .on("mousemove", (event, d) => {
      d3.select("#tip")
        .style("display", "block")
        .style("top", event.pageY + "px")
        .style("left", event.pageX + 5 + "px")
        .html(d.Value);
    })
    .on("mouseout", (event, d) => {
      d3.select("#tip").style("display", "none");
    })
    .attr("y", height)
    .attr("x", (d, i) => {
      return x(d.Country);
    })
    .attr("width", (d) => {
      return x.bandwidth();
    })
    .attr("height", 0)
    .transition()
    .duration(1000)
    .attr("fill", (d, i) => colors[i % 10])
    .attr("y", (d) => {
      return y(d.Value);
    })
    .attr("height", (d) => {
      return height - y(d.Value);
    });
  rects.exit().remove();
}
//draw map
function drawmap(mapdata, Covid_Data) {
  var extent = d3.extent(Covid_Data, (d) => 1 * d.Covid_Data.confired);
  Covid_Data = d3.group(Covid_Data, (d) => d.Contry);
  var outerHeight = 600;
  var outerWidth = 800;
  var margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  var width = outerWidth - margin.left - margin.right;
  var height = outerHeight - margin.top - margin.bottom;
  svg = d3.select("#map").attr("width", outerWidth).attr("height", outerHeight);
  cg = svg
    .append("g")
    .attr("class", "cg")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var projection = d3
    .geoMercator()
    .translate([width / 2, height / 2])
    .scale(120)
    .center([0, 40]);
  var path = d3.geoPath().projection(projection);
  var world = cg.append("g").attr("id", "world");

  var colorFun = d3.interpolateRgb(
    "rgba(255, 170, 0, 0.2)",
    "rgba(170, 0, 0, 1.0)"
  );
  var colorScale = d3
    .scaleLinear()
    .domain([extent[0], extent[1] * 0.5])
    .range([0, 1]);

  world
    .selectAll("path")
    .data(mapdata.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("id", (d) => d.properties.name)
    .style("stroke", "gray")
    .style("fill", function (d) {
      if (d.properties.name && Covid_Data.get(d.properties.name)) {
        var item = Covid_Data.get(d.properties.name)[0];
        console.log(item);
        return colorFun(colorScale(item.Covid_Data.confired));
      }
      return "white";
    })
    .on("mouseover", (event, d) => {
      if (d.properties.name && Covid_Data.get(d.properties.name)) {
        var item = Covid_Data.get(d.properties.name)[0];
        d3.select("#tip")
          .style("display", "block")
          .style("top", event.pageY + "px")
          .style("left", event.pageX + 5 + "px")
          .html(
            `${d.properties.name}-confired:${item.Covid_Data.confired},deaths:${item.Covid_Data.deaths},recovered:${item.Covid_Data.recovered}`
          );
      }
    })
    .on("mousemove", (event, d) => {
      if (d.properties.name && Covid_Data.get(d.properties.name)) {
        var item = Covid_Data.get(d.properties.name)[0];
        d3.select("#tip")
          .style("display", "block")
          .style("top", event.pageY + "px")
          .style("left", event.pageX + 5 + "px")
          .html(
            `${d.properties.name}-confired:${item.Covid_Data.confired},deaths:${item.Covid_Data.deaths},recovered:${item.Covid_Data.recovered}`
          );
      }
    })
    .on("mouseout", (event, d) => {
      d3.select("#tip").style("display", "none");
    });

  var defs = svg.append("defs");
  var linearG = defs
    .append("linearGradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%")
    .attr("id", "lg");
  linearG.append("stop").attr("offset", "0%").attr("stop-color", colorFun(0));

  linearG.append("stop").attr("offset", "100%").attr("stop-color", colorFun(1));

  cg.select(".legend").remove();
  var legend = cg.append("g").attr("class", "legend");

  legend
    .append("g")
    .append("rect")
    .style("fill", `url('#lg')`)
    .attr("width", 15)
    .attr("height", 100)
    .attr("transform", `translate(${30},${400})`);
  legend
    .append("g")
    .append("text")
    .style("font-size", "15px")
    .text(">" + extent[1] * 0.5)
    .attr("transform", `translate(${30},${400})`);
  legend
    .append("g")
    .append("text")
    .attr("width", 30)
    .attr("height", 100)
    .text("=" + extent[0])
    .style("font-size", "15px")
    .attr("transform", `translate(${30},${515})`);
}
