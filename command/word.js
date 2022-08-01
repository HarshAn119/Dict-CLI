const KeyManager = require('../lib/KeyManager');
const WordManager = require('../lib/WordManager');
const colors = require('colors');
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

const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

const input = (questionText) => {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
};
const showOptions = async () => {
  console.log('Enter option\n1. To Try again\n2. Show Hint\n3. Quit'.blue);
  let option = await input('');
  return Number(option);
};

const askToGuess = async () => {
  let wordInput = await input('Enter your word\n'.blue);
  return wordInput;
};

const checkGuess = (word1, word2) => {
  return word1 === word2;
};

let definitionIndex = 0;
let synonymIndex = 0;
let antonymIndex = 0;
const showRandomHints = (wordDetails) => {
  let hint;
  if (wordDetails['antonym'] != undefined) {
    hint = Math.floor(Math.random() * 4);
  } else hint = Math.floor(Math.random() * 3);

  if (hint === 0) {
    if (definitionIndex <= wordDetails['definition'].length) {
      console.log('definition: ', wordDetails['definition'][definitionIndex++]);
    }
  } else if (hint === 1) {
    if (synonymIndex <= wordDetails['synonym'].length) {
      console.log('synonym: ', wordDetails['synonym'][synonymIndex++]);
    }
  } else if (hint === 2) {
    let permutations = findPermutations(wordDetails['word']);
    const temp = Math.floor(Math.random() * permutations.length + 1);
    console.log('jumbled: ', permutations[temp]);
  } else if (hint === 3) {
    if (antonymIndex <= wordDetails['antonym'].length) {
      console.log('antonym: ', wordDetails['antonym'][antonymIndex++]);
    }
  }
};

const word = {
  async def(opt) {
    try {
      keyManager = new KeyManager();
      const key = keyManager.getKey();
      const api = new WordManager(key);
      const outputData = await api.getWordDefinition(opt.word);
      console.log(outputData);
      process.exit();
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
      process.exit();
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
      process.exit();
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
      process.exit();
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
      process.exit();
    } catch (err) {
      console.error(err.message.red);
    }
  },
  async play() {
    let score = 0;
    keyManager = new KeyManager();
    const key = keyManager.getKey();
    const api = new WordManager(key);

    let continue_game = true;
    while (continue_game) {
      console.log('Lets Start\n'.blue);
      const wordDetails = await api.getRandomWord();

      showRandomHints(wordDetails);
      while (true) {
        const guess = await askToGuess();
        let correct = checkGuess(guess, wordDetails['word']);

        if (!correct) {
          let option = await showOptions();
          if (option === 2) {
            showRandomHints(wordDetails);
          } else if (option === 3) {
            continue_game = false;
            break;
          }
        } else {
          score += 10;
          console.log(`Correct answer, ${score}`);
          break;
        }
      }
    }
    if (!continue_game) process.exit();
  },
};

module.exports = word;
