function Die(props){
    const styles={
        backgroundColor: props.isHeld ? "#59E391" : "white",
        color: props.isHeld ? "#222" : "#333",
        boxShadow: props.isHeld ? "0 0 10px #59E391" : "0 2px 6px rgba(0,0,0,0.13)",
        transform: props.isHeld ? "scale(1.1)" : "scale(1)",
        fontWeight: "bold",
        fontSize: "2.1rem",
        transition: "all 0.18s cubic-bezier(.4,2,.6,1)",
        outline: props.isHeld ? "2px solid #59E391" : "none"
    }
    return(
        <button style={styles} className="die-btn" onClick={props.hold}>{props.value}</button>
    )
}
export default Die