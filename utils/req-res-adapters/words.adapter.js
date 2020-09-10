class WordsAdapter {
  static toLowerCaseWordValues(word) {
    word.value = word.value.toLowerCase();
    word.translation = word.translation.map(translation => translation.toLowerCase());
    return word;
  }

  // requests
  static toAddWordReqAdapt({ word }) {
    const requestData = {
      word: WordsAdapter.toLowerCaseWordValues(word)
    };

    return requestData;
  }

  static toEditWordReqAdapt({ word }) {
    const requestData = {
      word: WordsAdapter.toLowerCaseWordValues(word)
    };

    return requestData;
  }

  // responses
  static toGetWordsResAdapt(words) {
    const responseData = { words };

    return responseData;
  }

  static toAddWordResAdapt(word) {
    const responseData = { word };

    return responseData;
  }

  static toEditWordResAdapt(word) {
    const responseData = { word };

    return responseData;
  }

  static toDeleteWordResAdapt(wordId) {
    const responseData = { wordId };

    return responseData;
  }

  static toCompleteWordResAdapt(word) {
    const responseData = { word };

    return responseData;
  }

  static toReturnWordResAdapt(word) {
    const responseData = { word };

    return responseData;
  }
}


module.exports = WordsAdapter;
