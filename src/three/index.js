const fs = require('fs');

const input = fs.readFileSync('./input.txt');
// const example = fs.readFileSync('./example.txt');

const convertToDiagnosticReport = (buffer) =>
  buffer
    .toString()
    .split(/\n/)
    .map((line) => line.split('').map((i) => +i));

const sumReport = (acc, current, rowIdx, data) =>
  (rowIdx === 0 ? Array(data[0].length).fill(0) : acc).map(
    (val, idx) => val + current[idx]
  );

const convertToRates = (acc, current) => [
  acc[0].concat(current),
  acc[1].concat(1 - current),
];

const diagnosticReport = convertToDiagnosticReport(input);

let oxygenGeneratorRating = JSON.parse(JSON.stringify(diagnosticReport));
let carbonDioxideScrubberRating = JSON.parse(JSON.stringify(diagnosticReport));

for (let idx = 0; idx < diagnosticReport[0].length; idx++) {
  if (oxygenGeneratorRating.length !== 1) {
    const significantBit = oxygenGeneratorRating.map((x) => x[idx]).reduce();
    oxygenGeneratorRating = oxygenGeneratorRating.filter(
      (val) => val[idx] === significantBit
    );
  }
  if (carbonDioxideScrubberRating.length !== 1) {
    carbonDioxideScrubberRating = carbonDioxideScrubberRating.filter(
      (val) => val[idx] === 0
    );
  }
}

console.log(
  'Part 1',
  diagnosticReport
    .reduce(sumReport, [])
    .map((val) => Math.round(val / diagnosticReport.length))
    .reduce(convertToRates, ['', ''])
    .map((val) => parseInt(val, 2))
    .reduce((acc, current) => acc * current, 1)
);

// console.log(
//   'Part 2',
//   diagnosticReport.reduce((acc) => {}, {})
// );
