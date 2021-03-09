import React, { Component } from 'react'
import './App.css';

import Header from './container/Header'
import Timer from './container/Timer'
import TriviaContainer from './container/TriviaContainer'
import DiePlayer from './container/DiePlayer'
import GameBoard from './container/GameBoard'

import Spotlight from './assets/blue_2spotlight.mp4'

import { Howl, Howler } from 'howler'
import OminousDrums from './audioclips/ominous-drums.wav'
import HappyTimer from './audioclips/timer.mp3'
import Positive from './audioclips/correct-positive-answer.wav'
import Negative from './audioclips/wrong-answer-bass-buzzer.wav'
import Clapping from './audioclips/clapping-crowd.wav'
import DieRoll from './audioclips/dice-roll.wav'
import PlayerWin from './audioclips/player-win.mp3'
import TimesUp from './audioclips/times-up.mp3'

import { decodeHTMLEntities } from './app.ts'

class App extends Component {

  state = {
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
    counter: 25,

    isCorrect: null,

    hasWon: "",
  }

  componentDidUpdate(PrevProps, prevState) {
    if (this.state.timer !== prevState.timer) {
      this.SoundTimer(HappyTimer)
    }
    if (this.state.hasWon !== prevState.hasWon) {
      this.SoundPlay(PlayerWin)
    }
    if (this.state.timer === true && this.state.counter === 0) {
      this.SoundPlay(TimesUp)
    }
  }

