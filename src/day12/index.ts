import run from "aocrunner";

import ExcelJS from "exceljs";

interface Pos {
  x: number;
  y: number;
}

interface DataPoint {
  height: number;
  distance?: number;
}

const parseInput = (rawInput: string) => {
  const data: DataPoint[][] = [];
  let startIndex: Pos | undefined;
  let endIndex: Pos | undefined;
  rawInput.split("\n").forEach((line, index) => {
    data[index] = line.split("").map((a, indexR) => {
      if (a === "S") {
        a = "a";
        startIndex = { x: indexR, y: index };
      } else if (a === "E") {
        a = "z";
        endIndex = { x: indexR, y: index };
      }
      const code = a.charCodeAt(0);

      return { height: code - 96, distance: undefined };
    });
  });

  if (!startIndex || !endIndex) {
    throw Error();
  }

  return { data, startIndex, endIndex };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const queue: Pos[] = [input.startIndex];

  const getPoint = (pos: Pos) => {
    return input.data[pos.y][pos.x];
  };

  while (true) {
    const currentPos = queue.shift();
    if (!currentPos) {
      break;
    }
    const currentPoint = getPoint(currentPos);
    if (currentPos.x > 0) {
      // can check to the left
      const newPos = { x: currentPos.x - 1, y: currentPos.y };
      const point = getPoint(newPos);
      if (!point.distance && point.height - currentPoint.height <= 1) {
        point.distance = (currentPoint.distance ?? 0) + 1;
        queue.push(newPos);
      }
    }
    if (currentPos.x < input.data[0].length - 1) {
      // can check to the right
      const newPos = { x: currentPos.x + 1, y: currentPos.y };
      const point = getPoint(newPos);
      if (!point.distance && point.height - currentPoint.height <= 1) {
        point.distance = (currentPoint.distance ?? 0) + 1;
        queue.push(newPos);
      }
    }
    if (currentPos.y > 0) {
      // can check up
      const newPos = { x: currentPos.x, y: currentPos.y - 1 };
      const point = getPoint(newPos);
      if (!point.distance && point.height - currentPoint.height <= 1) {
        point.distance = (currentPoint.distance ?? 0) + 1;
        queue.push(newPos);
      }
    }
    if (currentPos.y < input.data.length - 1) {
      // can check down
      const newPos = { x: currentPos.x, y: currentPos.y + 1 };
      const point = getPoint(newPos);
      if (!point.distance && point.height - currentPoint.height <= 1) {
        point.distance = (currentPoint.distance ?? 0) + 1;
        queue.push(newPos);
      }
    }
  }
  //console.log(input.data);

  return getPoint(input.endIndex).distance;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const queue: Pos[] = [input.endIndex];

  const getPoint = (pos: Pos) => {
    return input.data[pos.y][pos.x];
  };

  while (true) {
    const currentPos = queue.shift();
    if (!currentPos) {
      break;
    }
    const currentPoint = getPoint(currentPos);
    if (currentPos.x > 0) {
      // can check to the left
      const newPos = { x: currentPos.x - 1, y: currentPos.y };
      const point = getPoint(newPos);
      if (!point.distance && point.height - currentPoint.height >= -1) {
        point.distance = (currentPoint.distance ?? 0) + 1;
        queue.push(newPos);
      }
    }
    if (currentPos.x < input.data[0].length - 1) {
      // can check to the right
      const newPos = { x: currentPos.x + 1, y: currentPos.y };
      const point = getPoint(newPos);
      if (!point.distance && point.height - currentPoint.height >= -1) {
        point.distance = (currentPoint.distance ?? 0) + 1;
        queue.push(newPos);
      }
    }
    if (currentPos.y > 0) {
      // can check up
      const newPos = { x: currentPos.x, y: currentPos.y - 1 };
      const point = getPoint(newPos);
      if (!point.distance && point.height - currentPoint.height >= -1) {
        point.distance = (currentPoint.distance ?? 0) + 1;
        queue.push(newPos);
      }
    }
    if (currentPos.y < input.data.length - 1) {
      // can check down
      const newPos = { x: currentPos.x, y: currentPos.y + 1 };
      const point = getPoint(newPos);
      if (!point.distance && point.height - currentPoint.height >= -1) {
        point.distance = (currentPoint.distance ?? 0) + 1;
        queue.push(newPos);
      }
    }
  }
  const distances: number[] = [];
  input.data.forEach((row) => {
    row.forEach((point) => {
      if (point.height === 1 && point.distance !== undefined) {
        distances.push(point.distance);
      }
    });
  });
  console.log(distances);
  // EXCEL STUFF
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("new");
  input.data.forEach((row, index) => {
    const sheetRow = sheet.getRow(index + 1);
    sheetRow.values = row.map((r) => r.height);
    const distROw = sheet.getRow(index + 1 + 42);
    distROw.values = row.map((r) => r.distance);
  });
  workbook.xlsx.writeFile("newfile.xlsx");
  return Math.min.apply(Math, distances);
  //console.log(input.data);
  return getPoint(input.endIndex).distance;
};

run({
  part1: {
    tests: [
      {
        input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
