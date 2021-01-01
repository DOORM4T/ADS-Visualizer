import * as p5 from "p5"
import drawItem from "./functions/drawItem"
import linearSearchAnimated from "./functions/search/linearSearch"
import randomArray from "./functions/randomArray"
import bubbleSortAnimated from "./functions/sorting/bubbleSort"
import binarySearchAnimated from "./functions/search/binarySearch"
import quickSortAnimated from "./functions/sorting/quickSort"

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
const COUNT = 2000

/* Sketch Function */
function sketch(p: p5) {
  /* drawing parameters */
  const state: ISketchState = {
    values: randomArray(COUNT, MIN, MAX),
    itemSize: 50,
    offsetX: 50,
    offsetY: 50,
    highlightIndexes: [],
    dimmedIndexes: [],
    didFindValue: false,
    isRunningFunction: false,
  }

  /* UI References */
  let doWrapCheckbox: p5.Element
  let speedSlider: p5.Element
  let searchValueInput: p5.Element

  let bubbleSortBtn: p5.Element
  let quickSortBtn: p5.Element

  let linearSearchBtn: p5.Element
  let binarySearchBtn: p5.Element

  /* CANVAS SETUP */
  p.setup = () => {
    // CONFIG
    p.createCanvas(visualizerDiv.clientWidth, visualizerDiv.clientHeight)
    p.frameRate(240)
    p.strokeWeight(2)

    // UI
    /* checkbox for row wrapping */
    doWrapCheckbox = p.createCheckbox("Wrap", true)
    doWrapCheckbox.parent(buttonContainerId)

    /* slider for animation speed */
    const SLIDER_MAX = 1000
    speedSlider = p.createSlider(0, SLIDER_MAX)
    speedSlider.parent(buttonContainerId)
    speedSlider.attribute("step", "10")
    speedSlider.value(SLIDER_MAX / 2)

    /* input for the search value */
    searchValueInput = p.createInput("Search for...", "number")
    searchValueInput.parent(buttonContainerId)
    searchValueInput.value(0)

    /* buttons */
    /* BUBBLE SORT */
    bubbleSortBtn = p.createButton("Bubble Sort")
    bubbleSortBtn.parent(buttonContainerId)
    bubbleSortBtn.mouseClicked(bubbleSortAnimated(state, speedSlider))

    /* QUICK SORT */
    quickSortBtn = p.createButton("Quick Sort")
    quickSortBtn.parent(buttonContainerId)
    quickSortBtn.mouseClicked(quickSortAnimated(state, speedSlider))

    /* LINEAR SEARCH */
    linearSearchBtn = p.createButton("Linear Search")
    linearSearchBtn.parent(buttonContainerId)
    linearSearchBtn.mouseClicked(
      linearSearchAnimated(state, speedSlider, searchValueInput),
    )

    /* BINARY SEARCH */
    binarySearchBtn = p.createButton("Binary Search")
    binarySearchBtn.parent(buttonContainerId)
    binarySearchBtn.mouseClicked(
      binarySearchAnimated(state, speedSlider, searchValueInput),
    )
  }

  /* change size on scroll */
  const MIN_ITEM_SIZE = 20
  const MAX_ITEM_SIZE = 200
  const RESIZE_SPEED_SCALE = -0.05
  p.mouseWheel = (event: WheelEvent) => {
    if (!isWithinCanvas()) return

    if (p.keyIsPressed && /(Alt|Shift)/.test(p.key)) {
      state.offsetY += -1 * event.deltaY
    } else {
      state.itemSize += RESIZE_SPEED_SCALE * event.deltaY
      if (state.itemSize < MIN_ITEM_SIZE) state.itemSize = MIN_ITEM_SIZE
      if (state.itemSize > MAX_ITEM_SIZE) state.itemSize = MAX_ITEM_SIZE
      p.textSize(state.itemSize / 3)
    }
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
      if (state.highlightIndexes.includes(index)) {
        /* highlight the focused index(es) */
        if (state.didFindValue) color = [0, 255, 0]
        else color = [255, 255, 0]
      } else if (state.dimmedIndexes.includes(index)) {
        color = [171, 145, 68]
      } else {
        /* default color */
        const saturation = p.map(
          value,
          MIN,
          MAX,
          255,
          0,
        ) /* higher values are darker */
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
