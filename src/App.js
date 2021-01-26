import React, { Component } from 'react'
import './App.css';

class App extends Component {
  state={
    tiles: [],

    redQuestions: [],
    blueQuestions: [],
    yellowQuestions: [],
    greenQuestions: [],
    currentQuestion: "",
    answersRandom: [],

    playerTurn: true,
    pawn1: {},
    pawn2: {},
    pawn1Pass: true,
    pawn2Pass: true,

    clickDie: false,
    dieValue: null,

    timer: false,
    counter: 30,

    isCorrect: null,

    hasWon: "",
  }

  componentDidMount(){
    fetch('http://localhost:3000/tiles')
      .then(response => response.json())
      .then(tiles => {
        this.setState({tiles, pawn1: tiles[0], pawn2: tiles[0]})
      })
        
    fetch('https://opentdb.com/api.php?amount=48&category=18&difficulty=easy')
      .then(response => response.json())
      .then(computerTrivias => (
        this.setState({redQuestions: computerTrivias})
      ))
    fetch('https://opentdb.com/api.php?amount=50&category=15&difficulty=easy')
        .then(response => response.json())
        .then(videoGamesTrivias => (
          this.setState({yellowQuestions: videoGamesTrivias})
        ))
    fetch('https://opentdb.com/api.php?amount=50&category=20')
          .then(response => response.json())
          .then(mythologyTrivias => (
            this.setState({blueQuestions: mythologyTrivias})
          ))
    fetch('https://opentdb.com/api.php?amount=50&category=27')
          .then(response => response.json())
          .then(animalTrivias => (
            this.setState({greenQuestions: animalTrivias})
          ))
  }

  showTiles = () => {
    return this.state.tiles.map(tile => (
      <div key={tile.id}className={[tile.color, "tile"].join(' ')}>
        {this.displayPawn1(tile)}
        {this.displayPawn2(tile)}
      </div>
    ))
  }

  displayPawn1 = (tile) => {
    if (tile.id === this.state.pawn1.id){
      return <p>Pawn1</p>
    } 
  }

  displayPawn2 = (tile) => {
    if (tile.id === this.state.pawn2.id){
      return <p>Pawn2</p>
    }
  }

  dieClick = () => {
    if (this.state.pawn1Pass === true && this.state.playerTurn === true){
      if (this.state.clickDie === true){
        this.setState({
          clickDie: !this.state.clickDie, 
          dieValue: Math.floor(Math.random() * (6-1+1) +1)
        })
        this.pawnMove()
      } 
      else {
        this.setState({
          clickDie: !this.state.clickDie, 
          dieValue: Math.floor(Math.random() * (6-1+1) + 1)
        })
      }
    }

    else if (this.state.pawn1Pass === false && this.state.playerTurn === true) {
      this.newQuestion(this.state.pawn1)

    }
    
    else if (this.state.pawn2Pass === true && this.state.playerTurn === false){
      if (this.state.clickDie === true){
        this.setState({
          clickDie: !this.state.clickDie, 
          dieValue: Math.floor(Math.random() * (6-1+1) +1)
        })
        this.pawnMove()
      } 
      else {
        this.setState({
          clickDie: !this.state.clickDie, 
          dieValue: Math.floor(Math.random() * (6-1+1) + 1)
        })
      }

    }
    
    else if (this.state.pawn2Pass === false && this.state.playerTurn === false){
      this.newQuestion(this.state.pawn2)
    }
  } 

  pawnMove= () => {
    if (this.state.playerTurn === true){
      if (typeof this.state.tiles[this.state.tiles.indexOf(this.state.pawn1) + this.state.dieValue] !== 'undefined'){
        this.setState({
          pawn1: this.state.tiles[this.state.tiles.indexOf(this.state.pawn1) + this.state.dieValue]
        })
        this.newQuestion(this.state.pawn1)
      } else {
        this.setState({
          pawn1: this.state.tiles[this.state.tiles.length - 1]}
        )
        this.newQuestion(this.state.pawn1)
      }

    } else {
      if (typeof this.state.tiles[this.state.tiles.indexOf(this.state.pawn2) + this.state.dieValue] !== 'undefined'){
        this.setState({
          pawn2: this.state.tiles[this.state.tiles.indexOf(this.state.pawn2) + this.state.dieValue]
        })
        this.newQuestion(this.state.pawn2)
      } 
      else {
        this.setState({
          pawn2: this.state.tiles[this.state.tiles.length -1]}
        )
        this.newQuestion(this.state.pawn2)
      }
    }
  }

