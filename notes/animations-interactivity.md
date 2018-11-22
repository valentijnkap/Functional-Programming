# Notes section Animations & Interactivity

## Ordinal Scales

There is one extra scale that is worth mentioning. It's about Ordinal/categorical Scales, it's just a collection of random values that can be used in data or referred to.

Like this:

```javascript
var fruit = [
  'Apples', 'Oranges', 'Grapes', 'Strawberry','Kiwi'
];
```

D3 can help you change those values into numbers. There are a couple of function that fit the problem. A import function is `.rangeBansd()`. A band is a specific range of numbers. For example, 0 to 30 is a specific range. The `.rangeBound()` function will calculate the steps between them like this: `0 5 10 15 20 25 30`.

Let's see the rangeBound fucntion in action.

```javascript
var fruit = [
  'Apples', 'Oranges', 'Grapes', 'Strawberry','Kiwi'
];

var scale = d3.scaleBand()
  .domain(fruit)
  .range([0, 500]);

scale('Banana') // Will return undifined
```

The import thing about the `.rangeBand()` function is that it will creates a buffer. This is what the data looks like after rangeBand.

```javascript
var fruit = [
  'Apples',       // 0
  'Oranges',      // 100
  'Grapes',       // 200
  'Strawberry',   // 300
  'Kiwi'          // 400
];
```

Note: You have to define the data in order to make it work.

## Events

Updating and chanhing the chart can be done by any reason. The main reason is certain events. This can ben done by a user because he is clicking on a button or the data changes by a source. Changing the chart can be done by listing to events. Javascript itself supports a lot of eventslisteners. [Here's](https://developer.mozilla.org/en-US/docs/Web/Events) is a list of events. This is an example of how event's work in D3.

```javascript
d3.select('button').on('click', function(){
  console.log('hello world')
});
```

### On and End events

There are a lot of events that you can use. But there are two that are very interesting to use. And those are the `on` event and the `end` event. It listens to the start of a function and can be called at the end to make some changes for example.

```javascript
svg.selectAll('circle')
  .data(data)
  .transition()
  .duration(1000)
  // Listen to the start event.
  .on('start', function() {
    d3.select(this)
      .attr('fill', '#F26D2D');
  })
  .attr("cx", function(d) {
    return x_scale(d[0]);
  })
  .attr("cy", function(d) {
    return y_scale(d[1]);
  })
  // Listen to the end event.
  .on('end', function() {
    d3.select(this)
      .attr('fill', '#D1AB0E');
  });
```

## Animatons & transitions

To add some flavor to the mix you can use animations and transitions in the chart. This is very easy to do. For example the `.transition()` function. It makes the changes go in a smooth transition. It's just one simple line of code. Here's an example in action.

```javascript
svg.selectAll( 'text' )
  .data(data)
  .transition()// Here the transition starts to before the new attributes values are placed
  .text(function( d ){
    return d;
  })
  .attr( 'x', function( d, i ){
    return x_scale(i) + x_scale.bandwidth() / 2;
  })
  .attr( 'y', function(d ){
    return chart_height - y_scale(d) + 15;
  })
```

The order of the use of the `.transition()` functions is important. If you do this at the end of the chain it will not affect the attributes.

To take control over the speed of this transition, use the `.duration()` function right after the transition. The value of the duration is always in milliseconds.

To make it even better. D3 also supports easing. It's up to you on how the transition will be displayed. [Here's](https://github.com/d3/d3-ease) a list of easings.

And there is another cool feature by D3. It's the `.delay()` function. Here's an example:

```javascript
.delay(function(d, i){
  return i * 100;
})
```

This is a loop and wil delay the transition for every data entry. This wil give a cool effect.

## Merge function

When you bring some interactivity to the mix you often reuse some code or selections. You don't want that to repeat over and over again. D3 provides a handy function that allows you to reuse selections. This is how it works:

```javascript
var h1 = d3.selectAll('h1')
var p = d3.selectAll('p')

// This will merge the p selection with h1 and ad the styles to both selections.
h1.merge(p)
  .style('color', 'red')
```

## Remove data

It is also possible to remove data with D3. But the important thing is that you update the chart. D3 does not do that by itself. You have to update it and tell that the remaining elements need to be go away. There are some functions that come in place to accomplish that.

This is how it works:

```javascript
// Bind the new set of data to the rectangles.
var bars = d3.selectAll('rect').data(data);

// Now exit and remove the rectangles that are not used.
bars.exit()
  .transition()
  .attr('x', chart_height)
  // Start remove function after the animation has ended.
  .remove();
```

## Sorting data

There might be some scenario's where you want to sort the data in the chart. This can be done by a simple function called `.sort()`. This is how it works:

```javascript
// 1. Chain this to an selection after binding the data.
// 2. Pass in a Comparator function
// 3. Then tell D3 to how sort the data. 
.sort(function(a, b) {
  return d3.ascending(a, b);
})
```