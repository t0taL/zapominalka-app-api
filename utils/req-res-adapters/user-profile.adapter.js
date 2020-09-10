const AccessToken = require('../access-token');


class UserProfileAdapter {
  // requests
  static toEditProfileReqAdapt({ name, email }) {
    const requestData = {
      name: name.trim(),
      email: email.trim().toLowerCase()
    }

    return requestData;
  }

  // responses
  static toGetUserProfileResAdapt({ email, name, avatar }) {
    const responseData = {
      userProfile: { email, name, avatar }
    };

    return responseData;
  }

  static toEditUserProfileResAdapt({ email, name, avatar }, token) {
    const responseData = {
      userProfile: { email, name, avatar },
      tokenData: { token, expiresIn: AccessToken.EXPIRES_TIME }
    };

    return responseData;
  }

  static toChangeUserProfilePasswordResAdapt(message) {
    const responseData = { message };

    return responseData;
  }
}

module.exports = UserProfileAdapter;
