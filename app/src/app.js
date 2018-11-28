import * as d3 from "d3";

// Set the size of the chart
const width = 1000;
const height = 600;
const padding = 60;

// Time parsing
const timeParse = d3.timeParse("%Y %m");
const timeFormat = d3.timeFormat("%B");

// color scaling
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Creating tooltip
const tooltip = d3
  .select("#root")
  .append("div")
  .attr("class", "tooltip")

// Creating svg
const svg = d3
  .select("#root")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Active mode for buttons
d3.select("#amount")
  .attr("class", "active")
  .classed("active", true)

d3.select("#price")
  .attr("class", "active")
  .classed("active", false)

// Loading external data
d3.csv("data/data.csv")
  .row(function(data) {

    // Mapping the months into numbers
    const map = {
      januari: "01",
      februari: "02",
      maart: "03",
      april: "04",
      mei: "05",
      juni: "06",
      juli: "07",
      augustus: "08",
      september: "09",
      oktober: "10",
      november: "11",
      december: "12"
    };

    const periods = data.perioden;
    const monthSelection = periods.substring(5, periods.length);
    const newMonthValue = map[monthSelection];
    const newperiods = data.perioden.replace(monthSelection, newMonthValue);

    return {
      perioden: timeParse(newperiods),
      regio: data.regio,
      aantal: Number(data.aantal),
      vraagprijs: Number(data.vraagprijs)
    };
  })
  .get(renderChart);

