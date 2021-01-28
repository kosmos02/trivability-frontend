import Whitepawn from '../assets/white_pawn.png'
import Blackpawn from '../assets/black_pawn.png'

function GameBoard({tiles, pawn1, pawn2}){

    const showTiles = () => {
        return tiles.map(tile => (
            <div key={tile.id}className={[tile.color, "tile"].join(' ')}>
                {displayPawn1(tile)}
                {displayPawn2(tile)}
            </div>
        ))
    }

    const displayPawn1 = (tile) => {
        if (tile.id === pawn1.id){
            return <img id="white-pawn" src={Whitepawn} alt="Player 1"/>
        } 
    }
    
    const  displayPawn2 = (tile) => {
        if (tile.id === pawn2.id){
            return <img id="black-pawn" src={Blackpawn} alt="Player 2"/>
        }
    }

    return(
        <div id="game-board" >
            {showTiles()}
        </div>
    )
}

export default GameBoard