import React, { Component } from 'react'
import './App.css';

class App extends Component {
  state={
    tiles: [],
    redTiles: [],
    blueTiles: [],
    yellowTiles: [],
    greenTiles: [],

    redQuestions: [],
    blueQuestions: [],
    yellowQuestions: [],
    greenQuestions: [],
  }

  componentDidMount(){
    fetch('http://localhost:3000/tiles')
      .then(response => response.json())
      .then(tiles => {
        this.setState({tiles})
        tiles.map(tile => (
          // if (tile.color === 'red'){}
            this.setState({tiles})
        ))
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
      <div value={tile.id} className={[tile.color, "tile"].join(' ')}></div>
    ))
  }

  render(){
    return (
      <div className="App">
        <header><h1>Trivia Pursuit</h1></header>
        <div id="trivia-display"><h2>Trivia Display</h2></div>
        <div id="game-board" >
          {this.showTiles()}
        </div>
      </div>
    )
  }
  
}

export default App;
