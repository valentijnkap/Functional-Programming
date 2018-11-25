# Working with maps

Creating maps in D3 can be very easy. There are a lot of functions that can help you build nice SVG maps.

## JSON coordinates

In order to create the map, you need some data to make the shapes of the map. Therefore you can use [geoJSON](http://geojson.org). It helps you get the coordinates.

## How to make it work in D3

This a particular way of creating the USA map. But there are many ways to make it work. So let's have a look:

```javascript
// Create a projection to tell D3 how to display the map and how to scale it.
var projection      =   d3.geoAlbersUsa()
  .scale([chart_width])
  .translate([chart_width / 2, chart_height / 2]);

// Create the map based on the data. This will be passed in later on.
var path            =   d3.geoPath(projection);

// Get the data and retrieve a promise, then..
d3.json('us.json').then(function(data){
  svg.selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    // D3 will automatically pass in the data to trigger the function and draw the map.
    .attr('d', path)
    .attr('fill', '#58CCE1')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1);
});
```

## Choropleth Maps

Maps on its own can be very boring. Therefore you use colors in most cases to visualize the way of data on the map. There is a handy tool that you can use to define the colors for your use. Use [colorbrewer2](http://colorbrewer2.org/#type=sequential&scheme=Reds&n=9) to help you with your project.

Make a variable from the value's to get a color scale.

```javascript
var color           =   d3.scaleQuantize().range([
  '255,245,240', '254,224,210', '252,187,161',
  '252,146,114', '251,106,74', '239,59,44',
  '203,24,29', '165,15,21', '103,0,13',
]);
```

The `d3.scaleQuantize()` function will set a scale for a data source with a lot of values. It means that if there are more values as there are colors. Then it will categorize a set of values.

More notes will follow.