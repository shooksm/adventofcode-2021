const fs = require('fs');

const input = fs.readFileSync('./input.txt');
// const example = fs.readFileSync('./example.txt');

const convertToCommandObjects = (buffer) =>
  buffer
    .toString()
    .split(/\n/)
    .map((cmd) => cmd.match(/(?<command>\w+)\s(?<velocity>\d+)/).groups);

const followPart1Instructions = (acc, current) => ({
  ...acc,
  ...(current.command === 'forward'
    ? { hPos: acc.hPos + +current.velocity }
    : {}),
  ...(current.command === 'down'
    ? { depth: acc.depth + +current.velocity }
    : {}),
  ...(current.command === 'up' ? { depth: acc.depth - +current.velocity } : {}),
});

const part1Result = convertToCommandObjects(input).reduce(
  followPart1Instructions,
  {
    hPos: 0,
    depth: 0,
  }
);

const followPart2Instructions = (acc, current) => ({
  ...acc,
  ...(current.command === 'forward'
    ? {
        hPos: acc.hPos + +current.velocity,
        depth: acc.depth + acc.aim * +current.velocity,
      }
    : {}),
  ...(current.command === 'down' ? { aim: acc.aim + +current.velocity } : {}),
  ...(current.command === 'up' ? { aim: acc.aim - +current.velocity } : {}),
});

const part2Result = convertToCommandObjects(input).reduce(
  followPart2Instructions,
  {
    hPos: 0,
    depth: 0,
    aim: 0,
  }
);

console.log('Part 1', part1Result.hPos * part1Result.depth);

console.log('Part 2', part2Result.hPos * part2Result.depth);
