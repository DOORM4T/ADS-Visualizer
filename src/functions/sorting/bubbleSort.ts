import * as p5 from "p5"
import wait from "../wait"

/**
 * Create a bubble sort animation function
 * @param state sketch state
 * @param speedSlider UI slider
 */
function bubbleSortAnimated(state: ISketchState, speedSlider: p5.Element) {
  return async () => {
    /* remove search result highlighting if a search algorithm preceded this one  */
    state.didFindValue = false

    /* call this function after each iteration in the bubble sort algorithm */
    const funct = async (index: number) => {
      /* set the index to focus on */
      state.highlightIndexes = [index]

      /* if slider is above 0, search with a delay */
      const currentDelay = +speedSlider.value() / 2
      if (currentDelay !== 0) await wait(currentDelay)
    }

    const startTime = new Date().getTime()

    await bubbleSort(state.values, funct)

    const timeElapsedMs = new Date().getTime() - startTime
    console.log(`${timeElapsedMs / 1000}s`)

    /* remove index highlighting */
    state.highlightIndexes = []
  }
}

export default bubbleSortAnimated

/**
 * Bubble sort algorithm
 * @param values array to sort
 * @param funct [optional] function to run in between bubble iterations
 */
export async function bubbleSort(
  values: number[],
  funct?: (index: number) => void,
) {
  const len = values.length
  for (let j = 0; j < len; j++) {
    /* bubble */
    const startOfAlreadySorted = len - j - 1
    for (let i = 0; i < startOfAlreadySorted; i++) {
      if (funct)
        await funct(i) /* custom function to call in between iterations */

      if (values[i] > values[i + 1]) {
        /* swap */
        const temp = values[i]
        values[i] = values[i + 1]
        values[i + 1] = temp
        if (funct)
          await funct(i) /* custom function to call in between iterations */
      }
    }
  }
}
