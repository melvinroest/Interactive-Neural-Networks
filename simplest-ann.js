// Inspired from: http://jsfiddle.net/m1erickson/LumMX/

canvas = document.getElementById("simplest-ann")
let ctx = canvas.getContext("2d")

// set starting values
let fps = 60

// progress indicators
let prevPercent = undefined
let startPercent = 10
let percent = startPercent
let maxPercent = 90
let direction = 1
let neuronRadius = 60
let numberOfNeurons = 5
let numberOfLayers = 3

//                  input, h1, output
let layerOffsets = Array(numberOfLayers).fill().map( (v, i) => i * (neuronRadius * 4) + 100 )
                    // n1   n2   n3   n4
let verticalOffsets = Array(numberOfNeurons).fill().map( (v, i) => (1 + i) * (neuronRadius * 1.5) )

// other settings
let layerAnimationCounter = 0
let font = "24px Baskerville"

// init neurons and weights
// input layer
let x1 = {x: layerOffsets[0], y: verticalOffsets[0], r: neuronRadius, color: "#9ADBFF", initValue: 0.5,
type: "input", weights: [0.25]}
let b1 = {x: layerOffsets[0], y: verticalOffsets[2], r: neuronRadius, color: "#AD9AFF", initValue: 1.0,
type: "bias", weights: [1]}
let l1 = [x1, b1]

let y1 = {x: layerOffsets[1], y: verticalOffsets[0], r: neuronRadius, color: "#9AFFBD",
type: "output", weights: [0.57]}
let l2 = [y1]

let allNeurons = [l1, l2]

// draw the neurons and axons
for(let i = 0; i < allNeurons.length; i++){
    let layer = allNeurons[i]
    for(let j = 0; j < layer.length; j++){
        let neuron = layer[j]
        drawNeuron(allNeurons[i][j])
        if(neuron.type !== "output"){
            for(let k = 0; k < neuron.weights.length; k++){
                let outputNeuron = allNeurons[i + 1][k]
                let axonWeight = neuron.weights[k]
                drawAxon({a: neuron, b: outputNeuron}, axonWeight)
            }
        }
    }
}

draw()

function calculate(input, output){

    output.forEach( (out, i) => {
        // remove output
        ctx.clearRect(out.x - out.r, out.y - out.r, out.r * 2, out.r * 2)

        // calculate activation
        let activation = input.map((val, j) => {
            return val.weights[i] * val.initValue
        }).reduce((a, b) => {
            return a + b
        })

        out.initValue = activation
        drawNeuron(out)
    })

}

// the draw loop
function draw(){
    let simplest_ann_xout = document.getElementById("simplest-ann-slider-x").value
    let simplest_ann_bout = document.getElementById("simplest-ann-slider-b").value
    let simplest_ann_wxout = document.getElementById("simplest-ann-slider-wx").value
    // let simplest_ann_wbout = document.getElementById("simplest-ann-slider-wb").value
    x1.initValue = parseFloat(simplest_ann_xout)
    x1.weights[0] = parseFloat(simplest_ann_wxout)
    b1.initValue = parseFloat(simplest_ann_bout)
    // b1.weights[0] = parseFloat(simplest_ann_wbout)

    //need to draw input neurons for slider changes
    let inputNeurons = allNeurons[0]
    for(let j = 0; j < inputNeurons.length; j++){
        let neuron = inputNeurons[j]
        drawNeuron(neuron)
    }



    let i = layerAnimationCounter
    let layer = allNeurons[i]
    let axonInfos = []
    for(let j = 0; j < layer.length; j++){
        let neuron = layer[j]
        for(let k = 0; k < neuron.weights.length; k++){
            let outputNeuron = allNeurons[i + 1][k]
            let axonWeight = neuron.weights[k]
            let dot = animateAxon({a: neuron, b: outputNeuron}, axonWeight)
            axonInfos.push({
                dot: dot,
                a: neuron,
                b: outputNeuron,
                w: axonWeight
            })
        }
    }

    //prep for next draw loop
    prevPercent = percent
    percent += direction

    if (percent >= maxPercent) {
        let inputLayer = allNeurons[i]
        let outputLayer = allNeurons[i + 1].filter(val => val.type != "bias")
        calculate(inputLayer, outputLayer)

        //delete dots
        for(let j = 0; j < axonInfos.length; j++){
            let info = axonInfos[j]
            let dot = info.dot
            ctx.clearRect(dot.prevX - (dot.r + 2), dot.prevY - (dot.r + 2), dot.r * 2 + 5, dot.r * 2 + 5)
        }
        for(let j = 0; j < axonInfos.length; j++){
            let info = axonInfos[j]
            drawAxon({a: info.a, b: info.b}, info.w)
        }


        percent = startPercent
        layerAnimationCounter++
        if(layerAnimationCounter >= allNeurons.length - 1){
            layerAnimationCounter = 0
        }
    }

    setTimeout(function () {
        requestAnimationFrame(draw);
    }, 1000 / fps);
}

