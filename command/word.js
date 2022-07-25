const KeyManager = require('../lib/KeyManager');
const WordManager = require('../lib/WordManager');
const colors = require('colors');
const { format } = require('../utils/format');
const readline = require('readline');

const findPermutations = (string) => {
  if (string.length < 2) {
    return string;
  }
  let permutationsArray = [];
  for (let i = 0; i < string.length; i++) {
    let char = string[i];
    let remainingChars =
      string.slice(0, i) + string.slice(i + 1, string.length);
    for (let permutation of findPermutations(remainingChars)) {
      permutationsArray.push(char + permutation);
    }
  }
  return permutationsArray;
};

const word = {
  async def(opt) {
    try {
      keyManager = new KeyManager();
      const key = keyManager.getKey();
      const api = new WordManager(key);
      const outputData = await api.getWordDefinition(opt.word);
      console.log(outputData);
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async syn(opt) {
    try {
      keyManager = new KeyManager();
      const key = keyManager.getKey();
      const api = new WordManager(key);
      const outputData = await api.getWordSynonym(opt.word);
      console.log(outputData);
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async ant(opt) {
    try {
      keyManager = new KeyManager();
      const key = keyManager.getKey();
      const api = new WordManager(key);
      const outputData = await api.getWordAntonym(opt.word);
      console.log(outputData);
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async ex(opt) {
    try {
      keyManager = new KeyManager();
      const key = keyManager.getKey();
      const api = new WordManager(key);
      const outputData = await api.getWordExample(opt.word);
      console.log(outputData);
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async wod() {
    try {
      keyManager = new KeyManager();
      const key = keyManager.getKey();
      const api = new WordManager(key);
      const outputData = await api.getRandomWord();
      console.log(outputData);
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async play() {
    const readlineInterface = readline.createInterface(
      process.stdin,
      process.stdout
    );

    const input = (questionText) => {
      return new Promise((resolve, reject) => {
        readlineInterface.question(questionText, resolve);
      });
    };

    console.log('Letss play\n');

    keyManager = new KeyManager();
    const key = keyManager.getKey();
    const api = new WordManager(key);
    const outputData = await api.getRandomWord();

    let permutations = findPermutations(outputData['word']);
    let definitionIndex = 0;
    console.log(outputData['definition'][definitionIndex++]);
    let inputWord = await input('Can you guess this word?\n');
    if (inputWord === outputData['word']) {
      console.log('You win the game 🎉');
    } else {
      let flag = false;
      while (true) {
        if (flag === true) break;
        else {
          console.log('Enter option\n1. Try again\n2. Hints\n3. Quit');
          let option = await input('');
          let wordInput;
          option = Number(option);
          if (option === 1) {
            wordInput = await input('Enter your word again\n');
            if (wordInput === outputData['word']) {
              console.log('You win the game 🎉');
              flag = true;
            } else console.log('Wrong guess :(');
          } else if (option === 2) {
            console.log('Hints:\n');
            let synonymIndex = 0;
            let antonymIndex = 0;
            let hints =
              outputData['antonym'] === undefined ||
              outputData['antonym'][antonymIndex] === undefined
                ? Math.floor(Math.random() * 3 + 1)
                : Math.floor(Math.random() * 4 + 1);

            switch (hints) {
              case 1:
                console.log(
                  'Letters are jumbled, Can you guess the right word\n'
                );
                const temp = Math.floor(
                  Math.random() * permutations.length + 1
                );
                console.log(permutations[temp]);

                wordInput = await input('Enter your word\n');
                if (wordInput === outputData['word']) {
                  console.log('You win the game 🎉');
                  flag = true;
                } else console.log('Wrong guess :(');
                break;
              case 2:
                console.log('This is another definition, can you guess now\n');
                console.log(outputData['definition'][definitionIndex++]);

                wordInput = await input('Enter your word\n');
                if (wordInput === outputData['word']) {
                  console.log('You win the game 🎉');
                  flag = true;
                } else console.log('Wrong guess :(');
                break;
              case 3:
                console.log('Synonym of the word: ');
                console.log(outputData['synonym'][synonymIndex++]);

                wordInput = await input('Enter your word\n');
                if (wordInput === outputData['word']) {
                  console.log('You win the game 🎉');
                  flag = true;
                } else console.log('Wrong guess :(');
                break;
              case 4:
                console.log('Antonym of the word: ');
                console.log(outputData['antonym'][antonymIndex++]);

                wordInput = await input('Enter your word\n');
                if (wordInput === outputData['word']) {
                  console.log('You win the game 🎉');
                  flag = true;
                } else console.log('Wrong guess :(');
                break;
            }
          } else if (option === 3) {
            flag = true;
            console.log('Game ended');
          }
        }
      }
      process.exit();
    }
  },
};

module.exports = word;
