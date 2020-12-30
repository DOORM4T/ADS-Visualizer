import * as p5 from "p5"

function drawItem(
  p: p5,
  x: number,
  y: number,
  value: any,
  size = 50,
  color: ColorTuple,
  textColor: ColorTuple,
) {
  const isWithinBounds = getIsWithinBounds(p.mouseX, p.mouseY, x, y, size)

  /* hover */
  if (isWithinBounds) {
    p.fill(255)
    textColor = [0, 0, 0]
  } else {
    p.fill(...color)
  }

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
  x: number,
  y: number,
  size: number,
) {
  const isWithinXBounds = mouseX > x - size / 2 && mouseX < x + size - size / 2
  const isWithinYBounds = mouseY > y - size / 2 && mouseY < y + size / 2
  return isWithinXBounds && isWithinYBounds
}
