import Die from "./Die"
import { useState } from "react"
import {nanoid} from 'nanoid'
function App() {
  const [dice,setDice]=useState(generateAllNewDIce())

  function generateAllNewDIce(){
    return new Array(10)
                .fill(0)
                .map(()=>({
                  value:(Math.ceil(Math.random()*6)),
                  isHeld:false,
                  id:nanoid()
                }))
  }

  function hold(id){
    setDice(oldDice=>oldDice.map(die=>
        die.id === id ?
                  {...die, isHeld: !die.isHeld} :
                  die
    ))
  }

  function rollDice(){

    setDice(oldDice=>
      oldDice.map(die=>
        die.isHeld ?
        die : 
        {...die,value:Math.ceil(Math.random()*6)}
      )
    )
  }
  const diecElements =dice.map(dieObj=>
  <Die key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={()=>{hold(dieObj.id)}}
  />)
  return(
    <main>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diecElements}
      </div>
      <button className='roll-dice' onClick={rollDice}>Roll</button>
    </main>
  )
}

export default App
