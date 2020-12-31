import * as p5 from "p5"
import drawItem from "./functions/drawItem"
import linearSearchAnimated from "./functions/linearSearch"
import randomArray from "./functions/randomArray"

//
// START THE SKETCH
//
/* Create the p5 sketch in an existing div */
const sketchContainerId = "visualizer"
const visualizerDiv = document.getElementById(
  sketchContainerId,
) as HTMLDivElement
const buttonContainerId = "buttons"

/* Global Variables */
const MIN = 0
const MAX = 10000
const COUNT = 10

/* Sketch Function */
function sketch(p: p5) {
  /* drawing parameters */
  const state: ISketchState = {
    values: randomArray(COUNT, MIN, MAX),
    itemSize: 50,
    offsetX: 50,
    offsetY: 50,
    focusIndex: 0,
    didFindValue: false,
  }

  /* UI References */
  let doWrapCheckbox: p5.Element
  let speedSlider: p5.Element
  let searchValueInput: p5.Element
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

    /* input for the search value */
    searchValueInput = p.createInput("Search for...", "number")
    searchValueInput.parent(buttonContainerId)

    /* buttons for selecting the operation */
    /* LINEAR SEARCH */
    linearSearchBtn = p.createButton("Linear Search")
    linearSearchBtn.parent(buttonContainerId)
    linearSearchBtn.mouseClicked(
      linearSearchAnimated(state, speedSlider, searchValueInput),
    )

    /* BINARY SEARCH */
  }

  /* change size on scroll */
  const MIN_ITEM_SIZE = 30
  const MAX_ITEM_SIZE = 200
  p.mouseWheel = (event: WheelEvent) => {
    if (!isWithinCanvas()) return

    state.itemSize += -0.5 * event.deltaY
    if (state.itemSize < MIN_ITEM_SIZE) state.itemSize = MIN_ITEM_SIZE
    if (state.itemSize > MAX_ITEM_SIZE) state.itemSize = MAX_ITEM_SIZE
    p.textSize(state.itemSize / 3)
  }

  const DEFAULT_PAN_KEY = 32 // SPACEBAR
  p.draw = async () => {
    p.background(204)

    /* canvas panning */
    if (p.mouseIsPressed && isWithinCanvas()) {
      state.offsetX += p.mouseX - p.pmouseX
      state.offsetY += p.mouseY - p.pmouseY
    }

    /**
     * return to default panning upon a special key press
     */
    if (p.keyIsDown(DEFAULT_PAN_KEY) && isWithinCanvas()) {
      state.offsetX = state.itemSize
      state.offsetY = state.itemSize
    }

    p.translate(state.offsetX, state.offsetY)

    /* draw value squares */
    state.values.forEach((value, index) => {
      /* row wrapping */

      const itemsPerRow = getItemsPerRow(
        // @ts-ignore .checked() exists on a p5.Element checkbox. No specific checkbox type exists in the p5 type definititions.
        doWrapCheckbox.checked(),
        state.itemSize,
      )

      const x = state.itemSize * (index % itemsPerRow)
      const y = state.itemSize * Math.floor(index / itemsPerRow)

      let color: ColorTuple
      let textColor: ColorTuple = [0, 0, 0]
      if (index === state.focusIndex) {
        /* highlight the focused index */
        if (state.didFindValue) color = [0, 255, 0]
        else color = [255, 255, 0]
      } else {
        /* default color */
        const saturation = p.map(value, MIN, MAX, 0, 255)
        color = [saturation, 0, 0]
        textColor = [255, 255, 255]
      }

      drawItem(
        p,
        x,
        y,
        state.offsetX,
        state.offsetY,
        value,
        state.itemSize,
        color,
        textColor,
      )
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

/**
 * @returns whether the coordinate is within the canvas or not
 */
function isWithinCanvas() {
  const y = p5Instance.mouseY
  const upperBound = visualizerDiv.offsetHeight
  return y > 0 && y < upperBound
}

/* resize canvas */
window.addEventListener("resize", () => {
  p5Instance.resizeCanvas(visualizerDiv.clientWidth, visualizerDiv.clientHeight)
})
