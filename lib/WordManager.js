const axios = require('axios');
const colors = require('colors');
const { format } = require('../utils/format');

class WordManager {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://fourtytwowords.herokuapp.com';
  }

  async getWordDefinition(word) {
    try {
      const res = await axios.get(
        `${this.baseUrl}/word/${word}/definitions?api_key=${this.apiKey}`
      );
      return format(res.data);
    } catch (err) {
      handleAPIError(err);
    }
  }
  async getWordSynonym(word) {
    try {
      const res = await axios.get(
        `${this.baseUrl}/word/${word}/relatedWords?api_key=${this.apiKey}`
      );
      if (res.data.length > 1) return res.data[1].words;
      else return res.data[0].words;
    } catch (err) {
      handleAPIError(err);
    }
  }
  async getWordAntonym(word) {
    try {
      const res = await axios.get(
        `${this.baseUrl}/word/${word}/relatedWords?api_key=${this.apiKey}`
      );
      if (res.data.length > 1) return res.data[0].words;
      else throw new Error('No antonym found');
    } catch (err) {
      handleAPIError(err);
    }
  }
  async getWordExample(word) {
    try {
      const res = await axios.get(
        `${this.baseUrl}/word/${word}/examples?api_key=${this.apiKey}`
      );
      return format(res.data.examples);
    } catch (err) {
      handleAPIError(err);
    }
  }
  async getRandomWord() {
    try {
      const res = await axios.get(
        `${this.baseUrl}/words/randomWord?api_key=${this.apiKey}`
      );
      let output = {};
      const randomWord = res.data.word;
      const definition = await axios.get(
        `${this.baseUrl}/word/${randomWord}/definitions?api_key=${this.apiKey}`
      );
      const relatedWords = await axios.get(
        `${this.baseUrl}/word/${randomWord}/relatedWords?api_key=${this.apiKey}`
      );
      const example = await axios.get(
        `${this.baseUrl}/word/${randomWord}/examples?api_key=${this.apiKey}`
      );
      output['word'] = randomWord;
      output['definition'] = format(definition.data);
      output['example'] = format(example.data.examples);
      if (relatedWords.data.length > 1) {
        output['antonym'] = relatedWords.data[0].words;
        output['synonym'] = relatedWords.data[1].words;
      } else output['synonym'] = relatedWords.data[0].words;
      return output;
    } catch (err) {
      throw new Error('No word found');
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
    throw new Error('Something not working');
  }
}

module.exports = WordManager;
