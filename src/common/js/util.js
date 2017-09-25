// 生成一个min - max之间的随机数
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i) // 0-i之间的随机数
    let t = _arr[i] // 暂存一下正在遍历的数据
    _arr[i] = _arr[j] // 正在遍历的数据 = arr[随机数个]
    _arr[j] = t // arr[随机数个] = 正在遍历的数据
  }
  return _arr
}

export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
