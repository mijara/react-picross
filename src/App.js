import React, { Component } from 'react'
import './App.css'
import Picross from './components/Picross'


const data = [
  [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1],
  [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
  [0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
]

class App extends Component {
  render() {
    return (
      <div style={{textAlign: 'center', marginTop: 100}}>
        <Picross data={data}/>
      </div>
    )
  }
}

export default App
