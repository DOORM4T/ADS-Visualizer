import * as p5 from "p5"
import wait from "./wait"

/**
 * Create a linear search animation function
 * @param state sketch state
 * @param speedSlider UI slider
 * @param searchValueInput UI input for the value to search for
 */
function linearSearchAnimated(
  state: ISketchState,
  speedSlider: p5.Element,
  searchValueInput: p5.Element,
) {
  return async () => {
    state.didFindValue = false
    /* call this function after each iteration in the linear search */
    const funct = async (index: number) => {
      /* set the index to focus on */
      state.focusIndex = index

      /* if slider is above 0, search with a delay */
      const currentDelay = +speedSlider.value() * 10
      if (currentDelay !== 0) await wait(currentDelay)
    }

    const startTime = new Date().getTime()
    const result = await linearSearch(
      state.values,
      +searchValueInput.value(),
      funct,
    )
    const timeElapsedMs = new Date().getTime() - startTime
    console.log(`${timeElapsedMs / 1000}s`)

    if (result > -1) state.didFindValue = true
    else state.focusIndex = -1
  }
}

export default linearSearchAnimated

/**
 * Find a value in an array using Linear Search
 * @param array random array of numbers
 * @param desired desired value
 * @param funct [optional] function to call in between loop iterations
 * @returns index of desired number, or -1 if not found
 */
export async function linearSearch(
  array: number[],
  desired: number,
  funct?: (index: number) => void,
) {
  const len = array.length
  for (let i = 0; i < len; i++) {
    const value = array[i]

    /* custom function to call in between iterations */

    if (funct) await funct(i)

    /* found the value? return its index */
    if (value === desired) {
      return i
    }
  }

  /* not found */
  return -1
}
