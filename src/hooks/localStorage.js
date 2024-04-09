export const getLocalStorage = () => {
  const res = window.localStorage.getItem('user')

  if (res !== undefined && res !== null) {
    console.log('res', res)
    const data = JSON.parse(res)
    return data
  }
  return null
}

export const setLocalStorage = (newValue) => {
  const data = JSON.stringify(newValue)
  window.localStorage.setItem('user', data)
}