'use strict'

const score = document.querySelector('.score'),
  gameArea = document.querySelector('.gameArea'),
  start = document.querySelector('.start'),
  car = document.createElement('div')

car.classList.add('car')

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
}

const settings = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3
}

function getCountElements (heightElement) {
  return document.documentElement.clientHeight/heightElement + 1
}

function startGame () {
  start.classList.add('hide')
  settings.start = true
  for (let i = 0; i < getCountElements(40); i++) {
    const line = document.createElement('div')
    line.classList.add('line')
    line.style.top = (i * 100 + 'px')
    line.y = i * 100
    gameArea.appendChild(line)
  }
  for (let i = 0; i < getCountElements(100 * settings.traffic); i++) {
    const enemy = document.createElement('div')
    enemy.classList.add('enemy')
    //enemy.x = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth))
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px'
    enemy.y = i * settings.traffic * 100
    enemy.style.top = enemy.y * 100 + 'px'
    enemy.style.background = 'transparent url(./img/car6.png) no-repeat center/cover'
    gameArea.appendChild(enemy)
  }
  gameArea.appendChild(car)
  settings.x = car.offsetLeft
  settings.y = car.offsetTop
  requestAnimationFrame(playGame) 
}

function startRun (event) {
  event.preventDefault()
  keys[event.key] = true 
  }

function stopGame (event) {
  event.preventDefault()
  keys[event.key] = false
}

function moveRoad () {
  const lines = document.querySelectorAll('.line')
  lines.forEach(line => {
    line.y += settings.speed - 1
    line.style.top = line.y + 'px'

    if (line.y >= document.documentElement.clientHeight) line.y = - 100
  })
}

function moveEnemies () {
  const enemies = document.querySelectorAll('.enemy')
  enemies.forEach(item => {
    item.y += settings.speed - 2
    item.style.top = item.y + 'px'
    if (item.y > document.documentElement.clientHeight) {
      item.y = -100 * settings.traffic
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px'
    }
  })
}

function playGame () {  
  if (settings.start) {
    moveRoad()
    moveEnemies()
    if (keys.ArrowLeft && settings.x > 0 ) {
        settings.x -= settings.speed        
      }
    if (keys.ArrowRight && settings.x < gameArea.offsetWidth - car.offsetWidth) {
      settings.x += settings.speed
    }
    if (keys.ArrowUp && settings.y > 0) {
      settings.y -= settings.speed
    }
    if (keys.ArrowDown && settings.y < gameArea.offsetHeight - car.offsetHeight) {
      settings.y += settings.speed
    }

    car.style.left = settings.x + 'px'
    car.style.top = settings.y + 'px'

    requestAnimationFrame(playGame)
  } 

}

start.addEventListener('click', startGame)

window.addEventListener('keydown', startRun)

window.addEventListener('keyup', stopGame)