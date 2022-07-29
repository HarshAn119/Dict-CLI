const KeyManager = require('../lib/KeyManager');
const WordManager = require('../lib/WordManager');
const colors = require('colors');
const { format } = require('../utils/format');
const readline = require('readline');
const checkWord = require('../utils/checkWord');

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
    let score = 0;
    while (true) {
      console.log('Letss play\n'.blue);

      keyManager = new KeyManager();
      const key = keyManager.getKey();
      const api = new WordManager(key);
      const outputData = await api.getRandomWord();

      let checkToPlay = false;
      let permutations = findPermutations(outputData['word']);
      let definitionIndex = 0;
      console.log(outputData['definition'][definitionIndex++].yellow);
      let inputWord = await input('Can you guess this word?\n'.blue);
      if (inputWord === outputData['word']) {
        score += 10;
        console.log('You win the game 🎉'.green);
        console.log(`Your score: ${score}`.green);
      } else {
        let continue_game = false;
        while (true) {
          if (continue_game === true) break;
          else {
            console.log('Enter option\n1. Try again\n2. Hints\n3. Quit'.blue);
            let option = await input('');
            let wordInput;
            let tempScore;
            option = Number(option);
            if (option === 1) {
              wordInput = await input('Enter your word again\n'.blue);
              tempScore = checkWord(wordInput, outputData['word'], score);
              if (tempScore === 10) continue_game = true;
              score += tempScore;
            } else if (option === 2) {
              score -= 3;
              console.log('Hints:\n'.blue);
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
                    'Letters are jumbled, Can you guess the right word\n'.blue
                  );
                  const temp = Math.floor(
                    Math.random() * permutations.length + 1
                  );
                  console.log(permutations[temp].yellow);

                  wordInput = await input('Enter your word\n'.blue);
                  tempScore = checkWord(wordInput, outputData['word'], score);
                  if (tempScore === 10) continue_game = true;
                  score += tempScore;
                  break;
                case 2:
                  console.log(
                    'This is another definition, can you guess now\n'.blue
                  );
                  console.log(
                    outputData['definition'][definitionIndex++].yellow
                  );

                  wordInput = await input('Enter your word\n'.blue);
                  tempScore = checkWord(wordInput, outputData['word'], score);
                  if (tempScore === 10) continue_game = true;
                  score += tempScore;
                  break;
                case 3:
                  console.log('Synonym of the word: '.yellow);
                  console.log(outputData['synonym'][synonymIndex++].yellow);

                  wordInput = await input('Enter your word\n'.blue);
                  tempScore = checkWord(wordInput, outputData['word'], score);
                  if (tempScore === 10) continue_game = true;
                  score += tempScore;
                  break;
                case 4:
                  console.log('Antonym of the word: '.yellow);
                  console.log(outputData['antonym'][antonymIndex++].yellow);

                  wordInput = await input('Enter your word\n'.blue);
                  tempScore = checkWord(wordInput, outputData['word'], score);
                  if (tempScore === 10) continue_game = true;
                  score += tempScore;
                  break;
              }
            } else if (option === 3) {
              checkToPlay = true;
              continue_game = true;
              console.log('Game ended'.blue);
              console.log(`Your score: ${score}`.green);
            }
          }
        }
      }
      if (checkToPlay === true) {
        process.exit();
      }
    }
  },
};

module.exports = word;
