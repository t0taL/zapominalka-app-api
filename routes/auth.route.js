const { Router } = require('express');

const Profile = require('../models/profile.model');

const authenticateToken = require('../middlewares/authenticate-token');

const AuthAdapter = require('../utils/req-res-adapters/auth.adapter');
const AccessToken = require('../utils/access-token');
const PasswordEncryption = require('../utils/password-encryption');
const EmailSender = require('../utils/email-sender');

const welcomeEmail = require('../emails/welcome');
const passwordRecovery = require('../emails/password-recovery');


const router = Router();

router.get('/user', authenticateToken, async (req, res) => {
  console.log('get user');
  try {
    const profile = await Profile.findOne({ email: req.profileEmail });
    const getUserResData = AuthAdapter.toGetUserResAdapt(profile);

    res.status(200).json(getUserResData);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.post('/sign-in', async (req, res) => {
  console.log('sign-in');
  try {
    const signInReqData = AuthAdapter.toSignInReqAdapt(req.body);
    const profile = await Profile.findOne({ email: signInReqData.email });

    if (profile !== null) {
      const comparedPassword = await signInReqData.asyncComparePassword(profile.password);

      if (comparedPassword) {
        const token = AccessToken.generateToken(profile.email);
        const signInResData = AuthAdapter.toSignInResAdapt(profile, token);

        res.status(200).json(signInResData);
      } else {
        res.status(403).json('Password is invalid');
      }
    } else {
      res.status(403).json('Profile is not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.post('/sign-up', async (req, res) => {
  console.log('sign-up');
  try {
    const signUpReqData = await AuthAdapter.toSignUpReqAsyncAdapt(req.body);
    const profile = await Profile.findOne({ email: signUpReqData.email });

    if (profile !== null) {
      res.sendStatus(403).json('Email is already registered');
    } else {
      const newProfile = new Profile({
        ...signUpReqData,
        avatar: '',
        words: { newWords: [], completedWords: [] },
        settings: { repeatCount: 15, timerCount: 15, theme: 'light-default-theme' }
      });
      await newProfile.save();
      
      const token = AccessToken.generateToken(newProfile.email);
      const signUpResData = AuthAdapter.toSignUpResAdapt(newProfile, token);

      await EmailSender.send(welcomeEmail(newProfile.email));

      res.status(200).json(signUpResData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.post('/reset-password', async (req, res) => {
  console.log('reset password');
  try {
    let { email } = req.body;
    email = email.trim().toLowerCase();
    const profile = await Profile.findOne({ email });

    if (profile !== null) {
      const token = AccessToken.generateTokenForResetPassword(profile.email);

      await EmailSender.send(passwordRecovery(profile.email, token));

      res.status(200).json({ message: 'Check your email to continue changing your password!' });
    } else {
      res.sendStatus(403).json('Email is not registered');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});

router.post('/change-password', async (req, res) => {
  console.log('change password');
  try {
    const { token, password } = req.body;
    const email = AccessToken.getEmailFromToken(token);
    const profile = await Profile.findOne({ email });

    if (profile !== null) {
      const newPassword = await PasswordEncryption.encryptAsync(password);
      await profile.editProfile({ password: newPassword });

      res.status(200).json({ message: 'Profile password has been changed successfully!' });
    } else {
      res.sendStatus(403).json('Email is not registered');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});


module.exports = router;
