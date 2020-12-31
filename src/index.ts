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
const COUNT = 10
const values: number[] = randomArray(COUNT, MIN, MAX)

/* Sketch Function */
function sketch(p: p5) {
  /* drawing parameters */
  let itemSize = 50
  let offsetX = itemSize
  let offsetY = itemSize
  let focusIndex = 0
  let didFindValue = false

  /* UI References */
  let doWrapCheckbox: p5.Element
  let speedSlider: p5.Element
  let searchValue: p5.Element
  let linearSearchBtn: p5.Element

  /* CANVAS SETUP */
  p.setup = () => {
    // CONFIG
    p.createCanvas(visualizerDiv.clientWidth, visualizerDiv.clientHeight)
    p.frameRate(120)

    // UI
    /* checkbox for row wrapping */
    doWrapCheckbox = p.createCheckbox("Wrap", true)
    doWrapCheckbox.parent(buttonContainerId)

    /* slider for animation speed */
    speedSlider = p.createSlider(0, 10)
    speedSlider.parent(buttonContainerId)

    /* buttons for selecting the operation */
    /* LINEAR SEARCH */
    searchValue = p.createInput("Search for...", "number")
    searchValue.parent(buttonContainerId)

    linearSearchBtn = p.createButton("Linear Search")
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
  p.mouseWheel = (event: WheelEvent) => {
    itemSize += -0.5 * event.deltaY
    if (itemSize < MIN_ITEM_SIZE) itemSize = MIN_ITEM_SIZE
    if (itemSize > MAX_ITEM_SIZE) itemSize = MAX_ITEM_SIZE
    p.textSize(itemSize / 3)
  }

  const DEFAULT_PAN_KEY = 32 // SPACEBAR
  p.draw = async () => {
    p.background(204)

    /* canvas panning */
    if (p.mouseIsPressed) {
      offsetX += p.mouseX - p.pmouseX
      offsetY += p.mouseY - p.pmouseY
    }

    /**
     * return to default panning upon a special key press
     */
    if (p.keyIsDown(DEFAULT_PAN_KEY)) {
      offsetX = itemSize
      offsetY = itemSize
    }

    p.translate(offsetX, offsetY)

    /* draw value squares */
    values.forEach((value, index) => {
      /* row wrapping */

      // @ts-ignore .checked() exists on a p5.Element checkbox. No specific checkbox type exists in the p5 type definititions.
      const itemsPerRow = getItemsPerRow(doWrapCheckbox.checked(), itemSize)

      const x = itemSize * (index % itemsPerRow)
      const y = itemSize * Math.floor(index / itemsPerRow)

      let color: ColorTuple
      let textColor: ColorTuple = [0, 0, 0]
      if (index === focusIndex) {
        /* highlight the focused index */
        if (didFindValue) color = [0, 255, 0]
        else color = [255, 255, 0]
      } else {
        /* default color */
        const saturation = p.map(value, MIN, MAX, 0, 255)
        color = [saturation, 0, 0]
        textColor = [255, 255, 255]
      }

      drawItem(p, x, y, offsetX, offsetY, value, itemSize, color, textColor)
    })
  }
}

// @ts-ignore
const p5Instance = new p5(sketch, sketchContainerId)

//
// FUNCTIONS
//

const DEFAULT_ROW_SIZE = 10
/**
 * Calculate the number of squares in a row based on canvas width
 * @param doWrap whether to enable row wrapping or not. Default row size is used if this is false
 * @param itemSize size of each square
 * @returns items per row based on screen width or a default value
 */
function getItemsPerRow(doWrap: boolean, itemSize?: number) {
  if (doWrap && itemSize) return Math.floor((p5Instance.width / itemSize) * 0.9)
  return DEFAULT_ROW_SIZE
}

/* resize canvas */
window.addEventListener("resize", () => {
  p5Instance.resizeCanvas(visualizerDiv.clientWidth, visualizerDiv.clientHeight)
})
