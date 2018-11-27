import * as d3 from 'd3'

// Set the size of the chart
const width = 1000
const height = 600
const padding = 80

// Time parsing
const timeParse      =   d3.timeParse("%Y %m")
const timeFormat     =   d3.timeFormat("%B")

// Mapping the months
const map = {
  'januari': '01',
  'februari': '02',
  'maart': '03',
  'april': '04',
  'mei': '05',
  'juni': '06',
  'juli': '07',
  'augustus': '08',
  'september': '09',
  'oktober': '10',
  'november': '11',
  'december': '12',
}

// Creating svg
const svg = d3.select("#root")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// Loading external data
d3.csv("data/data.csv")
  .row(function(data) {
    const periods = data.perioden
    const monthSelection = periods.substring(5, periods.length)
    const newMonthValue = map[monthSelection]
    const newperiods = data.perioden.replace(monthSelection, newMonthValue)

    return {
      perioden: timeParse(newperiods),
      regio: data.regio,
      aantal: Number(data.aantal),
      vraagprijs: Number(data.vraagprijs)
    }
  })
  .get(function(err, dataset) {
    console.log(dataset)
    if (!err) {
      const amsterdam = dataset.filter((d) => {
        return d.regio === "Amsterdam"
      })
    
      const denhaag = dataset.filter((d) => {
        return d.regio === "'s-Gravenhage (gemeente)"
      })
    
      const rotterdam = dataset.filter((d) => {
        return d.regio === "Rotterdam"
      })
    
      const utrecht = dataset.filter((d) => {
        return d.regio === "Utrecht (gemeente)"
      }) 

      // Seting up scales
      const xScale = d3.scaleTime()
      .domain([
        d3.min(dataset, function(d) {
          return d.perioden
        }),
        d3.max(dataset, function(d) {
          return d.perioden
        })
      ])
      .range([padding, width - padding])

      const yScale = d3.scaleLinear()
        .domain([
          0, d3.max(dataset, function(d) {
            return d.aantal
          })
        ])
        .range([height - padding, padding])
      
      // Create Axes
      const x_axis = d3.axisBottom(xScale)
        .ticks(12)
        .tickFormat(timeFormat)

      const y_axis = d3.axisLeft(yScale)
        .ticks(12)
      
      // Create axis
      svg.append("g")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(x_axis)

      svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(y_axis)
      
      // Create Line
      const line = d3.line()
        .x(function(d) {
          return xScale(d.perioden);
        })
        .y(function(d) {
          return yScale(d.aantal);
        })
      
      // Data for Amsterdam
      svg.append("path")
        .datum(amsterdam)
        .transition()
        .attr('stroke', '#73FF36')
        .attr('stroke-width', 5)
        .attr('fill', 'none')
        .attr('d', line);
      
      svg.append('g').selectAll('circle')
        .data(amsterdam)
        .enter()
        .append('circle')
        .attr('r', '5px')
        .attr('cx', function(d) {
          return xScale(d.perioden)
        })
        .attr('cy', function(d) {
          return yScale(d.aantal)
        })
        .attr('fill', '#73FF36')
        .attr('stroke-width', 1)
        .attr('stroke', 'white')

      // Data for Rotterdam
      svg.append("path")
        .datum(rotterdam)
        .attr('stroke', 'red')
        .attr('stroke-width', 5)
        .attr('fill', 'none')
        .attr('d', line);
      
      svg.append('g').selectAll('circle')
        .data(rotterdam)
        .enter()
        .append('circle')
        .attr('r', '5px')
        .attr('cx', function(d) {
          return xScale(d.perioden)
        })
        .attr('cy', function(d) {
          return yScale(d.aantal)
        })
        .attr('fill', 'red')
        .attr('stroke-width', 1)
        .attr('stroke', 'white')

      // Data for Den Haag
      svg.append("path")
        .datum(denhaag)
        .attr('stroke', 'blue')
        .attr('stroke-width', 5)
        .attr('fill', 'none')
        .attr('d', line);
      
      svg.append('g').selectAll('circle')
        .data(denhaag)
        .enter()
        .append('circle')
        .attr('r', '5px')
        .attr('cx', function(d) {
          return xScale(d.perioden)
        })
        .attr('cy', function(d) {
          return yScale(d.aantal)
        })
        .attr('fill', 'blue')
        .attr('stroke-width', 1)
        .attr('stroke', 'white')

      // Data for Utrecht
      svg.append("path")
        .datum(utrecht)
        .attr('stroke', 'yellow')
        .attr('stroke-width', 5)
        .attr('fill', 'none')
        .attr('d', line);
      
      svg.append('g').selectAll('circle')
        .data(utrecht)
        .enter()
        .append('circle')
        .attr('r', '5px')
        .attr('cx', function(d) {
          return xScale(d.perioden)
        })
        .attr('cy', function(d) {
          return yScale(d.aantal)
        })
        .attr('fill', 'yellow')
        .attr('stroke-width', 1)
        .attr('stroke', 'white')
      
      d3.select('button').on('click', () => {
        console.log('test')
      })
    } else {
      console.log(err)
    }
  })

