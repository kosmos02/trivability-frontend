import React, { Component } from 'react'
import './App.css';
import Whitepawn from './assets/white_pawn.png'
import Blackpawn from './assets/black_pawn.png'
import Die from './assets/die.png'

import Spotlight from './assets/blue_2spotlight.mp4'

import {Howl, Howler} from 'howler'
import OminousDrums from './audioclips/ominous-drums.wav'
import HappyTimer from './audioclips/timer.mp3'
import Positive from './audioclips/correct-positive-answer.wav'
import Negative from './audioclips/wrong-answer-bass-buzzer.wav'
import Clapping from './audioclips/clapping-crowd.wav'
import DieRoll from './audioclips/dice-roll.wav'
import PlayerWin from './audioclips/player-win.mp3'
import TimesUp from './audioclips/times-up.mp3'


import Confetti from 'react-dom-confetti'


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

  componentDidUpdate(PrevProps, prevState){
    if (this.state.timer !== prevState.timer){
      this.SoundTimer(HappyTimer)
    }
    if (this.state.hasWon !== prevState.hasWon){
      this.SoundPlay(PlayerWin)
    }
    if (this.state.timer === true && this.state.counter === 0){
      this.SoundPlay(TimesUp)
    }
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

  SoundPlay = (src) => {
    const sound = new Howl({
      src
    })
    sound.play()
  }

  sound = null

  SoundTimer = (src) => {
    if (this.sound != null){
      this.sound.stop()
      this.sound.unload()
      this.sound = null
    }
    else if (this.state.timer === true){
      this.sound = new Howl({
        src
      })
      this.sound.play()
    }
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
      return <img id="white-pawn" src={Whitepawn} alt="Player 1"/>
    } 
  }

  displayPawn2 = (tile) => {
    if (tile.id === this.state.pawn2.id){
      return <img id="black-pawn" src={Blackpawn} alt="Player 2"/>
    }
  }

  dieClick = () => {
    if (this.state.pawn1Pass === true && this.state.playerTurn === true){
      this.SoundPlay(DieRoll)
      if (this.state.clickDie === true){
        this.setState({
          clickDie: !this.state.clickDie, 
          dieValue: Math.floor(Math.random() * (6-1+1) + 1)
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
      this.SoundPlay(DieRoll)
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
        setTimeout(() => this.newQuestion(this.state.pawn1), 1000)
        
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
        setTimeout(() => this.newQuestion(this.state.pawn2), 1000)
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

    //play audio ominous drums
    this.SoundPlay(OminousDrums)

    // to update currentQuestion props before exectution
    setTimeout(() => this.setState({answersRandom: this.randomizeAnswers()}), 1000)
    this.setClock()

    
  }

  setClock = () => {
    setTimeout(() => {
      if (this.state.timer === true){
        const startClock = setInterval(() => {
          if (this.state.counter <= 30 && this.state.counter > 0){
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
      return <p id="correct" className="isCorrect">Correct!</p>
    } 
    else if (this.state.isCorrect === false){
      return <p id="incorrect" className="isCorrect">Incorrect!</p>
    }
  }

  showQuestion = () => {
    if (this.state.currentQuestion !== ""){
      return(
        <div id='question-container'>
          <p id="question">{this.state.currentQuestion.question}</p>
          <div id="correct-container">
            {this.renderIsCorrect()}
          </div>
          <div id="answers">
            {this.showAnswers()}
          </div>
        </div>
      )
    }
  }

  showAnswers = () => {
    return this.state.answersRandom.map(answer => (
      <div onClick={this.clickedAnswer} className={["answer", this.addAnswerClassName(answer)].join(' ')}><p>{answer}</p></div>
    ))
  }

  addAnswerClassName= (clickedAnswer) => {
    if (clickedAnswer === this.state.currentQuestion.correct_answer && this.state.timer === false){
      return "correct-answer"
    }
    else if (clickedAnswer !== this.state.currentQuestion.correct_answer && this.state.timer === false){
      return "incorrect-answer"
    }
    else {
      return "unclicked-answer"
    }
  }

  clickedAnswer = (event) => {
    if (event.target.textContent === this.state.currentQuestion.correct_answer){
      this.SoundPlay(Positive)
      if (this.state.playerTurn === true){
        if (this.state.pawn1 === this.state.tiles[this.state.tiles.length - 1]){
        
          this.SoundPlay(Clapping)
          return this.setState({
            hasWon: "Player 1 WINS",
            timer: false,
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
          this.SoundPlay(Clapping)
          return this.setState({
            hasWon: "Player 2 WINS",
            timer: false,
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
      this.SoundPlay(Negative)
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
    if (this.state.timer === false){
      return(
        <h3 id="die-on" style={{cursor: 'pointer'}} onClick={this.dieClick}>
        <img className="die" src={Die} alt="Die"/>
          {
            this.state.clickDie ? 
            <div id="die-info">
              <p id="die-value">{this.state.dieValue}</p>
              <p id="click-again-to-move">click again to move</p>
            </div>
            :
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

  startOver(){
    window.location.reload(true)
  }

  playerWins = () => {
    if (this.state.hasWon !== ""){
      
      return(
        <div id="player-wins">
          <p id="winning-player">{this.state.hasWon}</p>
          <input onClick={() => this.startOver()} type="submit" value="Play Again?"/>
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

  displayVideo() {
    return(
      <video
        id="video"
        autoPlay
        loop
        muted
        style={{
          border: "none",
          position: "absolute",
          width: "100%",
          left: "50%",
          top: "50%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          zIndex: "-1"
    }}
    >
      <source src={Spotlight} type="video/mp4" />
    </video>
    )
  }

  displayTriviaDisplay = () => {
    if (this.state.currentQuestion !== ""){
      return <div id="trivia-display">{this.showQuestion()}</div>
    }
  }

  whosTurn = () => {
    if (this.state.playerTurn === true){
      return "player1-turn"
    }
    else {
      return "player2-turn"
    }
  }

  config = {
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
  

  render(){
    Howler.volume(0.3)
    return (
      
      <div className="App">
        {this.displayVideo()}
        <header>
          <h1>Trivia Pursuit</h1>
        </header>
        <div id="timer-section">
          <p id="timer">
            {this.displayTimer()}
          </p> 
        </div>
        <div id="trivia-container">
          {this.displayTriviaDisplay()}
        </div>
        
        <div id="die-player" >
          {this.displayDie()}
          
          {this.playerWins()}
          <Confetti active={this.state.hasWon} config={this.config}/>
          <p id={this.whosTurn()}>
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
