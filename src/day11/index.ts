import run from "aocrunner";

class Monkey {
  items: number[];
  dothingy: (x: number) => number;
  test: (x: number) => boolean;
  ifTrue: number;
  ifFalse: number;
  hasInspected = 0;
  constructor(
    items: number[],
    dothingy: (x: number) => number,
    test: (x: number) => boolean,
    ifTrue: number,
    ifFalse: number,
  ) {
    this.items = items;
    this.dothingy = dothingy;
    this.test = test;
    this.ifFalse = ifFalse;
    this.ifTrue = ifTrue;
  }
  catch(item: number) {
    this.items.push(item);
  }
  inspectAll() {
    //console.log("== new monkey ==");
    const itemsCopy = this.items.slice();
    itemsCopy.forEach((item) => {
      //console.log(`-- new item ${item}--`);
      item = this.dothingy(item);
      //console.log(item, "after inspect");
      item = Math.floor(item / 3);
      //console.log(item, "after dividing");
      const result = this.test(item);
      //console.log(result, "throwing to", result ? this.ifTrue : this.ifFalse);
      if (result) {
        monkeys[this.ifTrue].catch(item);
      } else {
        monkeys[this.ifFalse].catch(item);
      }
      this.items = this.items.slice(1);
      this.hasInspected++;
    });
  }
  inspectAll2() {
    //console.log("== new monkey ==");
    const itemsCopy = this.items.slice();
    itemsCopy.forEach((item) => {
      //console.log(`-- new item ${item}--`);
      item = this.dothingy(item);
      //if (Math.floor((item / 17) * 13 * 19 * 23) >= 2) {
      if (Math.floor(item / (3 * 5 * 2 * 19 * 13 * 11 * 17 * 7)) >= 2) {
        item = item % (3 * 5 * 2 * 19 * 13 * 11 * 17 * 7);
      }
      //console.log(item, "after inspect");
      const result = this.test(item);
      //console.log(result, "throwing to", result ? this.ifTrue : this.ifFalse);
      if (result) {
        monkeys[this.ifTrue].catch(item);
      } else {
        monkeys[this.ifFalse].catch(item);
      }
      this.items = this.items.slice(1);
      this.hasInspected++;
    });
  }
}

const monkeysA: Monkey[] = [
  new Monkey(
    [89, 84, 88, 78, 70],
    (x) => x * 5,
    (x) => x % 7 === 0,
    6,
    7,
  ),
  new Monkey(
    [76, 62, 61, 54, 69, 60, 85],
    (x) => x + 1,
    (x) => x % 17 === 0,
    0,
    6,
  ),
  new Monkey(
    [83, 89, 53],
    (x) => x + 8,
    (x) => x % 11 === 0,
    5,
    3,
  ),
  new Monkey(
    [95, 94, 85, 57],
    (x) => x + 4,
    (x) => x % 13 === 0,
    0,
    1,
  ),
  new Monkey(
    [82, 98],
    (x) => x + 7,
    (x) => x % 19 === 0,
    5,
    2,
  ),
  new Monkey(
    [69],
    (x) => x + 2,
    (x) => x % 2 === 0,
    1,
    3,
  ),
  new Monkey(
    [82, 70, 58, 87, 59, 99, 92, 65],
    (x) => x * 11,
    (x) => x % 5 === 0,
    7,
    4,
  ),
  new Monkey(
    [91, 53, 96, 98, 68, 82],
    (x) => x * x,
    (x) => x % 3 === 0,
    4,
    2,
  ),
];
/*

const monkeysA = [
  new Monkey(
    [79, 98],
    (x) => x * 19,
    (x) => x % 23 === 0,
    2,
    3,
  ),
  new Monkey(
    [54, 65, 75, 74],
    (x) => x + 6,
    (x) => x % 19 === 0,
    2,
    0,
  ),
  new Monkey(
    [79, 60, 97],
    (x) => x * x,
    (x) => x % 13 === 0,
    1,
    3,
  ),
  new Monkey(
    [74],
    (x) => x + 3,
    (x) => x % 17 === 0,
    0,
    1,
  ),
];*/

let monkeys = monkeysA.slice();

const parseInput = (rawInput: string) => {
  monkeys = monkeysA.slice();
  return monkeys;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  /*for (let index = 0; index < 10000; index++) {
    input.forEach((monkey) => {
      monkey.inspectAll();
    });
    /*console.log(
      input.map((mokey) => {
        return mokey.items;
      }),
    );*1/
  }
  //console.log(monkeys);
  var highest = 0;
  var secondHighest = 0;

  for (var i = 0; i < monkeys.length; i++) {
    // I added i declaration since I did not find where it was declared
    if (monkeys[i].hasInspected >= highest) {
      // >= in here, an explanation is above
      secondHighest = highest; // firstly, move the ex-highest to the second place
      highest = monkeys[i].hasInspected;
    } else if (
      monkeys[i].hasInspected > secondHighest &&
      monkeys[i].hasInspected < highest
    ) {
      secondHighest = monkeys[i].hasInspected;
    }
  }
  return highest * secondHighest;*/
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  for (let index = 0; index < 10000; index++) {
    input.forEach((monkey) => {
      monkey.inspectAll2();
    });
    /*console.log(
      input.map((mokey) => {
        return mokey.items;
      }),
    );*/
  }
  //console.log(monkeys);
  var highest = 0;
  var secondHighest = 0;

  for (var i = 0; i < monkeys.length; i++) {
    // I added i declaration since I did not find where it was declared
    if (monkeys[i].hasInspected >= highest) {
      // >= in here, an explanation is above
      secondHighest = highest; // firstly, move the ex-highest to the second place
      highest = monkeys[i].hasInspected;
    } else if (
      monkeys[i].hasInspected > secondHighest &&
      monkeys[i].hasInspected < highest
    ) {
      secondHighest = monkeys[i].hasInspected;
    }
  }
  console.log(monkeys);
  return highest * secondHighest;
};

run({
  part1: {
    tests: [
      /*{
        input: ``,
        expected: 10605,
      },*/
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
