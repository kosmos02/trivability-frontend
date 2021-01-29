# TrivAbility #

![TrivAbility](https://i.ibb.co/wCNSRXF/Screen-Shot-2021-01-29-at-9-55-23-AM.png "TrivAbility")

This is a Trivia Game similar to Trivia Pursuit I created with a Ruby on Rails backe-end and a React frontend.

https://github.com/kosmos02/trivability-backend

## Technologies Used ##

* Ruby on Rails back-end
* React frontend
* HTML, Javascript, CSS
* Howler.js
* React-Dom-Confetti.js

## Startup ##

* Fork and clone GitHub repos, front and backend
* Open terminal of choice and and use 'git clone (repo)', then open it in your code editor of choice
* On the backend, run bundle update to update/install gems
* Run 'rails db:seed' and 'rails db:migrate' then run 'rails s' on the backend
* Use 'npm install' command and then 'npm start' on the front-end

## How to Play ##

* The game starts off with Player 1's turn. Player 1 click on the die to roll it. A number is displayed. Click the die again to move your game piece that many spaces on the game board.
* A trivia question with answers will display. Pick the answer you think is correct. Afterwards, it is now the next player's turn to go. Note, if the answer you picked is incorrect, on your next turn you will not be able to move any spaces.
* If you answer the final question correctly, the player wins the game and is you are able to play the game again from the beginning if you want.

## Code Examples ##

I used componentDidUpdate to play certain sounds that needed to be played when something specific changed in state
```
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
```
I used Howler.js to play sounds upon a click event or when something changed in componentDidMount

```
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
```
  I used this code to figure out if the game piece is on the final game board tile

```
  pawnMove = () => {
    if (this.state.playerTurn === true) {
      if (typeof this.state.tiles[this.state.tiles.indexOf(this.state.pawn1) + this.state.dieValue] !== 'undefined') {
        this.setState({
          pawn1: this.state.tiles[this.state.tiles.indexOf(this.state.pawn1) + this.state.dieValue]
        })
        setTimeout(() => this.newQuestion(this.state.pawn1), 1000)
      }
      else {
        this.setState({
          pawn1: this.state.tiles[this.state.tiles.length - 1]
        }
        )
        this.newQuestion(this.state.pawn1)
      }
    }
```
This code I used in a function to display the clock and count it down by seconds

```
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
```

## Demo ##

## Contributors ##

### Alexander Gabriel - on GitHub: @kosmos02

