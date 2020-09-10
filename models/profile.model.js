const { Schema, model } = require('mongoose');


const profileSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, required: false },
  password: { type: String, required: true },
  words: {
    newWords: [{
      value: { type: String, required: true },
      locale: { type: String, required: true },
      translation: { type: [String], required: true },
      repeatCount: { type: Number, required: true }
    }],
    completedWords: [{
      value: { type: String, required: true },
      locale: { type: String, required: true },
      translation: { type: [String], required: true },
      repeatCount: { type: Number, required: true }
    }],
  },
  settings: {
    repeatCount: { type: Number, required: true },
    timerCount: { type: Number, required: true },
    theme: { type: String, required: true }
  }
});

profileSchema.methods.editProfile = function({ email, name, avatar, password }) {
  this.email = (email !== undefined) ? email : this.email;
  this.name = (name !== undefined) ? name : this.name;
  this.avatar = (avatar !== undefined) ? avatar : this.avatar;
  this.password = (password !== undefined) ? password : this.password;
  
  return this.save();
}

profileSchema.methods.editSettings = function({ repeatCount, timerCount, theme }) {
  this.settings.timerCount = timerCount ? timerCount : this.settings.timerCount;
  this.settings.theme = theme ? theme : this.settings.theme;

  if (this.repeatCount !== repeatCount) {
    const updatedNewWords = [];
    const updatedCompletedWords = [];

    this.settings.repeatCount = repeatCount ? repeatCount : this.settings.repeatCount;

    [ ...this.words.newWords, ...this.words.completedWords ].forEach(word => {
      if (word.repeatCount >= repeatCount) {
        updatedCompletedWords.push(word);
      } else {
        updatedNewWords.push(word);
      }
    });

    this.words.newWords = updatedNewWords;
    this.words.completedWords = updatedCompletedWords;
  }
  
  return this.save();
}

profileSchema.methods.getWords = function() {
  this.words.newWords = this.words.newWords.sort((a, b) => a.value.localeCompare(b.value));
  this.words.completedWords = this.words.completedWords.sort((a, b) => a.value.localeCompare(b.value));

  this.save();

  return this.words;
}

profileSchema.methods.addNewWord = function({ word }) {
  const newWordIdx = this.words.newWords.findIndex(w => w.value === word.value);
  const completedWordIdx = this.words.completedWords.findIndex(w => w.value === word.value);
  let newWord;

  if (newWordIdx !== -1) {
    const updatedTranslation = [
      ...new Set([
        ...this.words.newWords[newWordIdx].translation,
        ...word.translation
      ])
    ];

    this.words.newWords[newWordIdx].translation = updatedTranslation;
  } else if (completedWordIdx !== -1) {
    const updatedTranslation = [
      ...new Set([
        ...this.words.completedWords[completedWordIdx].translation,
        ...word.translation
      ])
    ];
    const { value, locale } = this.words.completedWords[completedWordIdx];

    this.words.newWords.push({ value, locale, translation: updatedTranslation });
    this.words.completedWords = [
      ...this.words.completedWords.slice(0, completedWordIdx),
      ...this.words.completedWords.slice(completedWordIdx + 1)
    ];
  } else {
    this.words.newWords.push({ ...word, repeatCount: 0 });
  }

  this.save();

  newWord = [ ...this.words.newWords, ...this.words.completedWords ].find(w => w.value === word.value);

  return newWord;
}

profileSchema.methods.editWord = function({ word }) {
  const newWordIdx = this.words.newWords.findIndex(w => w.value === word.value);
  const completedWordIdx = this.words.completedWords.findIndex(w => w.value === word.value);
  let editedWord;

  if (newWordIdx !== -1) {
    this.words.newWords[newWordIdx] = {
      _id: this.words.newWords[newWordIdx]._id,
      ...word,
      repeatCount: this.words.newWords[newWordIdx].repeatCount
    };
  } else if (completedWordIdx !== -1) {
    this.words.completedWords[completedWordIdx] = {
      _id: this.words.completedWords[completedWordIdx]._id,
      ...word,
      repeatCount: this.words.completedWords[completedWordIdx].repeatCount
    };
  }

  this.save();

  editedWord = [ ...this.words.newWords, ...this.words.completedWords ].find(w => w.value === word.value);

  return editedWord;
}

profileSchema.methods.deleteWord = function(wordId) {
  const newWordIdx = this.words.newWords.findIndex(w => w._id.toString() === wordId.toString());
  const completedWordIdx = this.words.completedWords.findIndex(w => w._id.toString() === wordId.toString());

  if (newWordIdx !== -1) {
    this.words.newWords = [
      ...this.words.newWords.slice(0, newWordIdx),
      ...this.words.newWords.slice(newWordIdx + 1)
    ];
  } else if (completedWordIdx !== -1) {
    this.words.completedWords = [
      ...this.words.completedWords.slice(0, completedWordIdx),
      ...this.words.completedWords.slice(completedWordIdx + 1)
    ];
  }

  this.save();

  return wordId;
}

profileSchema.methods.completeWord = function(wordId) {
  const newWordIdx = this.words.newWords.findIndex(w => w._id.toString() === wordId.toString());
  const { _id, locale, value, translation } = this.words.newWords[newWordIdx];
  const updatedNewWord = { _id, locale, value, translation, repeatCount: this.settings.repeatCount };

  this.words.completedWords.push(updatedNewWord);
  this.words.newWords = [
    ...this.words.newWords.slice(0, newWordIdx),
    ...this.words.newWords.slice(newWordIdx + 1)
  ];
  
  this.save();

  return updatedNewWord;
}

profileSchema.methods.returnWord = function(wordId) {
  const completedWordIdx = this.words.completedWords.findIndex(w => w._id.toString() === wordId.toString());
  const { _id, locale, value, translation } = this.words.completedWords[completedWordIdx];
  const updatedCompletedWord = { _id, locale, value, translation, repeatCount: 0 };

  this.words.newWords.push(updatedCompletedWord);
  this.words.completedWords = [
    ...this.words.completedWords.slice(0, completedWordIdx),
    ...this.words.completedWords.slice(completedWordIdx + 1)
  ];
  
  this.save();

  return updatedCompletedWord;
}

profileSchema.methods.getWordsForLearning = function() {
  const wordsForLearning = this.words.newWords.sort(() => Math.random() - 0.5);
  
  return wordsForLearning;
}

profileSchema.methods.saveLearningResult = function({ words }) {
  const updatedNewWords = [];
  
  words.forEach(word => {
    if (word.repeatCount >= this.settings.repeatCount) {
      this.words.completedWords.push(word);
    } else {
      updatedNewWords.push(word);
    }
  });

  this.words.newWords = updatedNewWords;

  this.save();
}


module.exports = model('Profile', profileSchema);
