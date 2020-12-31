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
  focusIndex: number
  didFindValue: boolean
}
