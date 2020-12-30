/**
 * Generate an array of random numbers of some size
 * Random number generation is inclusive between min and max.
 * @param size size of the array
 * @param min [default=0] minimum possible value
 * @param max [default=100] maximum possible value
 */
function randomArray(size: number = 10, min: number = 0, max: number = 100) {
  return Array.from(new Array(size), () => {
    return randomNumber(min, max)
  })
}

export default randomArray

/**
 * Generate an inclusive random number from some min and max
 *
 * e.g. Math.random() * (100 - 10 + 1) + 10 => [10,101) = [10, 100]
 *
 * @param min minimum possible value
 * @param max maximum possible value
 */
export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
