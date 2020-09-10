const { Router } = require('express');

const Profile = require('../models/profile.model');

const LearnAdapter = require('../utils/req-res-adapters/learn.adapter');


const router = Router();

router.get('/', async (req, res) => {
  console.log('get words for learning');
  try {
    const profile = await Profile.findOne({ email: req.profileEmail });
    const words = profile.getWordsForLearning();
    const getWordsResData = LearnAdapter.toGetWordsForLearningResAdapt(words);

    res.status(200).json(getWordsResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.put('/', async (req, res) => {
  console.log('save learning result');
  try {
    const profile = await Profile.findOne({ email: req.profileEmail });
    const saveLearningResultReqData = LearnAdapter.toSaveLearningResultReqAdapt(req.body);

    profile.saveLearningResult(saveLearningResultReqData);

    const saveLearningResultResData = LearnAdapter.toSaveLearningResultResAdapt('Learning result has been saved successfully!');

    res.status(200).json(saveLearningResultResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});


module.exports = router;