  componentDidMount() {
    fetch('https://trivability.herokuapp.com/tiles')
      .then(response => response.json())
      .then(tiles => {
        this.setState({ tiles, pawn1: tiles[0], pawn2: tiles[0] })
      })
    fetch('https://opentdb.com/api.php?amount=48&category=18&difficulty=easy')
      .then(response => response.json())
      .then(computerTrivias => (
        this.setState({ redQuestions: computerTrivias })
      ))
    fetch('https://opentdb.com/api.php?amount=50&category=17')
      .then(response => response.json())
      .then(scienceNatureTrivias => (
        this.setState({ yellowQuestions: scienceNatureTrivias })
      ))
    fetch('https://opentdb.com/api.php?amount=50&category=20')
      .then(response => response.json())
      .then(mythologyTrivias => (
        this.setState({ blueQuestions: mythologyTrivias })
      ))
    fetch('https://opentdb.com/api.php?amount=50&category=27')
      .then(response => response.json())
      .then(animalTrivias => (
        this.setState({ greenQuestions: animalTrivias })
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
    if (this.sound != null) {
      this.sound.stop()
      this.sound.unload()
      this.sound = null
    }
    else if (this.state.timer === true) {
      this.sound = new Howl({
        src
      })
      this.sound.play()
    }
  }

  dieClick = () => {
    if (this.state.pawn1Pass === true && this.state.playerTurn === true) {
      this.SoundPlay(DieRoll)
      if (this.state.clickDie === true) {
        this.setState({
          clickDie: !this.state.clickDie,
          dieValue: Math.floor(Math.random() * (6 - 1 + 1) + 1),        
        })
        this.pawnMove()
      }
      else {
        this.setState({
          clickDie: !this.state.clickDie,
          dieValue: Math.floor(Math.random() * (6 - 1 + 1) + 1),
        })
      }
    }

    else if (this.state.pawn1Pass === false && this.state.playerTurn === true) {
      this.setState({ currentQuestion: "" })
      setTimeout(() => this.newQuestion(this.state.pawn1, 1000))
    }

    else if (this.state.pawn2Pass === true && this.state.playerTurn === false) {
      this.SoundPlay(DieRoll)
      if (this.state.clickDie === true) {
        this.setState({
          clickDie: !this.state.clickDie,
          dieValue: Math.floor(Math.random() * (6 - 1 + 1) + 1),
        })
        this.pawnMove()
      }
      else {
        this.setState({
          clickDie: !this.state.clickDie,
          dieValue: Math.floor(Math.random() * (6 - 1 + 1) + 1),
        })
      }
    }

    else if (this.state.pawn2Pass === false && this.state.playerTurn === false) {
      this.setState({ currentQuestion: "" })
      setTimeout(() => this.newQuestion(this.state.pawn2), 1000)
    }
  }

  pawnMove = () => {
    if (this.state.playerTurn === true) {
      if (typeof this.state.tiles[this.state.tiles.indexOf(this.state.pawn1) + this.state.dieValue] !== 'undefined') {
        this.setState({
          pawn1: this.state.tiles[this.state.tiles.indexOf(this.state.pawn1) + this.state.dieValue],
        })
        setTimeout(() => this.newQuestion(this.state.pawn1), 1000)
      }
      else {
        this.setState({
          pawn1: this.state.tiles[this.state.tiles.length - 1],
          currentQuestion: ""
        })
        setTimeout(() => this.newQuestion(this.state.pawn1), 1000)
      }
    }
    else {
      if (typeof this.state.tiles[this.state.tiles.indexOf(this.state.pawn2) + this.state.dieValue] !== 'undefined') {
        this.setState({
          pawn2: this.state.tiles[this.state.tiles.indexOf(this.state.pawn2) + this.state.dieValue],
          currentQuestion: ""
        })
        setTimeout(() => this.newQuestion(this.state.pawn2), 1000)
      }
      else {
        this.setState({
          pawn2: this.state.tiles[this.state.tiles.length - 1],
          currentQuestion: ""
        })
        setTimeout(() => this.newQuestion(this.state.pawn2), 1000)
      }
    }
  }

  newQuestion = (pawn) => {
    this.setState({ isCorrect: null })
    switch (pawn.color) {
      case "red":
        this.setState({
          currentQuestion: this.randomQuestion(this.state.redQuestions.results),
          timer: !this.state.timer,
          counter: 25
        })
        break
      case "green":
        this.setState({
          currentQuestion: this.randomQuestion(this.state.greenQuestions.results),
          timer: !this.state.timer,
          counter: 25
        })
        break
      case "yellow":
        this.setState({
          currentQuestion: this.randomQuestion(this.state.yellowQuestions.results),
          timer: !this.state.timer,
          counter: 25
        })
        break
      case "blue":
        this.setState({
          currentQuestion: this.randomQuestion(this.state.blueQuestions.results),
          timer: !this.state.timer,
          counter: 25
        })
        break
      default:
        return (
          null
        )
    }

    this.SoundPlay(OminousDrums)

    setTimeout(() => this.setState({ answersRandom: this.randomizeAnswers() }), 1000)
    this.setClock()
  }

  setClock = () => {
    setTimeout(() => {
      if (this.state.timer === true) {
        const startClock = setInterval(() => {
          if (this.state.counter <= 25 && this.state.counter > 0) {
            this.setState({ counter: this.state.counter - 1 })
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
    }, 1000)
  }

  randomQuestion = (triviasArray) => {
    const randomIndex = Math.floor(Math.random() * triviasArray.length)
    const question = triviasArray[randomIndex]
    return question
  }

  randomizeAnswers = () => {
    const incorrectAnswers = this.state.currentQuestion.incorrect_answers
    const correctAnswer = this.state.currentQuestion.correct_answer
    const answers = [...incorrectAnswers, correctAnswer]
    return answers.sort(() => Math.random() - 0.5)
  }

  clickedAnswer = (event) => {
    if (event.target.textContent === this.state.currentQuestion.correct_answer) {
      this.SoundPlay(Positive)
      if (this.state.playerTurn === true) {
        if (this.state.pawn1 === this.state.tiles[this.state.tiles.length - 1]) {
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
        if (this.state.pawn2 === this.state.tiles[this.state.tiles.length - 1]) {
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
      if (this.state.playerTurn === true) {
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

  displayVideo() {
    return (
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

  render() {
    Howler.volume(0.1)
    return (
      <div className="App">
        {this.displayVideo()}
        <Header />
        <Timer
          timer={this.state.timer}
          counter={this.state.counter}
        />
        <TriviaContainer
          currentQuestion={this.state.currentQuestion}
          isCorrect={this.state.isCorrect}
          clickedAnswer={this.clickedAnswer}
          timer={this.state.timer}
          answersRandom={this.state.answersRandom}
        />
        <DiePlayer
          timer={this.state.timer}
          clickDie={this.state.clickDie}
          dieValue={this.state.dieValue}
          dieClick={this.dieClick}
          playerWins={this.playerWins}
          hasWon={this.state.hasWon}
          playerTurn={this.state.playerTurn}
        />
        <GameBoard
          tiles={this.state.tiles}
          pawn1={this.state.pawn1}
          pawn2={this.state.pawn2}
        />
      </div>
    )
  }
}

export default App;
