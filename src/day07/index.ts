import run from "aocrunner";

interface File {
  type: "file";
  size: number;
}
interface Directory {
  type: "dir";
  size?: number;
  hasDirs?: true;
  contents: Contents;
  upperPath: string;
  name: string;
}

interface Contents {
  [name: string]: Directory | File;
}
let numdirs = 0;

const parseInput = (rawInput: string) => {
  let position: string[] = [];
  const lines = rawInput.split("\n");
  let listing = false;
  const data: Directory = {
    type: "dir",
    contents: {},
    name: "/",
    upperPath: "",
  };
  //console.log(listing);
  lines.forEach((line) => {
    //console.log(line, listing, JSON.stringify(position));
    if (line.startsWith("$")) {
      // command
      if (listing) {
        listing = false;
      }
      if (line.startsWith("$ cd")) {
        const to = line.replace("$ cd ", "");
        if (to === "/") {
          position = [];
        } else if (to === "..") {
          position.pop();
        } else {
          position.push(to);
        }
      } else if (line.startsWith("$ ls")) {
        listing = true;
      }
    } else if (listing) {
      // These lines are file listings
      const [sizeOrType, name] = line.split(" ");
      if (sizeOrType === "dir") {
        // directory
        let currentDirObject: Directory = data;
        if (position.length === 0) {
          data.hasDirs = true;
          if (data.contents[name] !== undefined) console.log("FUCK");
          numdirs++;
          data.contents[name] = {
            type: "dir",
            contents: {},
            upperPath: "/",
            name,
          };
        } else {
          let currthingy: string[] = [];
          position.forEach((pos) => {
            currthingy.push(pos);
            if (currentDirObject.contents[pos] === undefined) {
              currentDirObject.hasDirs = true;
              numdirs++;
              currentDirObject.contents[pos] = {
                type: "dir",
                contents: {},
                upperPath: currthingy.join("-"),
                name: pos,
              };
            }
            const next = currentDirObject.contents[pos];
            if (next.type !== "dir") {
              throw new Error("FILE AS DIR");
            }
            currentDirObject = next;
          });
          currentDirObject.hasDirs = true;
          if (currentDirObject.contents[name] !== undefined)
            console.log("FUCK");

          numdirs++;
          currentDirObject.contents[name] = {
            type: "dir",
            contents: {},
            upperPath: position.join("-"),
            name,
          };
        }
      } else {
        const size = Number(sizeOrType);
        let currentDirObject: Directory = data;
        if (position.length === 0) {
          data.contents[name] = {
            type: "file",
            size,
          };
        } else {
          let currthingy: string[] = [];
          position.forEach((pos) => {
            currthingy.push(pos);
            if (currentDirObject.contents[pos] === undefined) {
              numdirs++;
              currentDirObject.contents[pos] = {
                type: "dir",
                contents: {},
                upperPath: currthingy.join("-"),
                name: pos,
              };
            }
            const next = currentDirObject.contents[pos];
            if (next.type !== "dir") {
              throw new Error("FILE AS DIR");
            }
            currentDirObject = next;
          });
          currentDirObject.contents[name] = {
            type: "file",
            size,
          };
        }
      }
    }
  });
  return data;
};

const newParseInput = (rawInput: string) => {};

const part1 = (rawInput: string) => {
  const dirSizes: number[] = [];
  const secondDirSizes: { [name: string]: number } = {};
  const calcDirSizes = (dir: Directory): number => {
    let size = 0;
    let fileSize = 0;
    let dirSizettt = 0;

    for (const key in dir.contents) {
      if (Object.prototype.hasOwnProperty.call(dir.contents, key)) {
        const item = dir.contents[key];
        //console.log(key, item);
        if (item.type === "file") {
          size += item.size;
          fileSize += item.size;
        } else {
          //console.log("dir");
          //console.log("calculating", item.name);
          const dirSize = calcDirSizes(item);
          //console.log("calculated", item.name, dirSize);
          dirSizes.push(dirSize);
          secondDirSizes[`${item.upperPath}-${item.name}`] = dirSize;
          item.size = dirSize;
          size += dirSize;
          dirSizettt += dirSize;
        }
      }
    }
    //console.log(dir.name, fileSize, dirSizettt);
    //console.log("-------------");
    return size;
  };
  const input = parseInput(rawInput);
  const result = calcDirSizes(input);
  /*console.log(numdirs);
  console.log(dirSizes.length);
  console.log(dirSizes);
  console.log(Object.keys(secondDirSizes).length);
  console.log(secondDirSizes);*/
  let size = 0;
  for (const key in secondDirSizes) {
    if (Object.prototype.hasOwnProperty.call(secondDirSizes, key)) {
      const sized = secondDirSizes[key];
      if (sized <= 100000) {
        size += sized;
      }
    }
  }

  //console.log(JSON.stringify(input, undefined, 2));
  return size;
};

const part2 = (rawInput: string) => {
  const dirSizes: { [name: string]: number } = {};
  const calcDirSizes = (dir: Directory): number => {
    let size = 0;
    let fileSize = 0;
    let dirSizettt = 0;

    for (const key in dir.contents) {
      if (Object.prototype.hasOwnProperty.call(dir.contents, key)) {
        const item = dir.contents[key];
        //console.log(key, item);
        if (item.type === "file") {
          size += item.size;
          fileSize += item.size;
        } else {
          const dirSize = calcDirSizes(item);
          dirSizes[`${item.upperPath}-${item.name}`] = dirSize;
          item.size = dirSize;
          size += dirSize;
          dirSizettt += dirSize;
        }
      }
    }
    return size;
  };
  const input = parseInput(rawInput);
  const rootSize = calcDirSizes(input);
  const TOTAL = 70000000 - 30000000;
  const requiredDeleted = rootSize - TOTAL;
  let sizes = Object.values(dirSizes);
  sizes.push(rootSize);
  console.log(requiredDeleted);
  sizes = sizes.filter((size) => size >= requiredDeleted);
  sizes = sizes.sort((a, b) => a - b);
  return sizes[0];
};

run({
  part1: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
        expected: 95437,
      },
      {
        input: `$ cd /
$ ls
dir a
dir v
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
$ cd ..
$ cd a
$ cd e
$ cd d
$ ls
1112 b
172 c
$ cd ..
$ cd ..
$ cd ..
$ cd v
$ ls
11888 b
`,
        expected: 99289 + 11888,
      },
      {
        input: `$ cd /
$ ls
dir a
$ cd a
$ ls
dir a
2 a.txt
$ cd a
$ ls
99999 a.txt
`,
        expected: 99999,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
