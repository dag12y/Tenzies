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

  function rollDice(){
    setDice(generateAllNewDIce())
  }
  const diecElements =dice.map(dieObj=><Die key={dieObj.id} value={dieObj.value}/>)
  return(
    <main>
      <div className="dice-container">
        {diecElements}
      </div>
      <button className='roll-dice' onClick={rollDice}>Roll</button>
    </main>
  )
}

export default App
