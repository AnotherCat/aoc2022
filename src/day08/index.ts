import run from "aocrunner";
interface Tree {
  height: number;
  visible: boolean;
  scenicScore?: number;
  l?: number;
  r?: number;
  t?: number;
  b?: number;
}

const parseInput = (rawInput: string) => {
  const rows: Tree[][] = [];
  const lines = rawInput.split("\n");
  lines.forEach((line, rowIndex) => {
    const trees = line.split("");
    rows[rowIndex] = [];
    trees.forEach((tree, colIndex) => {
      rows[rowIndex][colIndex] = {
        height: Number(tree),
        visible: false,
      };
    });
  });
  return rows;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  input.forEach((row) => {
    let maxLeft = -1;
    let maxRight = -1;
    for (let index = 0; index < row.length; index++) {
      const treeL = row[index];
      const treeR = row[row.length - 1 - index];
      if (treeL.height > maxLeft) {
        treeL.visible = true;
        maxLeft = treeL.height;
      }
      if (treeR.height > maxRight) {
        treeR.visible = true;
        maxRight = treeR.height;
      }
      if (maxLeft === 9 && maxRight === 9) {
        break;
      }
    }
  });
  const colCount = input[0].length;
  for (let index = 0; index < colCount; index++) {
    let maxT = -1;
    let maxB = -1;
    for (let rowIndex = 0; rowIndex < input.length; rowIndex++) {
      const treeT = input[rowIndex][index];
      const treeB = input[input.length - rowIndex - 1][index];
      if (treeT.height > maxT) {
        treeT.visible = true;
        maxT = treeT.height;
      }
      if (treeB.height > maxB) {
        treeB.visible = true;
        maxB = treeB.height;
      }
      if (maxB === 9 && maxT === 9) {
        break;
      }
    }
  }
  let count = 0;
  input.forEach((row) => {
    row.forEach((tree) => {
      if (tree.visible) {
        count++;
      }
    });
  });
  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  input.forEach((row, rowIndex) => {
    row.forEach((tree, colIndex) => {
      let distU = 0;
      let distD = 0;
      let distR = 0;
      let distL = 0;
      for (let index = rowIndex - 1; index >= 0; index--) {
        const testTree = input[index][colIndex];
        distU++;
        if (testTree.height >= tree.height) {
          break;
        }
      }
      for (let index = rowIndex + 1; index < input.length; index++) {
        const testTree = input[index][colIndex];
        distD++;
        if (testTree.height >= tree.height) {
          break;
        }
      }
      for (let index = colIndex - 1; index >= 0; index--) {
        const testTree = row[index];
        distL++;
        if (testTree.height >= tree.height) {
          break;
        }
      }
      for (let index = colIndex + 1; index < row.length; index++) {
        const testTree = row[index];
        distR++;
        if (testTree.height >= tree.height) {
          break;
        }
      }
      tree.scenicScore = distU * distD * distR * distL;
    });
  });
  let maxScore = 0;
  input.forEach((row) => {
    row.forEach((tree) => {
      if (tree.scenicScore && tree.scenicScore > maxScore) {
        maxScore = tree.scenicScore;
      }
    });
  });
  return maxScore;
};

run({
  part1: {
    tests: [
      {
        input: `30373
25512
65332
33549
35390`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `30373
25512
65332
33549
35390`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
