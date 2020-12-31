import * as p5 from "p5"
import drawItem from "./functions/drawItem"
import linearSearch from "./functions/linearSearch"
import randomArray from "./functions/randomArray"
import wait from "./functions/wait"

// create p5 sketch in an existing div
const sketchContainerId = "visualizer"
const visualizerDiv = document.getElementById(
  sketchContainerId,
) as HTMLDivElement

const buttonContainerId = "buttons"

//
// START THE SKETCH
//

/* Global Variables */
const MIN = 0
const MAX = 10000
const SIZE = 10
const values: number[] = randomArray(SIZE, MIN, MAX)

/* Sketch Function */
function sketch(p: p5) {
  let itemSize = 50
  let offsetX = itemSize
  let offsetY = itemSize
  let focusIndex = 0
  let didFindValue = false

  p.setup = () => {
    //
    // CONFIG
    //
    p.createCanvas(visualizerDiv.clientWidth, visualizerDiv.clientHeight)
    p.strokeWeight(2)
    p.frameRate(120)

    //
    // UI
    //
    const speedSlider = p.createSlider(0, 10)
    speedSlider.parent(buttonContainerId)

    /* buttons */
    /* LINEAR SEARCH */
    const searchValue = p.createInput("Search for...", "number")
    searchValue.parent(buttonContainerId)

    const linearSearchBtn = p.createButton("Linear Search")
    linearSearchBtn.parent(buttonContainerId)
    linearSearchBtn.mouseClicked(async () => {
      didFindValue = false
      linearSearchBtn.attribute("disabled", "true")
      /* call this function after each iteration in the linear search */
      const funct = async (index: number) => {
        /* set the index to focus on */
        focusIndex = index

        /* if slider is above 0, search with a delay */
        const currentDelay = +speedSlider.value() * 10
        if (currentDelay !== 0) await wait(currentDelay)
      }

      const startTime = new Date().getTime()
      const result = await linearSearch(values, +searchValue.value(), funct)
      const timeElapsedMs = new Date().getTime() - startTime
      console.log(`${timeElapsedMs / 1000}s`)
      linearSearchBtn.removeAttribute("disabled")

      if (result > -1) didFindValue = true
      else focusIndex = -1
    })

    /* BINARY SEARCH */
  }

  /* change size on scroll */
  const MIN_ITEM_SIZE = 30
  const MAX_ITEM_SIZE = 200
  const EXPECTED_SIZE = 10
  p.mouseWheel = (event: WheelEvent) => {
    itemSize += -0.5 * event.deltaY
    if (itemSize < MIN_ITEM_SIZE) itemSize = MIN_ITEM_SIZE
    if (itemSize > MAX_ITEM_SIZE) itemSize = MAX_ITEM_SIZE
    p.textSize((16 * EXPECTED_SIZE) / getItemsPerRow(itemSize))
  }

  p.draw = async () => {
    p.translate(offsetX, offsetY)

    if (p.mouseIsPressed) {
      offsetX = offsetX + (p.mouseX - p.pmouseX)
      offsetY = offsetY + (p.mouseY - p.pmouseY)
    }

    p.background(204)

    /* draw value squares */
    values.forEach((value, index) => {
      /* row wrapping */
      const itemsPerRow = getItemsPerRow(itemSize)

      const x = itemSize * (index % itemsPerRow)
      const y = itemSize * Math.floor(index / itemsPerRow)

      let color: ColorTuple
      let textColor: ColorTuple = [0, 0, 0]
      if (index === focusIndex) {
        if (didFindValue) color = [0, 255, 0]
        else color = [255, 255, 0]
      } else {
        const saturation = p.map(value, MIN, MAX, 0, 255)
        color = [saturation, 0, 0]
        textColor = [255, 255, 255]
      }

      drawItem(p, x, y, offsetX, offsetY, value, itemSize, color, textColor)
      p.noStroke()

      p.fill(255, 255, 0, 10)
    })
  }
}

// @ts-ignore
const p5Instance = new p5(sketch, sketchContainerId)

//
// FUNCTIONS
//
/* resize canvas */
window.addEventListener("resize", () => {
  p5Instance.resizeCanvas(visualizerDiv.clientWidth, visualizerDiv.clientHeight)
})

/**
 * Calculate the number of squares in a row based on canvas width
 * @param offset padding
 * @param itemSize size of each square
 */
function getItemsPerRow(itemSize: number) {
  return Math.floor((p5Instance.width / itemSize) * 0.9)
}
