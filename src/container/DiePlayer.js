import Die from '../assets/die.png'
import Confetti from 'react-dom-confetti'

function DiePlayer({timer, clickDie, dieValue, hasWon, playerTurn, dieClick}){

    const displayDie = () => {
        if (timer === false){
            return(
                <h3 id="die-on" style={{cursor: 'pointer'}} onClick={() => dieClick()}>
                <img className="die" src={Die} alt="Die"/>
                {
                    clickDie ? 
                    <div id="die-info">
                        <p id="die-value">{dieValue}</p>
                        <p id="click-again-to-move">click again to move</p>
                    </div> :
                    null
                }
                </h3>
            ) 
        }
        else {
            return (
                <h3 id="die-off">
                    <img className="die" src={Die} alt="Die"/>
                </h3>
            )
        }
    }

    const playerWins = () => {

        if (hasWon !== ""){
            
            return(
                <div id="player-wins">
                    <p id="winning-player">{hasWon}</p>
                    <input onClick={() => startOver()} type="submit" value="Play Again?"/>
                </div>
            )
        }
    }

    function startOver(){
        window.location.reload(true)
    }

    const whosTurn = () => {
        if (playerTurn === true){
            return(
                <div className="turn-container">
                    <p id="player1-turn">Player 1 Turn</p>
                </div>
            ) 
        }
        else {
            return(
                <div className="turn-container">
                    <p id="player2-turn">Player 2 Turn</p>
                </div>
            )
        }
    }

    const config = {
        angle: "360",
        spread: 360,
        startVelocity: 40,
        elementCount: "200",
        dragFriction: "0.09",
        duration: "10000",
        stagger: "10",
        width: "20px",
        height: "10px",
        perspective: "502px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };

    
    return(
        <div id="die-player" >
            {displayDie()}
            {playerWins()}
            <Confetti active={hasWon} config={config}/>
            {whosTurn()}
        </div>
    )
}

export default DiePlayer