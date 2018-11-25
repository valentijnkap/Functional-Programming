# Use node.js in combination with D3

Most of the times you use D3 on the client side in your browser. But sometimes you want to use it on the backend side. This will be slightly faster than the client side. It's just preference and context related.

## HTML

The problem with using D3 in Node is that D3 expects that you use an HTML file where the visualization is rendered. But D3 doesn't support HTML on its own. You have to create a virtual HTML file in order to make it work for D3. There packages that can help you accomplish this goal. D3 has made a special package to help you use D3 on the server side. It's called D3-node and can be found on [NPM](https://www.npmjs.com/package/d3-node).

Just trigger the following command in the command line:

```sh
npm install d3-node
```

After you installed d3-node, create an index file and handle the request from the client. Give a SVG string back in the response. It will look like this:

```javascript
var http = require('http');
var D3Node = require('d3-node');
var d3n = new D3Node();

http.createServer(function(req, res) {
  if(req.url.indexOf('favicon.ico') != -1) {
    res.statusCode = 404;
    return;
  }

  d3n.createSVG(400, 400)
    .append('circle')
    .attr('r', 200)
    .attr('cx', 200)
    .attr('cy', 200)
    .attr('fill', 'black');

  res.writeHead(200, {
    'content-Type': 'image/svg+xml'
  });

  res.end(d3n.svgString());
}).listen(3333);
```