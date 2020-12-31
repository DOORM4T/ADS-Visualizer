import * as p5 from "p5"

function drawItem(
  p: p5,
  x: number,
  y: number,
  offsetX: number,
  offsetY: number,
  value: any,
  size = 50,
  color: ColorTuple,
  textColor: ColorTuple,
) {
  const isWithinBounds = getIsWithinBounds(
    p.mouseX,
    p.mouseY,
    offsetX,
    offsetY,
    x,
    y,
    size,
  )

  /* hover */
  if (isWithinBounds) {
    p.fill(255)
    textColor = [0, 0, 0]
  } else {
    p.fill(...color)
  }

  p.stroke(204)
  p.rect(x - size / 2, y - size / 2, size, size)
  p.fill(...textColor)

  p.noStroke()
  p.textAlign(p.CENTER)
  p.text(value, x, y + p.textSize() / 2)
}

export default drawItem

/**
 *
 * @returns whether the coordinates are within bounds of a rectangle or not
 * @param mouseX
 * @param mouseY
 * @param x
 * @param y
 * @param size
 */
function getIsWithinBounds(
  mouseX: number,
  mouseY: number,
  offsetX: number,
  offsetY: number,
  x: number,
  y: number,
  size: number,
) {
  const isWithinXBounds =
    mouseX - offsetX > x - size / 2 && mouseX - offsetX < x + size - size / 2
  const isWithinYBounds =
    mouseY - offsetY > y - size / 2 && mouseY - offsetY < y + size / 2
  return isWithinXBounds && isWithinYBounds
}