  newQuestion = (pawn) => {
    this.setState({isCorrect: null})
    switch (pawn.color){
      case "red":
        this.setState({
          currentQuestion: this.randomQuestion(this.state.redQuestions.results), 
          timer: !this.state.timer, 
          counter: 30
        })
        break
      case "green":
          this.setState({
            currentQuestion: this.randomQuestion(this.state.greenQuestions.results),
            timer: !this.state.timer, 
            counter: 30
          })
          break
      case "yellow":
          this.setState({
            currentQuestion: this.randomQuestion(this.state.yellowQuestions.results),
            timer: !this.state.timer, 
            counter: 30
          })
          break
      case "blue":
          this.setState({
            currentQuestion: this.randomQuestion(this.state.blueQuestions.results), 
            timer: !this.state.timer, 
            counter: 30
          })
          break
      default:
        return(
          null
        )
    }
    // to update currentQuestion props before exectution
    setTimeout(() => this.setState({answersRandom: this.randomizeAnswers()}), 1000)
    this.setClock()
  }

  setClock = () => {
    setTimeout(() => {
      if (this.state.timer === true){
        const startClock = setInterval(() => {
          if (this.state.counter <= 60 && this.state.counter > 0){
            this.setState({counter: this.state.counter - 1})
          } 
          else {
            this.setState({
              timer: false,
              playerTurn: !this.state.playerTurn
            })
            clearInterval(startClock)
          }
        }, 1000)
      }
    } ,1000)
  }

  randomQuestion = (triviasArray) => {
    const randomIndex = Math.floor(Math.random() * triviasArray.length)
    const question = triviasArray[randomIndex]
    return question
    }

  randomizeAnswers= () => {
    const incorrectAnswers = this.state.currentQuestion.incorrect_answers
    const correctAnswer = this.state.currentQuestion.correct_answer
    const answers = [...incorrectAnswers, correctAnswer]
    return answers.sort(() => Math.random() -0.5)
  }

  renderIsCorrect = () => {
    if (this.state.isCorrect === true){
      return <p>Correct!</p>
    } 
    else if (this.state.isCorrect === false){
      return <p>Incorrect!</p>
    }
  }

  showQuestion = () => {
    if (this.state.currentQuestion !== ""){
      return(
        <div>
          <div>
            <p id="question">{this.state.currentQuestion.question}</p>
            {this.renderIsCorrect()}
            <div id="answers">
              {this.showAnswers()}
            </div>
          </div>
        </div>
      )
    }
  }

  showAnswers = () => {
    return this.state.answersRandom.map(answer => (
      <div onClick={this.clickedAnswer} className="answer">{answer}</div>
    ))
  }

  clickedAnswer = (event) => {
    if (event.target.textContent === this.state.currentQuestion.correct_answer){
      if (this.state.playerTurn === true){
        if (this.state.pawn1 === this.state.tiles[this.state.tiles.length - 1]){
          return this.setState({
            hasWon: "Player 1 WINS", 
            counter: 0
          })
        }
        this.setState({
          pawn1Pass: true,
          timer: false,
          counter: 0,
          isCorrect: true
        })
      } 
      else {
        if (this.state.pawn2 === this.state.tiles[this.state.tiles.length - 1]){
          return this.setState({
            hasWon: "Player 2 WINS",
            counter: 0
          })
        }
        this.setState({
          pawn2Pass: true,
          timer: false, 
          counter: 0, 
          isCorrect: true
        })
      }
    } 
    else {
      if (this.state.playerTurn === true){
        this.setState({
          pawn1Pass: false,
          timer: false,
          counter: 0,
          isCorrect: false
        })
      } 
      else {
        this.setState({
          pawn2Pass: false,
          timer: false,
          counter: 0,
          isCorrect: false
        })
      }
    }
  }

  displayTimer = () => {
    if (this.state.timer === true){
      return this.state.counter
    }
  }

  displayDie = () => {
    if (this.state.counter === 30 || this.state.counter === 0){
      return(
        <h3 id="die-on" style={{cursor: 'pointer'}} onClick={this.dieClick}>
        <p>Die</p>
          {
            this.state.clickDie ? 
            <p>{this.state.dieValue}</p> :
            null
          }
        </h3>
      ) 
    }
    else {
      return (
        <h3 id="die">
          <p>Die</p>
        </h3>
      )
    }
  }

  playerWins = () => {
    if (this.state.hasWon !== ""){
      return(
        <div>
          <p>{this.state.hasWon}</p>
          <input type="submit" value="Play Again?"/>
        </div>
      )
    }
  }

  displayPlayerTurn = () => {
    if (this.state.playerTurn === true){
      return "Player 1 Turn"
    }
    else {
      return "Player 2 Turn"
    }
  }

  render(){
    return (
      <div className="App">
        <header>
          <h1>Trivia Pursuit</h1>
        </header>
        <div id="timer-section">
          <p>
            {this.displayTimer()}
          </p> 
        </div>
        <div id="trivia-display">
          {this.showQuestion()}
        </div>
        <div id="die-player" >
          {this.displayDie()}
          {this.playerWins()}
          <p>
            {this.displayPlayerTurn()}
          </p>
        </div>
        <div id="game-board" >
          {this.showTiles()}
        </div>
      </div>
    )
  }
}

export default App;
