/**
 * Wait for some number of milliseconds
 * @param delay millisecond delay
 */
async function wait(delay: number) {
  return await new Promise((res) => {
    setTimeout(() => {
      res(null)
    }, delay)
  })
}

export default wait
