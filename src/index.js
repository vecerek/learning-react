import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function HistoryToggle(props) {
  return (
    <button asc={props.asc} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function Square(props) {
  return (
    <button className={`square${props.winner ? ' winner':''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square 
             key={"col-" + i}
             value={this.props.squares[i]}
             onClick={() => this.props.onClick(i)}
             winner={this.props.winnerSquares.includes(i)}
           />;
  }

  renderRow(i) {
    return <div className="board-row" key={"row-" + i}>
             {
               [0, 1, 2].map((j) => {
                 let val = i*3 + j;
                 return (this.renderSquare(val));
               })
             }
           </div>
  }

  render() {
    return (
      <div>
        {
          [0, 1, 2].map((i) => {
            return (this.renderRow(i));
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      historyAsc: true,
      stepNumber: 0,
      xIsNext: true
    };
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

        return lines[i].concat([squares[a]]);
      }
    }
    return null;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          markedField: `(${~~(i / 3) + 1}, ${i % 3 + 1})`,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleHistoryOrder() {
    this.setState({
      historyAsc: !this.state.historyAsc
    })
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerSquares = this.calculateWinner(current.squares);
    const winner = winnerSquares == null ? null : winnerSquares.pop();

    let moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move}, location: ${step.markedField}` :
        "Go to game start";
      return (
        <li key={move}>
          <button 
            className={step == current ? 'current-move':''}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    if (!this.state.historyAsc) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winnerSquares={winnerSquares || []}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            Change order: 
            <HistoryToggle
              asc={this.state.historyAsc}
              value={this.state.historyAsc ? '▼' : '▲'}
              onClick={() => this.handleHistoryOrder()}
            />
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
