const colors = require('colors');
const word = {
  def(opt) {
    //TEST (transform this to try catch)
    if (opt.word === undefined) {
      console.error('Error...Please provide a word!!'.red);
    } else console.log(`definition for given word: ${opt.word}`);
  },
  syn() {
    console.log(`synonym for given word: ${opt.word}`);
  },
  ant() {
    console.log(`antonym for given word: ${opt.word}`);
  },
  ex() {
    console.log(`example for given word: ${opt.word}`);
  },
  wod() {
    console.log('word of the day');
  },
};

module.exports = word;
