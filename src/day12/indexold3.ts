import run from "aocrunner";

interface Pos {
  x: number;
  y: number;
}

const parseInput = (rawInput: string) => {
  const data: number[][] = [];
  let startIndex: Pos;
  let endIndex: Pos;
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

      return code - 96;
    });
  });

  return { data, startIndex, endIndex };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // Start location will be in the following format:
  // [distanceFromTop, distanceFromLeft]
  interface Location {
    distanceFromTop: number;
    distanceFromLeft: number;
    path: Pos[];
    status:
      | "Start"
      | "Goal"
      | "Valid"
      | "Unknown"
      | "Invalid"
      | "Blocked"
      | "Backtracking";
  }
  const findShortestPath = (
    startCoordinates: [number, number],
    grid: string[][],
  ) => {
    const distanceFromTop = startCoordinates[0];
    const distanceFromLeft = startCoordinates[1];

    // Each "location" will store its coordinates
    // and the shortest path required to arrive there
    const location: Location = {
      distanceFromTop: distanceFromTop,
      distanceFromLeft: distanceFromLeft,
      path: [],
      status: "Start",
    };

    // Initialize the queue with the start location already inside
    const queue: Location[] = [location];

    // Loop through the grid searching for the goal
    while (queue.length > 0) {
      // Take the first location off the queue
      const currentLocation = queue.shift()!;
      console.log(currentLocation);

      // Explore North
      let newLocation = exploreInDirection(currentLocation, "North", grid);
      console.log(
        "N",
        JSON.stringify(newLocation),
        newLocation.status !== "Invalid"
          ? grid[newLocation.distanceFromTop][newLocation.distanceFromLeft]
          : "",
      );
      if (newLocation.status === "Goal") {
        return newLocation.path;
      } else if (newLocation.status === "Valid") {
        queue.push(newLocation);
      }

      // Explore East
      newLocation = exploreInDirection(currentLocation, "East", grid);
      console.log(
        "E",
        JSON.stringify(newLocation),
        newLocation.status !== "Invalid"
          ? grid[newLocation.distanceFromTop][newLocation.distanceFromLeft]
          : "",
      );
      if (newLocation.status === "Goal") {
        return newLocation.path;
      } else if (newLocation.status === "Valid") {
        queue.push(newLocation);
      }

      // Explore South
      newLocation = exploreInDirection(currentLocation, "South", grid);
      console.log(
        "S",
        JSON.stringify(newLocation),
        newLocation.status !== "Invalid"
          ? grid[newLocation.distanceFromTop][newLocation.distanceFromLeft]
          : "",
      );
      if (newLocation.status === "Goal") {
        return newLocation.path;
      } else if (newLocation.status === "Valid") {
        queue.push(newLocation);
      }

      // Explore West
      newLocation = exploreInDirection(currentLocation, "West", grid);
      console.log(
        "W",
        JSON.stringify(newLocation),
        newLocation.status !== "Invalid"
          ? grid[newLocation.distanceFromTop][newLocation.distanceFromLeft]
          : "",
      );
      if (newLocation.status === "Goal") {
        return newLocation.path;
      } else if (newLocation.status === "Valid") {
        queue.push(newLocation);
      }
    }

    // No valid path found
    return false;
  };

  // This function will check a location's status
  // (a location is "valid" if it is on the grid, is not an "obstacle",
  // and has not yet been visited by our algorithm)
  // Returns "Valid", "Invalid", "Blocked", or "Goal"
  const locationStatus = (location: Location, grid: string[][]) => {
    const gridSize = grid.length;
    let dft = location.distanceFromTop;
    let dfl = location.distanceFromLeft;
    if (
      location.path.find((t) => {
        return t.x === dfl && t.y === dft;
      }) !== undefined
    ) {
      console.log(
        "+=======\n======================\n==================================",
      );
      return "Backtracking";
    }

    if (
      location.distanceFromLeft < 0 ||
      location.distanceFromLeft >= gridSize ||
      location.distanceFromTop < 0 ||
      location.distanceFromTop >= gridSize
    ) {
      // location is not on the grid--return false
      return "Invalid";
    } else if (grid[dft][dfl] === "Goal") {
      return "Goal";
    } else if (grid[dft][dfl] !== "Empty") {
      // location is either an obstacle or has been visited
      return "Blocked";
    } else {
      return "Valid";
    }
  };

  // Explores the grid from the given location in the given
  // direction
  const exploreInDirection = (
    currentLocation: Location,
    direction: "East" | "North" | "South" | "West",
    grid: string[][],
  ) => {
    var newPath = currentLocation.path.slice();

    let dft = currentLocation.distanceFromTop;
    let dfl = currentLocation.distanceFromLeft;

    if (direction === "North") {
      dft -= 1;
    } else if (direction === "East") {
      dfl += 1;
    } else if (direction === "South") {
      dft += 1;
    } else if (direction === "West") {
      dfl -= 1;
    }

    const newLocation: Location = {
      distanceFromTop: dft,
      distanceFromLeft: dfl,
      path: newPath,
      status: "Unknown",
    };
    newLocation.status = locationStatus(newLocation, grid);
    newPath.push({ x: dfl, y: dft });

    if (
      (newLocation.status === "Valid" || newLocation.status === "Goal") &&
      input.data[dft][dfl] >
        input.data[currentLocation.distanceFromTop][
          currentLocation.distanceFromLeft
        ] +
          1
    ) {
      newLocation.status = "Invalid";
    }

    // If this new location is valid, mark it as 'Visited'
    if (newLocation.status === "Valid") {
      //grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] =
      //"Visited";
    }

    return newLocation;
  };

  // OK. We have the functions we need--let's run them to get our shortest path!

  // Create a 4x4 grid
  // Represent the grid as a 2-dimensional array

  let grid: (string | number)[][] = input.data.slice();
  grid = grid.map((g) => {
    return g.map((a) => {
      return "Empty";
    });
  });

  // Think of the first index as "distance from the top row"
  // Think of the second index as "distance from the left-most column"

  // This is how we would represent the grid with obstacles above
  grid[input.startIndex.y][input.startIndex.x] = "Start";
  grid[input.endIndex.y][input.endIndex.x] = "Goal";
  console.log(grid);

  console.log(findShortestPath([0, 0], grid.slice() as string[][]));

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
Sabqponm
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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
