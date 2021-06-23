'use strict'

const score = document.querySelector('.score'),
  gameArea = document.querySelector('.gameArea'),
  start = document.querySelector('.start'),
  car = document.createElement('div')

car.classList.add('car')

const keys = {
  ArrowUp: false,
  ArrowDawn: false,
  ArrowLeft: false,
  ArrowRight: false,
}

const settings = {
  start: false,
  score: 0,
  speed: 3
}

const startGame = (event) => {
  start.classList.add('hide')
  settings.start = true
  gameArea.appendChild(car)
  requestAnimationFrame(playGame)
}

const playGame = () => {
  if (settings.start) requestAnimationFrame(playGame)
}

const startRun = (event) => {
  event.preventDefault()
  keys[event.key] = true
}

const stopGame = (event) => {
  event.preventDefault()
  keys[event.key] = false
}

start.addEventListener('click', startGame)

window.addEventListener('keydown', startGame)

window.addEventListener('keyup', stopGame)