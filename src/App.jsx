import Die from "./Die"
import { useState, useEffect, useRef } from "react"
import {nanoid} from 'nanoid'
import ReactConfetti from "react-confetti"

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return size
}

function App() {
  const [dice, setDice] = useState(() => generateAllNewDIce())

  const gameWon = dice.every(die => die.isHeld) &&
    dice.every(die => die.value === dice[0].value)

  // Timer state
  const [timer, setTimer] = useState(0)
  const intervalRef = useRef(null)
  const [timerStarted, setTimerStarted] = useState(false)

  // High score from localStorage
  const [history, setHistory] = useState(() => {
    const highScore = Number(localStorage.getItem("tenziesHighScore")) || 0
    return {
      currentScore: 0,
      highScore: highScore
    }
  })

  const { width, height } = useWindowSize()

  // Start timer when timerStarted is true, stop when game is won
  useEffect(() => {
    if (timerStarted && !gameWon) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTimer(prev => prev + 1)
        }, 1000)
      }
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [timerStarted, gameWon])

  // When game is won, update scores
  useEffect(() => {
    if (gameWon) {
      setHistory(prev => {
        let newHighScore = prev.highScore
        if (prev.highScore === 0 || timer < prev.highScore) {
          newHighScore = timer
          localStorage.setItem("tenziesHighScore", timer)
        }
        return {
          currentScore: timer,
          highScore: newHighScore
        }
      })
      setTimerStarted(false)
    }
  }, [gameWon])

  // Reset timer and timerStarted on new game
  useEffect(() => {
    if (!gameWon && timer !== 0) {
      setHistory(prev => ({ ...prev, currentScore: 0 }))
    }
    // eslint-disable-next-line
  }, [dice])

  function generateAllNewDIce() {
    return new Array(10)
      .fill(0)
      .map(() => ({
        value: (Math.ceil(Math.random() * 6)),
        isHeld: false,
        id: nanoid()
      }))
  }

  function hold(id) {
    if (!timerStarted && !gameWon) {
      setTimerStarted(true)
    }
    setDice(oldDice => oldDice.map(die =>
      die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    ))
  }

  function rollDice() {
    if (!timerStarted && !gameWon) {
      setTimerStarted(true)
    }
    if (!gameWon) {
      setDice(oldDice =>
        oldDice.map(die =>
          die.isHeld ?
            die :
            { ...die, value: Math.ceil(Math.random() * 6) }
        )
      )
    } else {
      setDice(generateAllNewDIce())
      setTimer(0)
      setTimerStarted(false)
      setHistory(prev => ({ ...prev, currentScore: 0 }))
    }
  }

  function resetHighScore() {
    localStorage.removeItem("tenziesHighScore")
    setHistory(prev => ({ ...prev, highScore: 0 }))
  }

  const diecElements = dice.map(dieObj =>
    <Die key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => { hold(dieObj.id) }}
    />)
  return (
    <main>
      {gameWon && <ReactConfetti width={width} height={height} />}

      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diecElements}
      </div>
      <button className='roll-dice' onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
      <div className="history">
        <span className="current-score">current-score : {gameWon ? history.currentScore : timer}s</span>
        <span className="high-score">high-score : {history.highScore > 0 ? history.highScore + 's' : '--'}</span>
        <button className="reset-high-score" onClick={resetHighScore}>Reset High Score</button>
      </div>
    </main>
  )
}

export default App
