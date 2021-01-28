
function Timer({timer, counter}){

    const displayTimer = () => {
        if (timer === true){
            return counter
        }
    }

    return(
        <div id="timer-section">
            <p id="timer">
                {displayTimer()}
            </p> 
        </div>
    )
}

export default Timer