import React from 'react'

const cellSize = 30
const numberSize = 30

class Picross extends React.Component {
  state = {
    data: [[]],
    rowsNumbers: [],
    colsNumbers: [],
    marginLeft: 100,
    marginTop: 100,
    rowsSize: 0,
    cursorX: 0,
    cursorY: 0,
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown)
    // TODO: document.addEventListener("keyup", this.handleKeyUp)

    const rowsNumbers = this.calculateRowsNumbers()
    const colsNumbers = this.calculateColsNumbers()

    const rowsSize = this.getMaxList(rowsNumbers)
    const colsSize = this.getMaxList(colsNumbers)

    this.setState({
      data: this.copyData(this.props.data, true),
      rowsNumbers,
      colsNumbers,
      rowsSize,
      colsSize,
      marginLeft: rowsSize * numberSize,
      marginTop: colsSize * cellSize,
    })
  }

  render() {
    return (
      <svg width={this.getSvgWidth()} height={this.getSvgHeight()}>
        {this.renderRowsNumbers()}
        {this.renderColsNumbers()}
        {this.state.data.map((row, y) => this.renderRow(y, row))}
      </svg>
    )
  }

  renderRowsNumbers = () => {
    return this.state.rowsNumbers.map((row, rowIndex) => {
      return row.map((number, i) =>
        <text key={`row-${rowIndex}-${i}`}
              fontSize={numberSize}
              x={(this.state.rowsSize - (row.length - i)) * numberSize}
              y={this.state.marginTop + rowIndex * cellSize + (cellSize - 20) / 2}
              fill="black">
          {number}
        </text>
      )
    })
  }

  renderColsNumbers = () => {
    return this.state.colsNumbers.map((col, colIndex) => {
      return col.map((number, i) =>
        <text key={`col-${colIndex}-${i}`}
              fontSize={numberSize}
              y={(this.state.colsSize - (col.length - i)) * numberSize}
              x={this.state.marginLeft + colIndex * cellSize + (cellSize - 20) / 2}
              fill="black">
          {number}
        </text>
      )
    })
  }

  renderRow = (y, row) => {
    return row.map((cell, x) =>
      <rect
        key={y * this.state.data.length + x}
        style={{
          stroke: this.isCursorOn(x, y) ? 'white' : 'black',
          strokeWidth: this.isCursorOn(x, y) ? 2 : 1,
        }}
        onClick={() => this.toggleCell(x, y)}
        onContextMenu={(e) => {e.preventDefault(); this.discardCell(x, y)}}
        y={this.state.marginTop + y * cellSize} x={this.state.marginLeft + x * cellSize}
        width={cellSize} height={cellSize}
        fill={getColor(this.state.data[y][x])} />
    )
  }

  handleKeyDown = (e) => {
    // left: 39
    // right: 37
    // up: 38
    // down: 40
    // z: 90
    // x: 88

    switch (e.keyCode) {
      case 90:
        return this.toggleCell(this.state.cursorX, this.state.cursorY)
      case 88:
        return this.discardCell(this.state.cursorX, this.state.cursorY)
      case 39:
        return this.moveCursor(1, 0)
      case 37:
        return this.moveCursor(-1, 0)
      case 40:
        return this.moveCursor(0, 1)
      case 38:
        return this.moveCursor(0, -1)
      default:
        break
    }
  }

  moveCursor = (dx, dy) => {
    this.setState({
      cursorX: mod(this.state.cursorX + dx, this.state.data[0].length),
      cursorY: mod(this.state.cursorY + dy, this.state.data.length),
    })
  }

  discardCell = (x, y) => {
    let data = this.copyData(this.state.data)
    data[y][x] = data[y][x] < 2 ? 2 : 0

    this.setState({
      data
    })
  }

  toggleCell = (x, y) => {
    let data = this.copyData(this.state.data)
    data[y][x] = data[y][x] > 0 ? 0 : 1

    this.setState({
      data
    })
  }

  calculateNumbers = (line) => {
    let numbers = []
    let continuous = 0

    for (let cell of line) {
      if (cell) {
        continuous += 1
      } else {
        if (continuous > 0) {
          numbers.push(continuous)
          continuous = 0
        }
      }
    }

    if (continuous > 0) {
      numbers.push(continuous)
    }

    return numbers
  }

  copyData = (data, falseToAll) => {
    let newData = []

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      newData.push([])

      for (let colIndex = 0; colIndex < data[0].length; colIndex++) {
        newData[rowIndex].push(falseToAll ? 0 : data[rowIndex][colIndex])
      }
    }

    return newData
  }

  calculateRowsNumbers = () => {
    let rowsNumbers = []

    for (let rowIndex = 0; rowIndex < this.props.data.length; rowIndex++) {
      let row = this.props.data[rowIndex]
      rowsNumbers.push(this.calculateNumbers(row))
    }

    return rowsNumbers
  }

  calculateColsNumbers = () => {
    let colsNumbers = []

    for (let colIndex = 0; colIndex < this.props.data[0].length; colIndex++) {
      // construct column.
      let col = []

      for (let rowIndex = 0; rowIndex < this.props.data.length; rowIndex++) {
        col.push(this.props.data[rowIndex][colIndex])
      }

      colsNumbers.push(this.calculateNumbers(col))
    }

    return colsNumbers
  }

  getSvgWidth = () => {
    return this.state.marginLeft + this.props.data[0].length * cellSize
  }

  getSvgHeight = () => {
    return this.state.marginTop + this.props.data.length * cellSize
  }

  getMaxList = (listOfLists) => {
    let max = 0

    for (let size of listOfLists.map(list => list.length)) {
      if (size > max) {
        max = size
      }
    }

    return max
  }

  isCursorOn = (x, y) => {
    return this.state.cursorX === x && this.state.cursorY === y
  }
}

const mod = (x, y) => {
  return ((x % y) + y) % y
}

const getColor = (value) => {
  if (value === 1) {
    return '#BBC42A'
  } else if (value === 2) {
    return '#06101d'
  } else {
    return '#ED6E46'
  }
}

export default Picross
