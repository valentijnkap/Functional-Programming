import * as d3 from "d3";

// Set the size of the chart
const width = 1000;
const height = 600;
const padding = 80;

// Time parsing
const timeParse = d3.timeParse("%Y %m");
const timeFormat = d3.timeFormat("%B");

// color scaling
const color = d3.scaleOrdinal(d3.schemeCategory10);

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

// Creating svg
const svg = d3
  .select("#root")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Loading external data
d3.csv("data/data.csv")
  .row(function(data) {
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
      .range([padding, width - padding]);

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
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

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
        .attr("r", "5px")
        .attr("cx", d => {
          return xScale(d.perioden);
        })
        .attr("cy", d => {
          return yScale(d.aantal);
        })
        .attr("fill", color)
        .attr("stroke-width", 1)
        .attr("stroke", "white");
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

    d3.select(".price").on("click", changeToPrice);

    function changeToPrice() {
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
        .transition()
        .duration(900)
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

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

    d3.select(".amount").on("click", changetoAmount);

    function changetoAmount() {
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
        .transition()
        .duration(900)
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

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
