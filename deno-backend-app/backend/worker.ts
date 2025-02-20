self.onmessage = (e) => {
  console.log('worker got message', e.data)
  // self.close()
}
