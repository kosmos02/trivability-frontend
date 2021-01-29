
function TriviaContainer({currentQuestion, isCorrect, clickedAnswer, timer, answersRandom}){

    const displayTriviaDisplay = () => {
        if (currentQuestion !== ""){
            return <div id="trivia-display">{showQuestion()}</div>
        }
    }

    const showQuestion = () => {
        if (currentQuestion !== ""){
            return(
                <div id='question-container'>
                    <p id="type-question" className={categoryColor()}>{currentQuestion.category}</p>
                    <p id="question">{currentQuestion.question}</p>
                    
                    <div id="correct-container">
                        {renderIsCorrect()}
                    </div>
                    <div id="answers">
                        {showAnswers()}
                    </div>
                </div>
            )
        }
    }

    const categoryColor = () => {
        switch (currentQuestion.category){
            case "Science: Computers":
                return "red-category"
            case "Science & Nature":
                return "yellow-category"
            case "Mythology":
                return "blue-category"  
            case "Animals":
                return "green-category"   
            default:
                return null
        }
    }

    const renderIsCorrect = () => {
        if (isCorrect === true){
            return <p id="correct" className="isCorrect">Correct!</p>
        } 
        else if (isCorrect === false){
            return <p id="incorrect" className="isCorrect">Incorrect!</p>
        }
    }

    const addAnswerClassName= (clickedAnswer) => {
        if (clickedAnswer === currentQuestion.correct_answer && timer === false){
            return "correct-answer"
        }
        else if (clickedAnswer !== currentQuestion.correct_answer && timer === false){
            return "incorrect-answer"
        }
        else {
            return "unclicked-answer"
        }
    }

    const showAnswers = () => {
        return answersRandom.map(answer => (
            <div onClick={(event) => clickedAnswer(event)} className={["answer", addAnswerClassName(answer)].join(' ')}><p>{answer}</p></div>
        ))
    }

    return(
        <div id="trivia-container">
            {displayTriviaDisplay()}
        </div>
    )
}

export default TriviaContainer