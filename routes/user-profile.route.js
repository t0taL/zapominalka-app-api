const { Router } = require('express');

const Profile = require('../models/profile.model');

const fileSaver = require('../middlewares/file-saver');

const UserProfileAdapter = require('../utils/req-res-adapters/user-profile.adapter');
const AccessToken = require('../utils/access-token');
const FileManager = require('../utils/file-manager');
const PasswordEncryption = require('../utils/password-encryption');


const router = Router();

router.get('/', async (req, res) => {
  console.log('get user profile');
  try {
    const profile = await Profile.findOne({ email: req.profileEmail });
    const getUserProfileResData = UserProfileAdapter.toGetUserProfileResAdapt(profile);

    res.status(200).json(getUserProfileResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.put('/', fileSaver.single('imageFile'), async (req, res) => {
  console.log('edit user profile');
  try {
    const profile = await Profile.findOne({ email: req.profileEmail });
    const userProfileReqData = UserProfileAdapter.toEditProfileReqAdapt(req.body);
    const { imageDeleted } = req.body;
    let userProfileResData;
    let avatar;

    if (imageDeleted === 'true') {
      if (profile.avatar !== '') {
        FileManager.removeUnusedImageFile(profile.avatar);
        avatar = '';
      }
    }

    if (req.file) {
      if (profile.avatar !== '') {
        FileManager.removeUnusedImageFile(profile.avatar);
      }
      avatar = `${process.env.URL_ADDRESS}images?fileName=${req.file.filename}`;
    }

    await profile.editProfile({ ...userProfileReqData, avatar });

    if (req.profileEmail !== userProfileReqData.email) {
      const token = AccessToken.generateToken(profile.email);

      userProfileResData = UserProfileAdapter.toEditUserProfileResAdapt(profile, token);
    } else {
      userProfileResData = UserProfileAdapter.toEditUserProfileResAdapt(profile, null);
    }

    res.status(200).json(userProfileResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.put('/password', async (req, res) => {
  console.log('change profile password');
  try {
    const { previousPassword, password } = req.body;
    const profile = await Profile.findOne({ email: req.profileEmail });

    const comparedPassword = await PasswordEncryption.compareAsync(previousPassword, profile.password);

    if (!comparedPassword) {
      return res.status(403).json('Previous password is invalid!');
    }

    const newEncryptedPassword = await PasswordEncryption.encryptAsync(password);

    await profile.editProfile({ password: newEncryptedPassword });
    
    const changeUserProfilePasswordResData = UserProfileAdapter.toChangeUserProfilePasswordResAdapt('User profile password has been changed successfully!');

    res.status(200).json(changeUserProfilePasswordResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});


module.exports = router;
