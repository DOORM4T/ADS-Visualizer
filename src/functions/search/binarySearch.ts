import * as p5 from "p5"
import wait from "../wait"

/**
 * Create a linear search animation function
 * @param state sketch state
 * @param speedSlider UI slider
 * @param searchValueInput UI input for the value to search for
 */
function binarySearchAnimated(
  state: ISketchState,
  speedSlider: p5.Element,
  searchValueInput: p5.Element,
) {
  return async () => {
    state.highlightIndexes = []
    state.didFindValue = false

    /* call this function after each iteration in the binary search */
    const funct = async (startIndex: number, endIndex: number) => {
      /* set the indexes to focus on */
      const focusIndexes = []
      for (let i = startIndex; i <= endIndex; i++) focusIndexes.push(i)
      state.highlightIndexes = focusIndexes

      /* if slider is above 0, search with a delay */
      const currentDelay = +speedSlider.value()
      if (currentDelay !== 0) await wait(currentDelay)
    }

    const startTime = new Date().getTime()

    const result = await binarySearch(
      state.values,
      +searchValueInput.value(),
      funct,
    )

    const timeElapsedMs = new Date().getTime() - startTime
    console.log(`${timeElapsedMs / 1000}s`)

    if (result > -1) {
      state.didFindValue = true
    } else state.highlightIndexes = []
  }
}

export default binarySearchAnimated

/**
 * Find a value in an array using the Binary Search algorithm
 * NOTE: Works ONLY when the array is sorted!
 * @param array random array of numbers
 * @param desired desired value
 * @param funct [optional] function to call in between loop iterations
 * @returns index of desired number, or -1 if not found
 */
export async function binarySearch(
  array: number[],
  desired: number,
  funct?: (startIndex: number, endIndex: number) => void,
) {
  let lowerBound = 0
  let upperBound = array.length - 1

  if (funct) await funct(lowerBound, upperBound)

  while (lowerBound <= upperBound) {
    const midpoint = Math.floor((upperBound + lowerBound) / 2)
    const midpointValue = array[midpoint]

    if (midpointValue === desired) {
      /* found the desired value */

      /* custom function using the midpoint */
      if (funct) await funct(midpoint, midpoint)

      return midpoint
    } else if (desired < midpointValue) {
      /* desired value is before the midpoint value */
      upperBound = midpoint - 1

      /* custom function using the lower bound & midpoint */
      if (funct) await funct(lowerBound, midpoint)
    } else if (desired > midpointValue) {
      /* desired value is after the midpoint value */
      lowerBound = midpoint + 1

      /* custom function using the midpoint & upper bound */
      if (funct) await funct(midpoint, upperBound)
    }
  }

  /* not found */
  return -1
}
