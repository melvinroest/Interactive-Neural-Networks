//adapted from: http://matt.might.net/articles/rendering-mathematical-functions-in-javascript-with-canvas-html/
let simplestCostFunctionGraph = (canvasId, etaId) => { 

let canvas = document.getElementById(canvasId)
let ctx = canvas.getContext('2d')
let width = canvas.width 
let height = canvas.height
let fps = 5
let drawCounter = 0

let sig = z => 1 / (1 + Math.exp(-z))

let cost = (activation, desiredValue) => 0.5 * (desiredValue - activation) ** 2

let sigPrime = z => sig(z)*(1-sig(z))

// get logical viewport
let vp = {
  min: {
    x: -15,
    y: -5
  },
  max: {
    x: 15,
    y: 5
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

function drawCostFunction(x, desiredValue, color) {
  let xStep = 0.01

  ctx.beginPath()
  ctx.strokeStyle = color
  let wx = vp.min.x
  let z = wx * x
  let y = cost(z,  desiredValue)
  ctx.moveTo(xPhys(wx), yPhys(y))
  for (wx = wx + xStep; wx <= vp.max.x; wx += xStep) {
    z = wx * x
    y = cost(z, desiredValue)
    ctx.lineTo(xPhys(wx), yPhys(y))
  }
  ctx.stroke()
}

function drawGraph(etaId) {
  ctx.clearRect(0, 0, width, height)
  drawAxes()
  drawCostFunction(1, -5, "red")
  let drawGradientDescent = startDrawGradientDescent()
  drawGradientDescent()
}

function startDrawGradientDescent(){
  let eta = document.getElementById(etaId).value
  let desiredValue = -5
  let x = 1 //training example
  let wx = -2 //starting point
  let activation = x * wx
  let y = cost(activation, desiredValue)
  // console.log(`wx, y, desiredValue, eta`)
  // console.log(wx, y, desiredValue, eta)

  return function drawGradientDescent(){
    ctx.beginPath()
    ctx.strokeStyle = "blue"
    ctx.moveTo(xPhys(wx), yPhys(y))

    y = cost(activation, desiredValue)
    if(y <= 0.001) {
      ctx.closePath()
    }

    activation = x * wx
    let dcost_da = activation - desiredValue
    let da_dw = x
    let error = dcost_da * da_dw //dcost/da * da/dw
    wx = wx - eta * error

    console.log(drawCounter++)
    console.log(`wx, y, desiredValue, error, eta`)
    console.log(wx, y, desiredValue, error, eta)
    ctx.lineTo(xPhys(wx), yPhys(y))
    ctx.stroke()

    setTimeout(() => {
      requestAnimationFrame(drawGradientDescent)
    }, 1000 / fps);
  }

}

function drawGraph() {
  ctx.clearRect(0, 0, width, height)
  drawAxes()
  drawCostFunction(1, -5, "red")
  let drawGradientDescent = startDrawGradientDescent()
  drawGradientDescent()
}


if(etaId){

  document.getElementById('simplest-ann-cost-function-simplest-gd-play').addEventListener('click', () => {
    drawGraph(etaId)
  })

}


drawAxes()
drawCostFunction(1, -5, "red")

}