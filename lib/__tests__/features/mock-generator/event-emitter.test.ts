import EventEmitter from 'events';


class MyEmitter extends EventEmitter {}

const myEmitter = new EventEmitter();

it("myEmitter", () => {
  myEmitter.on('event', (value) => {
    expect(value).toEqual(1);
  });
  myEmitter.on('event', (value) => {
    expect(value+1).toEqual(2);
  });
  myEmitter.emit('event', 1);
})
