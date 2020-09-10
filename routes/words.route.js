const { Router } = require('express');

const Profile = require('../models/profile.model');

const WordsAdapter = require('../utils/req-res-adapters/words.adapter');


const router = Router();

router.get('/', async (req, res) => {
  console.log('get words');
  try {
    const profile = await Profile.findOne({ email: req.profileEmail });
    const wordsResData = WordsAdapter.toGetWordsResAdapt(profile.getWords());
    
    res.status(200).json(wordsResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.post('/', async (req, res) => {
  console.log('add word');
  try {
    const profile = await Profile.findOne({ email: req.profileEmail });
    const addWordReqData = WordsAdapter.toAddWordReqAdapt(req.body);
    const newWord = profile.addNewWord(addWordReqData);
    const addWordResData = WordsAdapter.toAddWordResAdapt(newWord);

    res.status(200).json(addWordResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.put('/', async (req, res) => {
  console.log('edit word');
  try {
    const profile = await Profile.findOne({ email: req.profileEmail });
    const editWordReqData = WordsAdapter.toEditWordReqAdapt(req.body);
    const editedWord = profile.editWord(editWordReqData);
    const editWordResData = WordsAdapter.toEditWordResAdapt(editedWord);

    res.status(200).json(editWordResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.delete('/', async (req, res) => {
  console.log('delete word');
  try {
    const profile = await Profile.findOne({ email: req.profileEmail });
    const deletedWordId = profile.deleteWord(req.query['wordId']);
    const deleteWordResData = WordsAdapter.toDeleteWordResAdapt(deletedWordId);

    res.status(200).json(deleteWordResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.post('/complete', async (req, res) => {
  try {
    console.log('complete word');
    const profile = await Profile.findOne({ email: req.profileEmail });
    const completedWordId = req.query['wordId'];
    const completedWord = profile.completeWord(completedWordId);
    const completeWordResData = WordsAdapter.toCompleteWordResAdapt(completedWord);

    res.status(200).json(completeWordResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.post('/return', async (req, res) => {
  try {
    console.log('return word');
    const profile = await Profile.findOne({ email: req.profileEmail });
    const returnedWordId = req.query['wordId'];
    const returnedWord = profile.returnWord(returnedWordId);
    const returnWordResData = WordsAdapter.toReturnWordResAdapt(returnedWord);

    res.status(200).json(returnWordResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});


module.exports = router;
