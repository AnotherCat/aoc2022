import run from "aocrunner";

class MonkeyBase1 {
  name: string;
  yelled?: number;
  constructor(name: string, yelled?: number) {
    this.name = name;
    this.yelled = yelled;
  }
}

class MonkeyOperator1 extends MonkeyBase1 {
  operation: string; // (*/|-)
  firstGetYelledName: string;
  secondGetYelledName: string;
  monkeys: Record<string, MonkeyBase1 | MonkeyOperator1>;
  // firstGetYelledName (operation) secondGetYelledName
  constructor(
    name: string,
    operation: string,
    monkeys: Record<string, MonkeyBase1 | MonkeyOperator1>,
  ) {
    // operation (*/|-)
    super(name);
    // split operation
    const parts = operation.split(" ");
    this.operation = parts[1];
    this.firstGetYelledName = parts[0];
    this.secondGetYelledName = parts[2];
    this.monkeys = monkeys;
  }
  tryToYell() {
    const first = this.monkeys[this.firstGetYelledName];
    const second = this.monkeys[this.secondGetYelledName];
    if (first instanceof MonkeyOperator1 && first.yelled === undefined) {
      return false;
    }
    if (second instanceof MonkeyOperator1 && second.yelled === undefined) {
      return false;
    }
    if (this.operation === "+") {
      this.yelled = first.yelled! + second.yelled!;
    } else if (this.operation === "*") {
      this.yelled = first.yelled! * second.yelled!;
    } else if (this.operation === "-") {
      this.yelled = first.yelled! - second.yelled!;
    } else if (this.operation === "/") {
      this.yelled = first.yelled! / second.yelled!;
    }
  }
}

const parseInput1 = (rawInput: string) => {
  // name: name1 (operation) name2
  const lines = rawInput.split("\n");
  const monkeys: Record<string, MonkeyBase1 | MonkeyOperator1> = {};
  for (const line of lines) {
    const parts = line.split(": ");
    const name = parts[0];
    const operation = parts[1];
    if (isNaN(Number(operation))) {
      const monkey = new MonkeyOperator1(name, operation, monkeys);
      monkeys[name] = monkey;
    } else {
      const monkey = new MonkeyBase1(name, Number(operation));
      monkeys[name] = monkey;
    }
  }
  return monkeys;
};

const part1 = (rawInput: string) => {
  const monkeys = parseInput1(rawInput);
  // return the yelled value of the monkey named "root"
  const root = monkeys["root"] as MonkeyOperator1;
  while (root.yelled === undefined) {
    for (const monkey of Object.values(monkeys)) {
      if (monkey instanceof MonkeyOperator1) {
        monkey.tryToYell();
      }
    }
  }
  return root.yelled;
  ``;
};

class MonkeyBase2 {
  name: string;
  yelled?: number | string[];
  constructor(name: string, yelled?: number) {
    this.name = name;
    this.yelled = yelled;
  }
}

class MonkeyOperator2 extends MonkeyBase2 {
  operation: string; // (*/|-)
  firstGetYelledName: string;
  secondGetYelledName: string;
  monkeys: Record<string, MonkeyBase2 | MonkeyOperator2>;
  // firstGetYelledName (operation) secondGetYelledName
  constructor(
    name: string,
    operation: string,
    monkeys: Record<string, MonkeyBase2 | MonkeyOperator2>,
  ) {
    // operation (*/|-)
    super(name);
    // split operation
    const parts = operation.split(" ");
    this.operation = name === "root" ? "=" : parts[1];
    this.firstGetYelledName = parts[0];
    this.secondGetYelledName = parts[2];
    this.monkeys = monkeys;
  }
  tryToYell() {
    if (this.yelled !== undefined) {
      return;
    }
    const first = this.monkeys[this.firstGetYelledName];
    const second = this.monkeys[this.secondGetYelledName];
    if (first.yelled === undefined) {
      return false;
    }
    if (second.yelled === undefined) {
      return false;
    }
    if (
      Array.isArray(first.yelled as number) &&
      Array.isArray(second.yelled as number)
    ) {
      throw new Error("NOPE"); // I'm going off the assumption they do not crossover
    }
    if (Array.isArray(first.yelled as number)) {
      this.yelled = first.yelled as string[];
      this.yelled.push(`${this.operation} ${second.yelled}`);
    } else if (Array.isArray(second.yelled as number)) {
      this.yelled = second.yelled as string[];
      this.yelled.push(`${first.yelled} ${this.operation}`);
    } else {
      if (this.operation === "+") {
        this.yelled = (first.yelled as number) + (second.yelled as number);
      } else if (this.operation === "*") {
        this.yelled = (first.yelled as number) * (second.yelled as number);
      } else if (this.operation === "-") {
        this.yelled = (first.yelled as number) - (second.yelled as number);
      } else if (this.operation === "/") {
        this.yelled = (first.yelled as number) / (second.yelled as number);
      }
    }
  }
}

const parseInput2 = (rawInput: string) => {
  // name: name1 (operation) name2
  const lines = rawInput.split("\n");
  const monkeys: Record<string, MonkeyBase2 | MonkeyOperator2> = {};
  for (const line of lines) {
    const parts = line.split(": ");
    const name = parts[0];
    const operation = parts[1];
    if (isNaN(Number(operation))) {
      const monkey = new MonkeyOperator2(name, operation, monkeys);
      monkeys[name] = monkey;
    } else if (name === "humn") {
      const monkey = new MonkeyOperator2(name, ``, monkeys);
      monkey.yelled = [];
      monkeys[name] = monkey;
    } else {
      const monkey = new MonkeyBase2(name, Number(operation));
      monkeys[name] = monkey;
    }
  }

  return monkeys;
};

const part2 = (rawInput: string) => {
  const monkeys = parseInput2(rawInput);
  const root = monkeys["root"] as MonkeyOperator2;
  while (root.yelled === undefined) {
    for (const monkey of Object.values(monkeys)) {
      if (monkey instanceof MonkeyOperator2) {
        monkey.tryToYell();
      }
    }
  }
  // root.yelled will be an array of strings like ["+ 5", "* 2", "- 1", "/ 2"]
  // we need to go over them in reverse so that the last equality check is correct
  const steps = root.yelled as string[];
  let endStep = steps[steps.length - 1];
  let value = Number(endStep.split(" ")[1]);
  for (let i = steps.length - 2; i >= 0; i--) {
    if (value > Number.MAX_SAFE_INTEGER) {
    }
    const step = steps[i];
    const parts = step.split(" ");
    const part1 = parts[0];
    const part2 = parts[1];
    if (part1 === "+") {
      value = value - Number(part2);
    } else if (part1 === "*") {
      value = value / Number(part2);
    } else if (part1 === "-") {
      value = value + Number(part2);
    } else if (part1 === "/") {
      value = value * Number(part2);
    }
    // Now it's [num op]
    else if (part2 === "+") {
      value = value - Number(part1);
    } else if (part2 === "-") {
      value = Number(part1) - value;
    } else if (part2 === "*") {
      value = value / Number(part1);
    } else if (part2 === "/") {
      value = Number(part1) / value;
    }
  }
  return value;
};

run({
  part1: {
    tests: [
      {
        input: `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`,
        expected: 152,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`,
        expected: 301,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
