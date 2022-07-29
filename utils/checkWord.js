const checkWord = (src, target, score) => {
  if (src === target) {
    score += 10;
    console.log('You win the game 🎉'.green);
    console.log(`Your score: ${score}`.green);
    return 10;
  } else {
    score -= 2;
    console.log('Wrong guess :('.red);
    return -2;
  }
};

module.exports = checkWord;
