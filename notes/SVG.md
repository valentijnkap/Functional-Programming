# SVG Notes

These are my notes based on the course from [Luis Ramirez Jr](https://www.udemy.com/learn-d3js-for-data-visualization/) at [udemy](https://www.udemy.com/). I used some example code to explain in my on words how it works.

## SVG Attributes

There are two ways of rendering SVG in the browser. You can do that by opening the `.svg` file directly into the browser or put the svg code into a HTML file. In order to make the `.svg` file work properly in the browser you need to add some attributes to the `<svg>` element. Below you can see the basic information of an correct `.svg` file:

```svg
<svg xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink"
viewBox="0 0 1366 768">
<title>A title</title>
  ...
</svg>
```

## Basic SVG Elements

There are some basic SVG shapes you can use to make an illustration. Below I have some examples of that.

### Rectangle

```svg
<rect width="100" height="100"
  fill="#F44336" stroke="#8BC34A"
  stroke-width="10" x="5" y="5"></rect>
```

### Rounded shapes

These shapes are a bit more complex. Rounded shapes don't have an width and a height. They are scaled from the center with a radius attribute `r="100"` and moved with `cy="50"` and `cx="50"`. With the ellipse it is a bit different. You define the width and height by using the `rx="200"` and `ry="100"` attributes.

```svg
<circle r="100" cx="105" cy="105"
  fill="#9C27B0" stroke="#E91E83"
  stroke-width="10"></circle>

<ellipse rx="200" ry="100"
  cx="205" cy="105" fill="#2196F3"
  stroke="#000" stroke-width="10"></ellipse>
```

### Lines

Lines can be complex as wel. You need to define the starting and end point in order to create the line. The points are placed by an X and Y axis. You can define as many points as you like but you need to distinct them with a number.

```svg
<line x1="25" y1="25"
  x2="200" y2="200"
  stroke-width="10" stroke="red"></line>
```

### Paths

To make a path you define all the data into the `d="..."` to make the shape. There are many ways of creating shapes and defining them. Below I have a small example. On [W3schools](https://www.w3schools.com/graphics/svg_path.asp) you can find more about the key points that are used in the data.

```svg
<path d="
    M 100, 100
    L 300, 150
    L 300, 300
    Q 200, 400 100, 200
    "
  fill="none" stroke="#000"
  stroke-width="10"></path>
```

### Text

In SVG it is also possible to write text with the `<text>` element. But to make it work you need to set some coordinates. By setting coordinates you make the text visibble. If the text is long enough and you want it to go over multiple lines you can use the `<tspan>` element.

```svg
<text x="10" y="20" style="fill:red;">Several lines:
  <tspan x="10" y="45">First line.</tspan>
  <tspan x="10" y="70">Second line.</tspan>
</text>
```

## Defs

To create a ‘template’ in SVG you can use the `<defs>` tag. It wil define a certain element that is not directly visibly but can be used later on.

```svg
<defs>
  <clipPath id="custom_clip_path">
  <rect x="250" y="250" width="200" height="200"></rect>
    <circle r="50" cx="200" cy="200"></circle>
  </clipPath>
</defs>
```

## Clip Paths

Whith clip paths you can make mask like you do in Photoshop or Illustrator. Here's how it works

```svg
<clipPath id="custom_clip_path">
  <rect x="250" y="250" width="200" height="200"></rect>
</clipPath>

<g id="path-content" clip-path="url(#custom_clip_path)">
  <circle r="50" cx="200" cy="200"></circle>
  <circle r="50" cx="210" cy="100"></circle>
</g>
```