//adapted from: http://matt.might.net/articles/rendering-mathematical-functions-in-javascript-with-canvas-html/
(() => { //begin iife

let canvas = document.getElementById('cost-function-graph-gd')
let ctx = canvas.getContext('2d')
let width = canvas.width 
let height = canvas.height
let fps = 5

let sig = z => 1 / (1 + Math.exp(-z))

let f = (x) => {
  return x ** 2
}

let sigPrime = z => sig(z)*(1-sig(z))

// get logical viewport
let vp = {
  min: {
    x: -5,
    y: 0
  },
  max: {
    x: 5,
    y: 25
  }
}

let marks = {
  x: 1,
  y: 1
}

let startingPointGD = -5

// Returns the physical x-coordinate of a logical x-coordinate
let xPhys = x => (x - vp.min.x) / (vp.max.x - vp.min.x) * width

// Returns the physical y-coordinate of a logical y-coordinate
let yPhys = y => height - (y - vp.min.y) / (vp.max.y - vp.min.y) * height

function drawGraph() {
  ctx.clearRect(0, 0, width, height)
  drawAxes()
  drawCostFunction("red")
  let drawGradientDescent = startDrawGradientDescent()
  drawGradientDescent()
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

function drawCostFunction(color) {
  let xDist = 0.01

  ctx.beginPath()
  ctx.strokeStyle = color
  let x = vp.min.x
  let y = f(x)
  ctx.moveTo(xPhys(x), yPhys(y))
  for (x = x + xDist; x <= vp.max.x; x += xDist) {
    y = f(x)
    ctx.lineTo(xPhys(x), yPhys(y))
  }
  ctx.stroke()
}

function startDrawGradientDescent(){
  let eta = 0.01
  let x = startingPointGD
  let y = f(x)

  return function drawGradientDescent(){
    ctx.beginPath()
    ctx.strokeStyle = "blue"
    if(y <= 0.001){
      return;
    }
    ctx.moveTo(xPhys(x), yPhys(y))
    x = x - 2 * x * eta
    y = f(x)
    ctx.lineTo(xPhys(x), yPhys(y))
    ctx.stroke()

    setTimeout(() => {
      requestAnimationFrame(drawGradientDescent);
    }, 1000 / fps);
  }

}

function costFunctionData(x, desiredValue) {

  let xDist = 0.1

  for (let wx = vp.min.x; wx <= vp.max.x; wx += xDist) {
    for(let b = vp.min.x; b <= vp.max.x; b += xDist) {
      let z = wx * x
      let y = cost(z, desiredValue) 
    }
  }
}

document.getElementById('gradient-descent-example-play').addEventListener('click', () => {
  drawGraph()
})

drawAxes()
drawCostFunction("red")

})()