// Create a function to render the whole chart
function renderChart(err, dataset) {
  if (!err) {
    const amsterdam = dataset.filter(d => {
      return d.regio === "Amsterdam";
    });

    const denhaag = dataset.filter(d => {
      return d.regio === "'s-Gravenhage (gemeente)";
    });

    const rotterdam = dataset.filter(d => {
      return d.regio === "Rotterdam";
    });

    const utrecht = dataset.filter(d => {
      return d.regio === "Utrecht (gemeente)";
    });

    // Create the lagend
    const legendValues = d3.map(dataset, (d) => {
      return d.regio
    }).keys()

    // Append the legend labels
    d3.select("ul#legend")
      .selectAll("li")
      .data(legendValues)
      .enter()
      .append("li")
      .attr("style", (d, i) => {
        return "background:" + color(i) + ";"
      })
      .text((d) => {
        return d
      })

    // Seting up scales
    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(dataset, d => {
          return d.perioden;
        }),
        d3.max(dataset, d => {
          return d.perioden;
        })
      ])
      .range([50, width - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataset, d => {
          return d.aantal;
        })
      ])
      .range([height - padding, padding]);

    // Create Axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(12)
      .tickFormat(timeFormat);

    const yAxis = d3.axisLeft(yScale).ticks(12);

    // Create axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + 50 + ",0)")
      .call(yAxis);
    
    // Create title
    svg
      .append("text")
      .attr("class", "heading-text")
      .attr("y", "40px")
      .attr("x", width / 2)
      .attr("text-anchor", "middle")
      .attr("style", "font-family: 'Noto Sans TC', sans-serif;")
      .text("Aantal te koop staande woningen (2016)")

    // Create Line
    const line = d3
      .line()
      .x(d => {
        return xScale(d.perioden);
      })
      .y(d => {
        return yScale(d.aantal);
      });

    function createLine(data, className, color) {
      svg
        .append("path")
        .datum(data)
        .attr("class", className)
        .attr("stroke", color)
        .attr("stroke-width", 5)
        .attr("fill", "none")
        .attr("d", line);
    }

    function createDots(data, className, color) {
      svg
        .append("g")
        .attr("class", className)
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", "5px")
        .attr("cx", d => {
          return xScale(d.perioden);
        })
        .attr("cy", d => {
          return yScale(d.aantal);
        })
        .attr("fill", color)
        .attr("stroke-width", 1)
        .attr("stroke", "white")
        .on("mouseover", (d) => {
          tooltip.text("Aantal: " + d.aantal).style("display", "block")
          .style("left", d3.event.pageX - 270 + "px")
          .style("top", d3.event.pageY - 200 + "px")
        })
        .on("mouseout", (d) => {
          tooltip.text(" ").style("display", "none")
        });
    }

    // Visualization for data: amsterdam
    createLine(amsterdam, "amsterdam-line", color(0));
    createDots(amsterdam, "amsterdam-dots", color(0));

    // Visualization for data: rotterdam
    createLine(rotterdam, "rotterdam-line", color(1));
    createDots(rotterdam, "rotterdam-dots", color(1));

    // Visualization for data: denhaag
    createLine(denhaag, "denhaag-line", color(2));
    createDots(denhaag, "denhaag-dots", color(2));

    // Visualization for data: utrecht
    createLine(utrecht, "utrecht-line", color(3));
    createDots(utrecht, "utrecht-dots", color(3));

    d3.select("#price").on("click", changeToPrice);

    function changeToPrice() {
      // Active mode for buttons
      d3.select("#amount")
        .attr("class", "active")
        .classed("active", false)

      d3.select("#price")
        .attr("class", "active")
        .classed("active", true)

      // Change scales
      const yScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(dataset, d => {
            return d.vraagprijs;
          })
        ])
        .range([height - padding, padding]);

      const yAxis = d3.axisLeft(yScale).ticks(12);

      // Update axis
      svg
        .select(".y-axis")
        .attr("transform", "translate(" + 50 + ",0)")
        .call(yAxis);
      
      // Update title
      d3
        .select("text.heading-text")
        .text("Gemiddelde verkoopprijs (2016)")
      
      // Initiate new line
      const linePrice = d3
        .line()
        .x(d => {
          return xScale(d.perioden);
        })
        .y(d => {
          return yScale(d.vraagprijs);
        });

      function updateLine(data, selector) {
        svg
          .select(selector)
          .datum(data)
          .transition()
          .duration(900)
          .attr("d", linePrice);
      }

      function updateDots(data, selector) {
        svg
          .select(selector)
          .selectAll("circle")
          .data(data)
          .transition()
          .duration(900)
          .attr("cy", d => {
            return yScale(d.vraagprijs);
          });
      }

      d3.selectAll("circle")
        .on("mouseover", (d) => {
          tooltip.text("Vraagprijs: €" + d.vraagprijs).style("display", "block")
            .style("left", d3.event.pageX - 285 + "px")
            .style("top", d3.event.pageY - 200 + "px")
        })

      // Update data amsterdam
      updateLine(amsterdam, "path.amsterdam-line");
      updateDots(amsterdam, "g.amsterdam-dots");

      // Update data rotterdam
      updateLine(rotterdam, "path.rotterdam-line");
      updateDots(rotterdam, "g.rotterdam-dots");

      // Update data denhaag
      updateLine(denhaag, "path.denhaag-line");
      updateDots(denhaag, "g.denhaag-dots");

      // Update data utrecht
      updateLine(utrecht, "path.utrecht-line");
      updateDots(utrecht, "g.utrecht-dots");
    }

    d3.select("#amount").on("click", changetoAmount);

    function changetoAmount() {
      // Active mode for buttons
      d3.select("#amount")
        .attr("class", "active")
        .classed("active", true)

      d3.select("#price")
        .attr("class", "active")
        .classed("active", false)

      // Change scales
      const yScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(dataset, d => {
            return d.aantal;
          })
        ])
        .range([height - padding, padding]);

      const yAxis = d3.axisLeft(yScale).ticks(12);

      // Update axis
      svg
        .select(".y-axis")
        .attr("transform", "translate(" + 50 + ",0)")
        .call(yAxis);
      
      // Update title
      d3
        .select("text.heading-text")
        .text("Aantal te koop staande woningen (2016)")

      const linePrice = d3
        .line()
        .x(d => {
          return xScale(d.perioden);
        })
        .y(d => {
          return yScale(d.aantal);
        });

      function updateLine(data, selector) {
        svg
          .select(selector)
          .datum(data)
          .transition()
          .duration(900)
          .attr("d", linePrice);
      }

      function updateDots(data, selector) {
        svg
          .select(selector)
          .selectAll("circle")
          .data(data)
          .transition()
          .duration(900)
          .attr("cy", d => {
            return yScale(d.aantal);
          });
      }

      d3.selectAll("circle")
        .on("mouseover", d => {
          tooltip.text("Aantal: " + d.aantal).style("display", "block")
          .style("left", d3.event.pageX - 270 + "px")
          .style("top", d3.event.pageY - 200 + "px")
        })

      // Update data amsterdam
      updateLine(amsterdam, "path.amsterdam-line");
      updateDots(amsterdam, "g.amsterdam-dots");

      // Update data rotterdam
      updateLine(rotterdam, "path.rotterdam-line");
      updateDots(rotterdam, "g.rotterdam-dots");

      // Update data denhaag
      updateLine(denhaag, "path.denhaag-line");
      updateDots(denhaag, "g.denhaag-dots");

      // Update data utrecht
      updateLine(utrecht, "path.utrecht-line");
      updateDots(utrecht, "g.utrecht-dots");
    }
  } else {
    console.log(err);
  }
}
