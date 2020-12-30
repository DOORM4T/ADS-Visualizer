/**
 * Find a value in an array using Linear Search
 * @param array random array of numbers
 * @param desired desired value
 * @param funct [optional] function to call in between loop iterations
 * @returns index of desired number, or -1 if not found
 */
async function linearSearch(
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

export default linearSearch
