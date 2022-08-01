const axios = require('axios');
const colors = require('colors');
const { format } = require('../utils/format');

class WordManager {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://fourtytwowords.herokuapp.com';
  }

  getWordDefinition(word) {
    return axios
      .get(`${this.baseUrl}/word/${word}/definitions?api_key=${this.apiKey}`)
      .then((response) => {
        return format(response.data);
      })
      .catch((err) => handleAPIError(err));
  }
  getRelatedWord(word) {
    return axios
      .get(`${this.baseUrl}/word/${word}/relatedWords?api_key=${this.apiKey}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => handleAPIError(err));
  }

  async getWordSynonym(word) {
    const res = await this.getRelatedWord(word);
    if (res.length > 1) return res[1].words;
    else return res[0].words;
  }
  async getWordAntonym(word) {
    const res = await this.getRelatedWord(word);
    if (res.length > 1) return res[0].words;
    else return 'No antonym found';
  }
  getWordExample(word) {
    return axios
      .get(`${this.baseUrl}/word/${word}/examples?api_key=${this.apiKey}`)
      .then((response) => {
        return format(response.data.examples);
      })
      .catch((err) => handleAPIError(err));
  }
  async getRandomWord() {
    try {
      const res = await axios.get(
        `${this.baseUrl}/words/randomWord?api_key=${this.apiKey}`
      );
      let output = {};

      const randomWord = res.data.word;
      const definitions = this.getWordDefinition(randomWord);
      const example = this.getWordExample(randomWord);
      const relatedWords = this.getRelatedWord(randomWord);

      const values = await Promise.all([definitions, example, relatedWords]);

      output['word'] = randomWord;
      output['definition'] = values[0];
      output['example'] = values[1];
      if (values[2].length > 1) {
        output['antonym'] = values[2][0].words;
        output['synonym'] = values[2][1].words;
      } else output['synonym'] = values[2][0].words;
      return output;
    } catch (err) {
      console.error(err);
    }
  }
}

function handleAPIError(err) {
  if (err.response.status === 401) {
    throw new Error(
      'Invalid API key -Go to https://fourtytwowords.herokuapp.com'
    );
  } else if (err.response.status === 404) {
    throw new Error('Cannot reach the server, Try again later');
  } else {
    throw new Error('word not found');
  }
}

module.exports = WordManager;
