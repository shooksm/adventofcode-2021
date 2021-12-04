const fs = require('fs');

const data = fs.readFileSync('./data.txt');
// const example = fs.readFileSync('./example.txt');

const convertToNumericArray = (buffer) => buffer.toString().split(/\n/).map(v => +v);
const reduceIncreaseCount = (acc, current) => {
  let { previous, increaseCount } = acc;
  if (!!previous && current !== '' && +current > previous) increaseCount++;
  return { previous: current, increaseCount };
};

console.log(
  'Part 1',
  convertToNumericArray(data)
    .reduce(reduceIncreaseCount, { previous: undefined, increaseCount: 0 })
);

console.log(
  'Part 2',
  convertToNumericArray(data)
    .map((current, idx, arr) => {
      return current
        + (idx + 1 < arr.length ? arr[idx + 1] : 0)
        + (idx + 2 < arr.length ? arr[idx + 2] : 0);
    })
    .reduce(reduceIncreaseCount, { previous: undefined, increaseCount: 0 })
)
