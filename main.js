'use strict'

const score = document.querySelector('.score'),
  gameArea = document.querySelector('.gameArea'),
  start = document.querySelector('.start'),
  car = document.createElement('div'),
  btns = document.querySelectorAll('.btn'),
  modal = document.querySelector('.modal'),
  modalContent = document.querySelector('.modal__content'),
  clear = document.querySelector('.btn__clear'),
  MAX_EMEMY = 7

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
  traffic: 3,
  startSpeed: 0,
  record: localStorage.getItem('best-record'),
  newRecord: '',
}

function getEnemyNumber(max) {
  return Math.ceil(Math.random() * max)
}

function getCountElements (heightElement) {
  return document.documentElement.clientHeight/heightElement + 1
}

function changeGame (lvl) {
  switch (lvl) {
    case '1':
      settings.startSpeed = 3
      settings.traffic = 3
      break
    case '2':
      settings.startSpeed = 5
      settings.traffic = 3
      break
    case '3':
      settings.startSpeed = 7
      settings.traffic = 3
      break
  }
}

function startGame (event) {
  if (!event.target.classList.contains('btn')) return
  const level = event.target.dataset.level
  changeGame(level)
  start.style.visibility = 'hidden'
  score.classList.remove('hide')
  gameArea.innerHTML = ''
  settings.start = true
  settings.score = 0
  car.style.top = ''
  car.style.bottom = '50px'
  car.style.left = '125px'
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
    enemy.x =  Math.floor(Math.random() * (gameArea.offsetWidth - 50))
    enemy.style.left = enemy.x + 'px'
    enemy.y = - i * settings.traffic * 100
    enemy.style.top = enemy.y + 'px'
    enemy.style.background = `transparent url(./img/car${getEnemyNumber(MAX_EMEMY)}.png) no-repeat center/cover`
    gameArea.appendChild(enemy)
  }
  gameArea.appendChild(car)
  settings.x = car.offsetLeft
  settings.y = car.offsetTop
  requestAnimationFrame(playGame) 
}

function startRun (event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault()
    keys[event.key] = true
    }
  }

function stopGame (event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault()
    keys[event.key] = false
  }
}

function moveRoad () {
  const lines = document.querySelectorAll('.line')
  lines.forEach(line => {
    line.y += settings.speed
    line.style.top = line.y + 'px'

    if (line.y >= gameArea.offsetHeight) line.y = - 100
  })
}

function moveEnemies () {
  const enemies = document.querySelectorAll('.enemy')
  enemies.forEach(item => {
    let carRect = car.getBoundingClientRect()
    let enemyRect = item.getBoundingClientRect()
    if (carRect.right - 5 >= enemyRect.left &&
        carRect.top + 5 <= enemyRect.bottom &&
        carRect.left + 5 <= enemyRect.right &&
        carRect.bottom - 5 >= enemyRect.top) {
          console.log('crash')
          settings.start = false
          start.classList.remove('hide')        
          modal.classList.remove('hidden')
          score.classList.add('hide')          
          if (settings.score > settings.record) {
            localStorage.setItem('best-record', settings.score)            
            settings.record = settings.score
            settings.newRecord = settings.score
          }          
          modalContent.innerHTML = ` <p>speed: ${settings.speed}</p>
                                    <p>score: ${settings.score}</p>
                                    ${settings.newRecord && `<p><b>New best score: ${settings.newRecord}</b></p>`} `  
        }
    item.y += settings.speed - 2       
    item.style.top = item.y + 'px'
    if (item.y >= gameArea.offsetHeight) {
      item.y = -100 * settings.traffic
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px'
      item.style.background = `transparent url(./img/car${getEnemyNumber(MAX_EMEMY)}.png) no-repeat center/cover`    
    }
  })
}

function playGame () {  
  if (settings.start) {
    moveRoad()
    moveEnemies()
    settings.score += settings.speed
    score.innerHTML = `<span>speed: ${settings.speed}</span>
                      <span> | score: ${settings.score}</span>
                      ${settings.record ? `<span> | best score: ${settings.record}</span>` : ''}`    
    settings.speed = settings.startSpeed + Math.floor(settings.score/2000)
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

function clearField () {
  modal.classList.add('hidden')
  gameArea.innerHTML = ''
  score.classList.add('hide')
  start.style.visibility = 'visible'
}

start.addEventListener('click', startGame)

clear.addEventListener('click', clearField)

window.addEventListener('keydown', startRun)

window.addEventListener('keyup', stopGame)