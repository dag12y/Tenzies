import Die from "./Die"
import { useState } from "react"
function App() {
  const [dice,setDice]=useState(generateAllNewDIce())

  function generateAllNewDIce(){
    return new Array(10)
                .fill(0)
                .map(()=>(Math.ceil(Math.random()*6)))
  }
  const diecElements =dice.map(value=><Die value={value}/>)
  return(
    <main>
      <div className="dice-container">
        {diecElements}
      </div>
    </main>
  )
}

export default App
