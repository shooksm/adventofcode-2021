// eslint-disable-next-line max-classes-per-file
const fs = require('fs');
const events = require('events');

// File Input

// const input = fs.readFileSync('./input.txt');
const example = fs.readFileSync('./example.txt');

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
  constructor(startingValue, stepEvent) {
    super();
    this.value = +startingValue;
    this.stepEvent = stepEvent;

    this.stepEvent.on('step', () => this.incrementValue());
  }

  incrementValue() {
    this.value++;
    if (this.value > 9) {
      this.value = 0;

      // Let the step know I flashed
      this.stepEvent.incrementFlashes();

      // Let all my buddies that are around me know I flashed
      setImmediate(() => this.emit('flash'));
    }
  }

  toString() {
    return this.value;
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
    .map((line, x, octopusGrid) =>
      line.map((octopi, y) => {
        // Figure out bounds of adjacent octopi
        const startX = x > 0 ? x - 1 : x;
        const endX = x < line.length - 1 ? x + 1 : x;
        const startY = y > 0 ? y - 1 : y;
        const endY = y < octopusGrid.length - 1 ? y + 1 : y;

        // Need to bind myself to my nearest buddies
        for (let adjacentX = startX; adjacentX <= endX; adjacentX++) {
          for (let adjacentY = startY; adjacentY <= endY; adjacentY++) {
            // ignore binding to myself
            if (adjacentX === x && adjacentY === y) break;

            octopusGrid[adjacentY][adjacentX].on('flash', () =>
              octopi.incrementValue()
            );
          }
        }

        return octopi;
      })
    );

const printGrid = (grid) => grid.forEach((line) => console.log(line.join('')));

// Variables

const stepEvent = new StepEvents();
const octopusGrid = convertToOctopusGrid(example, stepEvent);
const steps = 2;

// Loop through all steps giving some cushion for events to finish before each step
for (let step = 1; step <= steps; step++) {
  setTimeout(() => stepEvent.emit('step'), step * 100);
}

// Wait out all events to print results
setTimeout(() => {
  printGrid(octopusGrid);
  console.log(stepEvent.toString());
}, 1000 + steps * 100);