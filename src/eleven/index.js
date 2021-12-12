// eslint-disable-next-line max-classes-per-file
const fs = require('fs');
const events = require('events');

// File Input

const input = fs.readFileSync('./input.txt');
// const example = fs.readFileSync('./example.txt');

// Classes

class StepEvents extends events.EventEmitter {
  #flashes = 0;

  constructor() {
    super();

    this.setMaxListeners(100);
  }

  incrementFlashes() {
    this.#flashes++;
  }

  toString() {
    return `Flashes: ${this.#flashes}`;
  }
}

class Octopi extends events.EventEmitter {
  #value = 0;

  #stepEvent = null;

  #haveFlashed = false;

  constructor(startingValue, stepEvent) {
    super();
    this.#value = +startingValue;
    this.#stepEvent = stepEvent;

    this.#stepEvent.on('step', () => {
      this.#haveFlashed = false;
      this.incrementValue();
    });
  }

  incrementValue() {
    if (!this.#haveFlashed) {
      this.#value++;

      if (this.#value > 9) {
        this.#value = 0;
        this.#haveFlashed = true;

        // Let the step know I flashed
        this.#stepEvent.incrementFlashes();

        // Let all my buddies that are around me know I flashed
        setImmediate(() => this.emit('flash'));
      }
    }
  }

  toNumber() {
    return this.#value;
  }

  toString() {
    return this.#value.toString(10);
  }
}

// Helper Methods

const convertToOctopusGrid = (buffer, stepEvent) =>
  buffer
    .toString()
    .split(/\n/)
    // First map to establish the Octopi
    .map((line) => line.split('').map((i) => new Octopi(i, stepEvent)))
    // Second map is to bind to adjacent Octopi flash events
    .map((line, y, octopusGrid) =>
      line.map((octopi, x) => {
        // Figure out bounds of adjacent octopi
        const startX = x > 0 ? x - 1 : x;
        const endX = x < line.length - 1 ? x + 1 : x;
        const startY = y > 0 ? y - 1 : y;
        const endY = y < octopusGrid.length - 1 ? y + 1 : y;

        // Need to bind myself to my nearest buddies
        for (let adjacentY = startY; adjacentY <= endY; adjacentY++) {
          for (let adjacentX = startX; adjacentX <= endX; adjacentX++) {
            // ignore binding to myself
            // eslint-disable-next-line no-continue
            if (adjacentX === x && adjacentY === y) continue;

            octopusGrid[adjacentY][adjacentX].on('flash', () =>
              octopi.incrementValue()
            );
          }
        }

        return octopi;
      })
    );

const printGrid = (grid) => grid.forEach((line) => console.log(line.join('')));

const sumGrid = (grid) =>
  grid.reduce(
    (acc, line) =>
      acc + line.reduce((lineAcc, octopi) => lineAcc + octopi.toNumber(), 0),
    0
  );

// Variables

const stepEventPart1 = new StepEvents();
const octopusGridPart1 = convertToOctopusGrid(input, stepEventPart1);
const stepsPart1 = 100;
const stepEventPart2 = new StepEvents();
const octopusGridPart2 = convertToOctopusGrid(input, stepEventPart2);
const stepsPart2 = 1000;
const cushion = 50;

// Loop through all steps giving some cushion for events to finish before each step
for (let step = 0; step < stepsPart1; step++) {
  setTimeout(() => stepEventPart1.emit('step'), step * cushion);
}

// Wait out all events to print results
setTimeout(() => {
  printGrid(octopusGridPart1);
  console.log('Part 1', stepEventPart1.toString());
}, cushion + stepsPart1 * cushion);

// Loop through all steps until all octopus have flashed
for (let step = 0; step < stepsPart2; step++) {
  setTimeout(() => {
    const summedGrid = sumGrid(octopusGridPart2);
    if (summedGrid === 0) {
      console.log(`Part 2 all octopus flashed on step ${step}`);
      process.exit(0);
    }
    stepEventPart2.emit('step');
  }, step * cushion);
}
