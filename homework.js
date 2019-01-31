let sigmoid = z => 1 / (1 + Math.exp(-z))
let feedforward = (x, wx, b) => sigmoid(x * wx + b)

feedforward(-10, 1, 0)