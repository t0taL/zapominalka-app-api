const { Router } = require('express');

const Profile = require('../models/profile.model');

const SettingsAdapter = require('../utils/req-res-adapters/settings.adapter');


const router = Router();

router.get('/', async (req, res) => {
  console.log('get settings');
  try {
    const profile = await Profile.findOne({ email: req.profileEmail });

    const getSettingsResData = SettingsAdapter.toSettingsResAdapt(profile.settings);

    res.status(200).json(getSettingsResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.put('/', async (req, res) => {
  console.log('edit profile');
  try {
    const editSettingsReqData = SettingsAdapter.toSettingsReqAdapt(req.body);
    const profile = await Profile.findOne({ email: req.profileEmail });
    
    await profile.editSettings(editSettingsReqData);
    
    const editSettingsResData = SettingsAdapter.toSettingsResAdapt(profile.settings);

    res.status(200).json(editSettingsResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});


module.exports = router;
