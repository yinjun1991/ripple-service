const EventEmitter = require('events');

const myEE = new EventEmitter();

let count = 0;

myEE.on('hello', async () => {
  await Promise.resolve().then(() => count++);
});

myEE.on('hello', async () => {
  await Promise.resolve().then(() => count++);
});

myEE.on('hello', async () => {
  console.log('111', count)
  await Promise.resolve().then(() => console.log('222', count))
});

myEE.emit('hello');
// 111 0
// 222 2
