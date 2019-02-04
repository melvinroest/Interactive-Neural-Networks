let vp = {
  min: {
    x: -15,
    y: 0
  },
  max: {
    x: 5,
    y: 1
  }
}

let sig = z => 1 / (1 + Math.exp(-z))

let cost = (y, yHat) => {
  return 0.5 * (sig(y) - yHat) ** 2
}

function costFunctionData(x, desiredValue) {

  let xDist = 0.5

  for (let wx = vp.min.x; wx <= vp.max.x; wx += xDist) {
    for(let b = vp.min.x; b <= vp.max.x; b += xDist) {
      let z = wx * x + b
      let neuron = wx * x
      let y = cost(z, desiredValue) 
      console.log(`${neuron}, ${b}, ${y}`)
    }
  }
}

costFunctionData(1, 0)

costFunctionData(0.0001, 1)