function animateAxon(neurons, weight) {
    let {a, b} = neurons

    let start = {
        x: a.x + a.r,
        y: a.y
    }

    let end = {
        x: b.x - b.r,
        y: b.y
    }

    // redraw path
    let clearedAxon = {
        width: 200,
        height: 40
    }

    let x = start.x
    let y = (start.y - (clearedAxon.height / 2))
    let width = clearedAxon.width
    let height = clearedAxon.height
    let dx = end.x - start.x
    let dy = end.y - start.y
    let step = percent/100
    let prevStep = prevPercent / 100

    let dot = {
        r: 8,
        color: "#5DB6E6",
        x: start.x + dx * step,
        y: start.y + dy * step,
        prevX: start.x + dx * prevStep,
        prevY: start.y + dy * prevStep,
    }
    //                  x                              y                width               height
    ctx.clearRect(dot.prevX - (dot.r + 2), dot.prevY - (dot.r + 2), dot.r * 2 + 4, dot.r * 2 + 4)

    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.strokeStyle = 'black'
    ctx.stroke()

    drawDot(dot)

    //draw weight
    start.wx = start.x + (end.x - start.x) / 4
    start.wy = start.y + (end.y - start.y) / 4
    ctx.beginPath()
    ctx.rect(start.wx - 25, start.wy - 40, 60, 25)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.stroke()
    ctx.closePath()

    ctx.font = font
    ctx.textAlign = "center"
    ctx.fillStyle = "black"
    ctx.fillText(weight, start.wx, start.wy - 20)

    return dot;
    
}

function drawAxon(neurons, weight) {
    let {a, b} = neurons

    let start = {
        x: a.x + a.r,
        y: a.y
    }

    let end = {
        x: b.x - b.r,
        y: b.y
    }

    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.strokeStyle = 'black'
    ctx.stroke()

    //draw weight
    start.wx = start.x + (end.x - start.x) / 4
    start.wy = start.y + (end.y - start.y) / 4
    ctx.beginPath()
    ctx.rect(start.wx - 25, start.wy - 40, 60, 25)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.stroke()
    ctx.closePath()

    ctx.font = font
    ctx.textAlign = "center"
    ctx.fillStyle = "black"
    ctx.fillText(weight, start.wx, start.wy - 20)
}


// draw tracking dot at xy
function drawDot(dot) {
    ctx.fillStyle = dot.color
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1
    ctx.beginPath()
    // x   The x-coordinate of the center of the circle    
    // y   The y-coordinate of the center of the circle    
    // r   The radius of the circle    
    // sAngle  The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle) 
    // eAngle  The ending angle, in radians    
    // counterclockwise    Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
}

// draw tracking dot at xy
function drawNeuron(opts) {
    ctx.fillStyle = opts.color
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(opts.x, opts.y, opts.r, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.font = font
    ctx.textAlign = "center"
    ctx.fillStyle = "black"
    let neuronValue = 0
    if(opts.initValue) {
        neuronValue = opts.initValue.toFixed(2)
    }
    ctx.fillText(neuronValue, opts.x, opts.y + 10)
}

function debugRect(x, y, width, height){
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
}