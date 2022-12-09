import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // Rock scissors paper
  // Rock: A
  // Paper: B
  // scissors: C
  // Rock beats scissors
  // Paper beats rock
  // Scissors beats paper
  // If both players choose the same, it's a draw
  // Format of input is
  // opponent mychoice
  // oppent in the format A,B,C
  // mychoice in the format X,Y,Z
  // Rock: X
  // Paper: Y
  // Scissors: Z
  // scoreing:
  // Rock: 1
  // Paper 2
  // Scissors 3
  // Win: 6
  // Draw: 3
  // Lose: 0
  // Return the total score
  enum Move {
    Rock,
    Paper,
    Scissors,
  }
  function parseInputMove(char: string): Move {
    if (char === "A" || char === "X") {
      return Move.Rock;
    } else if (char === "B" || char === "Y") {
      return Move.Paper;
    } else if (char === "C" || char === "Z") {
      return Move.Scissors;
    } else {
      throw new Error(`Invalid type: ${char}`);
    }
  }
  const lines = input.split(/\n/);
  const score = lines.map((line) => {
    const inputs = line.split(" ");
    const theirInput = parseInputMove(inputs[0]);
    const myInput = parseInputMove(inputs[1]);
    const typeScore =
      myInput === Move.Rock ? 1 : myInput === Move.Paper ? 2 : 3;
    let winScore = 0;
    if (myInput === theirInput) {
      winScore = 3;
    } else {
      if (
        (myInput === Move.Paper && theirInput === Move.Rock) ||
        (myInput === Move.Rock && theirInput === Move.Scissors) ||
        (myInput === Move.Scissors && theirInput === Move.Paper)
      ) {
        winScore = 6;
      }
    }
    return winScore + typeScore;
  });
  const totalScore = score.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  return totalScore;
};

const part2 = (rawInput: string) => {
  enum Move {
    Rock,
    Paper,
    Scissors,
  }
  function parseInputMove(char: string): Move {
    if (char === "A" || char === "X") {
      return Move.Rock;
    } else if (char === "B" || char === "Y") {
      return Move.Paper;
    } else if (char === "C" || char === "Z") {
      return Move.Scissors;
    } else {
      throw new Error(`Invalid type: ${char}`);
    }
  }
  const input = parseInput(rawInput);
  const lines = input.split(/\n/);
  const score = lines.map((line) => {
    const inputs = line.split(" ");
    const theirInput = parseInputMove(inputs[0]);
    const myInputRAW = inputs[1];
    const requiredResult =
      myInputRAW === "X" ? "lose" : myInputRAW === "Y" ? "draw" : "win";

    let potentialMoves: { lose: Move; draw: Move; win: Move };
    const draw = theirInput;
    let lose: Move;
    let win: Move;
    if (theirInput === Move.Paper) {
      lose = Move.Rock;
      win = Move.Scissors;
    } else if (theirInput === Move.Rock) {
      lose = Move.Scissors;
      win = Move.Paper;
    } else {
      lose = Move.Paper;
      win = Move.Rock;
    }
    potentialMoves = {
      win,
      lose,
      draw,
    };
    function moveScore(move: Move): number {
      if (move === Move.Rock) {
        return 1;
      } else if (move === Move.Paper) {
        return 2;
      } else {
        return 3;
      }
    }
    if (requiredResult === "win") {
      return 6 + moveScore(potentialMoves.win);
    } else if (requiredResult === "draw") {
      return 3 + moveScore(potentialMoves.draw);
    } else {
      return moveScore(potentialMoves.lose);
    }
  });
  const totalScore = score.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  return totalScore;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
