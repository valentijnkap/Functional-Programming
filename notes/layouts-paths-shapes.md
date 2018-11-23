# Diffrent layouts, paths and shapes notes

## Lines

When you make charts with for example lines. It will always involve with the SVG element `<path d="..."/>`. D3 will generate a path after you stated a function that creates the shape. For example with a Line chart, you first set the `x` and `y` points and after that, you generate the line and becomes a path.

This is a basic example of creating lines:

```javascript
// Create Line
var line = d3.line()
  .x(function(d) {
      return x_scale(d.date);
  })
  .y(function(d) {
      return y_scale(d.num);
  });

svg.append('path')
  // The datum function is needed because we use one element with all the data
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke', '#73FF36')
  .attr('stroke-width', 5)
  .attr('d', line);
```

## Breaking the path

In some scenario's you don't want to show a certain data point. D3 can help you with that with a function called `.defined()`.

```javascript
// Create Line
var line = d3.line()
  // This will check if the comparison is true, otherwise, it will move to the next iteration.
  .defined(function(d) {
    return d.num >= 0;
  })
  .x(function(d) {
    return x_scale(d.date);
  })
  .y(function(d) {
    return y_scale(d.num);
  });
```

## Area's

There are some additions that you can use in combination with line charts. To make the data more visual and understandable, you can use the function `.area()`. It will create a fill between two lines. So you have the bottom line at the bottom axis (is not visible) and your line of data. This will give the user more information about the data. This is how it works:

```javascript
var area = d3.area()
  .defined(function(d) {
    return d.num >= 0;
  })
  .x(function(d) {
    return x_scale(d.date);
  })
  .y0(function(d) {
    return y_scale.range()[0];
  })
  .y1(function(d) {
    return y_scale(d.num);
  });

svg.append('path')
  .datum(data)
  .attr('fill', '#73FF36')
  .attr('d', area);
```

## Creating pie charts

There are some additions that you can use in combination with line charts. To make the data more visual and understandable, you can use the function `.area()`. It will create a fill between two lines. So you have the bottom line at the bottom axis (is not visible) and the top line which represents the data. This will give the user more information about the data. This is how it works:

```javascript
// Create the pie layout.
var pie = d3.pie();

// Define a set of colors that can be used later on for the chart.
// SchemeCategory is a set of colors that can be used like this.
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Define the arc elements and prepare them for the chart.
// By defining the inner and outer radius you create the size of the Pie.
// Increasing the value of the inner radius will result in a donut chart.
var arc = d3.arc()
  .innerRadius(inner_radius)
  .outerRadius(outer_radius);

// Group the arc elements and give them a class. Also, place the elements with transform styling.
var arcs = svg.selectAll('g.arc')
  // Use the Pie() function to prepare the data for the chart.
  .data(pie(data))
  .enter()
  .append('g')
  .attr('class', 'arc')
  .attr(
    'transform',
    'translate(' + outer_radius + ',' + chart_height / 2 + ')'
  );

// Append the path's to the groups and create the actual arcs.
arcs.append('path')
  .attr('fill', function (d, i) {
    return color(i);
  })
  .attr('d', arc);
```

## Stacking charts

Besides line charts and pie charts there is another interesting chart. It's called the stack chart. It is similar to the bar chart but with extra data. To prepare the data for the stack chart you trigger a function. On below an example of how this works.

```javascript
// The data
var data = [
  { pigeons: 6, doves: 8, eagles: 15 },
  { pigeons: 9, doves: 15, eagles: 5 },
  { pigeons: 11, doves: 13, eagles: 14 },
  { pigeons: 15, doves: 4, eagles: 20 },
  { pigeons: 22, doves: 25, eagles: 23 }
];

// Make categories of the data and plot them as keys
var stack = d3.stack().keys([
  'pigeons', 'doves', 'eagles'
]);

// Bind the data to those keys as a stack.
var stack_data = stack(data);

// Make a group of the stacked data.
var groups        =   svg.selectAll('g')
  .data(stack_data)
  .enter()
  .append('g')
  .style('fill', function(d, i) {
    return color(i);
  });

// Append the rectangles to the group and loop through the data
groups.selectAll('rect')
  .data(function(d){
    return d;
  })
  .enter()
  .append('rect')
  .attr('x', function(d, i) {
    return x_scale(i);
  })
  .attr('y', function(d) {
    return y_scale(d[1]);
  })
  .attr('height', function(d) {
    return y_scale(d[0]) - y_scale(d[1]);
  })
  .attr('width', x_scale.bandwidth());
```

## Force layouts

Another beautiful thing is forced charts. It is often used for technical data and looks like bubbles linked to each other. D3 provides a simple set of functions to help you generate that. Here's how it works.

```javascript
// The data is always divided into two objects. Often in Nodes where the real data is
// and links where you store the links in the data.
var data            =   {
  nodes:              [
    { name: "Jack" }, { name: "Bob" },
    { name: "Bill" }, { name: "Jan" },
    { name: "Edward" }, { name: "Sara" },
    { name: "Nikki" }, { name: "Ronald" },
    { name: "Jerry" }, { name: "Zac" }
  ],
  links:              [
    { source: 0, target: 1 }, { source: 0, target: 2 },
    { source: 0, target: 3 }, { source: 0, target: 4 },
    { source: 1, target: 5 }, { source: 2, target: 5 },
    { source: 2, target: 5 }, { source: 3, target: 4 },
    { source: 5, target: 8 }, { source: 5, target: 9 },
    { source: 6, target: 7 }, { source: 7, target: 8 },
    { source: 8, target: 9 }
  ]
};

// Defining the Force Layout
// First, declare the forceSimulation() function and pas in the data(is required)..
var force = d3.forceSimulation(data.nodes)
  // Tell D3 how to animate this. There are different ways but for now, we use this.
  .force('charge', d3.forceManyBody().strength(-200))
  // Combine the link data with the node data.
  .force('link', d3.forceLink(data.links))
  // Tell the forceSimulation() to simulate from the center. Coordinates are needed in order to work.
  .force('center', 
    d3.forceCenter()
      .x(chart_width / 2)
      .y(chart_height / 2)
  );

// Start the force with tick and tell D3 to keep track of all the coordinates.
force.on('tick', function() {
  lines.attr('x1', function(d) { return d.source.x; })
    .attr('y1', function(d) { return d.source.y; })
    .attr('x2', function(d) { return d.target.x; })
    .attr('y2', function(d) { return d.target.y; });
  
  nodes.attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; });
```