class LearnAdapter {
  // requests
  static toSaveLearningResultReqAdapt({ words }) {
    const responseData = { words };

    return responseData;
  }

  // responses
  static toGetWordsForLearningResAdapt(words) {
    const responseData = { words };

    return responseData;
  }

  static toSaveLearningResultResAdapt(message) {
    const responseData = { message };

    return responseData;
  }
}


module.exports = LearnAdapter;
