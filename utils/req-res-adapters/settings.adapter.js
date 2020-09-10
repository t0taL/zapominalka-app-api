class SettingsAdapter {
  // requests
  static toSettingsReqAdapt({ settings }) {
    return settings;
  }

  // responses
  static toSettingsResAdapt(settings) {
    const responseData = { settings };

    return responseData;
  }
}


module.exports = SettingsAdapter;
