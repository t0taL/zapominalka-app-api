const PasswordEncryption = require('../password-encryption');
const AccessToken = require('../access-token');


class AuthAdapter {
  // requests
  static toSignInReqAdapt({ email, password }) {
    const requestData = {
      email: email.trim().toLowerCase(),
      password: password.trim()
    };
  
    requestData.__proto__.asyncComparePassword = async function(profilePassword) {
      const areSame = await PasswordEncryption.compareAsync(password, profilePassword);
      return areSame;
    }
  
    return requestData;
  }

  static async toSignUpReqAsyncAdapt({ email, name, password }) {
    const hashPassword = await PasswordEncryption.encryptAsync(password);
    const requestData = {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      password: hashPassword
    };

    return requestData;
  }

  // responses
  static toSignInResAdapt({ name, avatar, settings }, token) {
    const responseData = {
      userData: { 
        user: { name, avatar },
        settings: { timerCount: settings.timerCount, theme: settings.theme }
      },
      tokenData: { token, expiresIn: AccessToken.EXPIRES_TIME }
    };
  
    return responseData;
  }

  static toSignUpResAdapt({ name, avatar, settings }, token) {
    const responseData = {
      userData: { 
        user: { name, avatar },
        settings: { timerCount: settings.timerCount, theme: settings.theme }
      },
      tokenData: { token, expiresIn: AccessToken.EXPIRES_TIME }
    };
  
    return responseData;
  }

  static toGetUserResAdapt({ name, avatar, settings }) {
    const responseData = {
      userData: { 
        user: { name, avatar },
        settings: { timerCount: settings.timerCount, theme: settings.theme }
      }
    };

    return responseData;
  }
}


module.exports = AuthAdapter;
