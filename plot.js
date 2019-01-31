//adapted from: http://matt.might.net/articles/rendering-mathematical-functions-in-javascript-with-canvas-html/
(() => { //begin iife

let canvas = document.getElementById('xy-graph')
let ctx = canvas.getContext('2d')
let width = canvas.width 
let height = canvas.height 

var f = z => 1 / (1 + Math.exp(-z))

// get logical viewport
let vp = {
  min: {
    x: -5,
    y: 0
  },
  max: {
    x: 5,
    y: 1
  }
}

let marks = {
  x: 1,
  y: 1
}

// Returns the physical x-coordinate of a logical x-coordinate
let xPhys = x => (x - vp.min.x) / (vp.max.x - vp.min.x) * width

// Returns the physical y-coordinate of a logical y-coordinate
let yPhys = y => height - (y - vp.min.y) / (vp.max.y - vp.min.y) * height

function drawGraph() {
  ctx.clearRect(0, 0, width, height)
  drawAxes()
  drawFormula(f)
}
  
function drawAxes() {
  ctx.save()
  ctx.linewidth = 2
  ctx.strokeStyle = "black"
 
  createAxisPart(0, vp.min.y)
  createAxisPart(0, vp.max.y)
  createAxisPart(vp.min.x, 0)
  createAxisPart(vp.max.x, 0)

  createAxisMarkPartX(vp.min.x, -1)
  createAxisMarkPartX(vp.max.x, 1)
  createAxisMarkPartY(vp.min.y, -1)
  createAxisMarkPartY(vp.max.y, 1)
 
  ctx.restore()
}

function createAxisPart(x, y){
  ctx.beginPath()
  ctx.moveTo(xPhys(0), yPhys(0))
  ctx.lineTo(xPhys(x), yPhys(y)) //e.g. (vp.min.x, 0) or (0, vp.max.y)
  ctx.stroke()
}

function createAxisMarkPartX(amountOfMarks, sign){
  for (let i = 1; i < amountOfMarks * sign; i++) {
    ctx.beginPath()
    ctx.moveTo(xPhys(i * sign), yPhys(0) - 5)
    ctx.lineTo(xPhys(i * sign), yPhys(0) + 5)
    ctx.stroke()
  }
}

function createAxisMarkPartY(amountOfMarks, sign){
  for (let i = 1; i < amountOfMarks * sign; i++) {
    ctx.beginPath()
    ctx.moveTo(xPhys(0) - 5, yPhys(i * sign))
    ctx.lineTo(xPhys(0) + 5, yPhys(i * sign))
    ctx.stroke()
  }
}

// When rendering, xDist determines the horizontal distance between points
let xDist = (vp.max.x-vp.min.x) / width

document.getElementById("wx").addEventListener('input', () => {
  drawGraph()
})

document.getElementById("b").addEventListener('input', () => {
  drawGraph()
})

function drawFormula(f) {
  let wx = parseFloat(document.getElementById("wx").value)
  let b = parseFloat(document.getElementById("b").value)
  ctx.beginPath()
  ctx.strokeStyle = "red"
  let x = vp.min.x
  let y = f(wx * x + b)
  ctx.moveTo(xPhys(x), yPhys(y))
  for (x = x + xDist; x <= vp.max.x; x += xDist) {
    y = f(wx*x+b)
    ctx.lineTo(xPhys(x), yPhys(y))
  }
  ctx.stroke()
}

drawGraph()

})()