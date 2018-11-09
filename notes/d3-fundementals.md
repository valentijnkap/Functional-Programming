# D3 fundementals Notes

## D3 selectors

To select an element on the page you use the selecting methods. The first one is `.select()` It will select the first element it can find on the page. You are able to pass classes, Id's and HTML elements like this:

```javascript
// Id
d3.select('#foo');

// Class
d3.select('.foo');

// Element
d3.select('div');
```

To select all the matching elements on the page use the `.selectAll()` method.

## Nodes

What are nodes? Nodes are anything and everything in a document. It sounds strange but that is what it is. A nodelist often refers to a list of elements.

## Chaining

D3 makes it possible to chain methods to another. This will change the outcome of its starting point. Whit chaining it is important that you do that in the right order. For example:

```javascript
var el = d3.select('body') // Selecting an element
  .append('p') // Creating an element within the selection
  .attr('class', 'foo') // Setting attributes to the element
  .text('Hello World!') // Set a value
```

In a different order it won’t work.

## Enter mode

D3 has an enter mode. In other words, you can refer to this as a waiting room. Ones you append the data to a selection it will store it virtually. By selecting nodes it will not create elements with data. For that, you need to enter the data and append the elements to actually create room for the data. The `.enter()` method is important. It starts at the parent element. In the example below, it will start at the `body` tag

```javascript
var dataset = [10, 20, 30, 40, 50]

var el = d3.select('body')
  .selectAll('p')
  .data(dataset)
  .enter()
  .append('p')
  .text('Hello World!')
```

## Binding data

Once you select an element and append data and child elements you loop to them. In this loop, you can trigger functions that will display the data or manipulate what is going on. For example:

```javascript
var el = d3.select('body')
  .selectAll('p')
  .data(dataset)
  .enter()
  .append('p')
  // Loop trough the data and return it
  .text(function(d) {
    return 'this is ' + d
  })
  .style('color', function(d) {
    // Checks if the data is under 25 otherwise return blue
    if (d > 25) {
      return 'red'
    } else {
      return 'blue'
    }
  })
```

## Loading external data

D3 makes it possible to load external data with some in-build methods.  You can load `text`, `.csv` and `.json`.  This is how it works:

```javascript
d3.json('data.json').then(function(data){
  console.log(data)
  generate(data)
})

function generate(dataset) {
  var el = d3.select('body')
    .selectAll('p')
    .data(dataset)
    .enter()
    .append('p')
    .text(function(d) {
      return 'this is ' + d
    })
    .style('color', function(d) {
      if (d > 25) {
        return 'red'
      } else {
        return 'blue'
      }
    })
}
```

You fetch the data and this works asynchronously. It first loads the data file, in this case, it’s the  `.json` file. Once it is loaded it will trigger the `.then()` function. It will tell the browser what to do when the data is loaded. In the `.then()`  function we tell the browser that it needs to trigger the `generate()` function. And then the data will be rendered as we told D3 to do so.