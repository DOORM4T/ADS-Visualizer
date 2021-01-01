import * as p5 from "p5"
import wait from "../wait"

/**
 * Create a bubble sort animation function
 * @param state sketch state
 * @param speedSlider UI slider
 */
function quickSortAnimated(state: ISketchState, speedSlider: p5.Element) {
  return async () => {
    /* prevent functions from running concurrently */
    if (state.isRunningFunction) return
    else state.isRunningFunction = true

    /* remove search result highlighting if a search algorithm preceded this one  */
    state.dimmedIndexes = []
    state.didFindValue = false

    /* call this function after each iteration in the bubble sort algorithm */
    const funct = async (index: number, isSorted: boolean) => {
      if (isSorted) {
        /* darken already-sorted indexes */
        state.dimmedIndexes.push(index)
      } else {
        /* highlight the pivot index */
        state.highlightIndexes = [index]
      }

      /* if slider is above 0, search with a delay */
      const currentDelay = +speedSlider.value() / 4
      if (currentDelay !== 0) await wait(currentDelay)
    }

    const startTime = new Date().getTime()

    await quickSort(state.values, 0, state.values.length - 1, funct)

    const timeElapsedMs = new Date().getTime() - startTime
    console.log(`${timeElapsedMs / 1000}s`)

    /* remove index highlighting */
    state.highlightIndexes = []
    state.dimmedIndexes = []

    state.isRunningFunction = false
  }
}

export default quickSortAnimated

/**
 * Quicksort algorithm
 * @param values array to sort
 * @param start start index of the current partition
 * @param end end index of the current partition
 * @param funct [optional] function to run in between bubble iterations
 */
export async function quickSort(
  values: number[],
  start: number,
  end: number,
  funct?: (index: number, isSorted: boolean) => void,
) {
  /* stop if there are no elements left to sort */
  if (start >= end) {
    if (funct) await funct(start, true)
    return
  }

  const partitionIndex = await partition(values, start, end, funct)

  /* custom function using the partition index */
  if (funct) await funct(partitionIndex, false)
  await quickSort(values, start, partitionIndex - 1, funct)
  if (funct) await funct(partitionIndex, false)
  await quickSort(values, partitionIndex + 1, end, funct)

  /* custom function using the partition index after it is sorted */
  if (funct) await funct(partitionIndex, true)
}

async function partition(
  array: number[],
  start: number,
  end: number,
  funct?: (index: number, isSorted: boolean) => void,
) {
  /* last index will be the pivot (TODO: other methods to select the pivot) */
  const pivot = array[end]

  /* index to place left partition values in */
  let leftPartitionIndex = start

  for (let i = start; i < end; i++) {
    if (array[i] < pivot) {
      /* item is less than the pivot value? place in left partition */
      swap(array, i, leftPartitionIndex)
      leftPartitionIndex++
    }
  }

  /* pivot value goes between the left and right partitions */
  swap(array, leftPartitionIndex, end)

  /* return the partition index */
  return leftPartitionIndex
}

/**
 * Swap two numbers in an array
 */
function swap(array: number[], index1: number, index2: number) {
  const temp = array[index1]
  array[index1] = array[index2]
  array[index2] = temp
}
