import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={{"color": props.highlight && props.highlight.indexOf(props.index) > -1 ? "red":"black"}}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let win = calculateWinner(this.props.squares);
    return (
      <Square
		value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={win}
        index={i}
      />
    );
  }

  createSquares() {
	  let rows = [];
	  for(var i = 0; i < 3; i++){
		let squares = [];
		for(var j = 0; j < 3; j++){
		  squares.push(this.renderSquare(3*i+j));
		}
		rows.push(<div className="board-row">{squares}</div>);
	  }
	  return rows;
  }

  render() {
	return (
	<div>
		{this.createSquares()}
	</div>
	);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          latestMove: Array(9).fill(null),
          styles: Array(9).fill("black"),
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      selectedIndex: -1,
	  order: 1,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const latestMove = current.latestMove;
    const styles = current.styles;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    latestMove[history.length-1] = i;
    this.setState({
      history: history.concat([
        {
          squares: squares,
          latestMove: latestMove,
          styles: styles,
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
      selectedIndex: step,
    });
  }

  swapOrder(){
    const order = this.state.order;
	this.setState({
	  order: -order,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const latestMove = current.latestMove;
    const styles = current.styles;
    const moves = history.map((step, move) => {
    let x = 1 + parseInt(latestMove[move-1] / 3, 10);
    let y = 1 + latestMove[move-1] % 3;
    let desc = move ?
        'Move #' + move + ": ("+ x +", "+ y + ")" :
        'Start';
    return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={{fontWeight: this.state.selectedIndex!==move ? 'normal':'bold'}}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + current.squares[winner[0]];
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      if(this.state.stepNumber===9)
          status = "Draw!";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.swapOrder()}>{this.state.order > 0 ? "^" : "v"}</button></div>
		  <ol>{this.state.order > 0 ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let row = []
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      row = row.concat([a,b,c]);
    }
  }
  if(row.length===0)
    return null;
  return row;
}
