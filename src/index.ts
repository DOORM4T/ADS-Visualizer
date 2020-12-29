import * as p5 from "p5"

function sketch(p: p5) {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = () => {
    p.background(204)
    p.fill("green")
    p.ellipse(p.width / 2, p.height / 2, 500, 500)
  }
}

const p5Instance = new p5(sketch)
