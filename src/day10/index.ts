import run from "aocrunner";
import p from "prompt-sync";
const prompt = p();

enum StepType {
  CMD,
  SKIP,
}

interface Step {
  type: StepType;
  amount?: number;
}

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((line) => {
    const [type, rawValue] = line.split(" ");

    return {
      type: type === "addx" ? StepType.CMD : StepType.SKIP,
      amount: rawInput ? Number(rawValue) : undefined,
    };
  });
};

interface Command {
  executeAt: number;
  execute?: () => void;
}

const part1 = (rawInput: string) => {
  const steps = parseInput(rawInput);
  let x = 1;
  let stepIndex = 0;
  let currentCommand: Command | undefined = undefined;
  let numbers: number[] = [];
  for (let cycleCount = 1; cycleCount <= 220; cycleCount++) {
    if (!currentCommand) {
      const cmd = steps[stepIndex];
      stepIndex++;
      if (cmd.type === StepType.CMD) {
        currentCommand = {
          executeAt: cycleCount + 1,
          execute: () => {
            x += cmd.amount ?? 0;
          },
        };
      } else {
        currentCommand = {
          executeAt: cycleCount,
        };
      }
    }
    //console.log(x, stepIndex, cycleCount);
    //console.log(currentCommand?.executeAt === cycleCount);
    if (
      cycleCount === 20 ||
      cycleCount === 60 ||
      cycleCount === 100 ||
      cycleCount === 140 ||
      cycleCount === 180 ||
      cycleCount === 220
    ) {
      //console.log(x, cycleCount, stepIndex);
      numbers.push(x * cycleCount);
    }
    if (currentCommand && currentCommand.executeAt === cycleCount) {
      if (currentCommand.execute) {
        currentCommand.execute();
      }
      currentCommand = undefined;
    }
    if (!currentCommand) {
      const cmd = steps[stepIndex];
      stepIndex++;
      if (cmd.type === StepType.CMD) {
        currentCommand = {
          executeAt: cycleCount + 2,
          execute: () => {
            x += cmd.amount ?? 0;
          },
        };
      } else {
        currentCommand = {
          executeAt: cycleCount + 1,
        };
      }
    }
  }
  //console.log(numbers);
  return numbers.reduce((pre, cur) => {
    return pre + cur;
  }, 0);
};

const part2 = (rawInput: string) => {
  const steps = parseInput(rawInput);
  const drawing: string[] = [];
  let x = 1;
  let stepIndex = 0;
  let currentCommand: Command | undefined = undefined;
  for (let cycleCount = 1; cycleCount <= 240; cycleCount++) {
    if (!currentCommand) {
      const cmd = steps[stepIndex];
      stepIndex++;
      if (cmd !== undefined) {
        if (cmd.type === StepType.CMD) {
          currentCommand = {
            executeAt: cycleCount + 1,
            execute: () => {
              x += cmd.amount ?? 0;
            },
          };
        } else {
          currentCommand = {
            executeAt: cycleCount,
          };
        }
      }
    }
    const spriteStartPos = x;
    const spriteEndPos = x + 2;
    //console.log(x, cycleCount);
    if (cycleCount % 40 >= spriteStartPos && cycleCount % 40 <= spriteEndPos) {
      drawing.push("#");
    } else {
      drawing.push(".");
    }
    //console.log(x, stepIndex, cycleCount);
    //console.log(currentCommand?.executeAt === cycleCount);

    if (currentCommand && currentCommand.executeAt === cycleCount) {
      if (currentCommand.execute) {
        currentCommand.execute();
      }
      currentCommand = undefined;
    }
  }
  //console.log(JSON.stringify(drawing));

  const parsedDrawing = [
    drawing.slice(0, 40).join(""),
    drawing.slice(40, 80).join(""),
    drawing.slice(80, 120).join(""),
    drawing.slice(120, 160).join(""),
    drawing.slice(160, 200).join(""),
    drawing.slice(200).join(""),
  ];
  console.log(parsedDrawing.join("\n"));
  const answer = prompt("What do you see? ");
  return answer;
};

run({
  part1: {
    tests: [
      /*       {
        input: `noop
addx 3
addx -5`,
        expected: 13140,
      }, */
      {
        input: `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
        expected: `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
