//
// TYPES
//

type ColorTuple = [number, number, number]

type VisualizerFunction = (
  values: number[],
  search?: number,
) => void | undefined

interface ISketchState {
  values: number[]
  itemSize: number
  offsetX: number
  offsetY: number
  highlightIndexes: number[]
  dimmedIndexes: number[]
  didFindValue: boolean
  isRunningFunction: boolean
}
