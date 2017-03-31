// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const browserstack = require('browserstack-local');
const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {

  allScriptsTimeout: 11000,

  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],

  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',

  commonCapabilities: {
    'browserstack.user': process.env.BROWSERSTACK_USERNAME || 'alexander1040',
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY || 'Jauouq9xfuiy9FZq3uA4',
    'build': '@nga/theme',
    'name': '@nga/theme',
    'browserstack.local': true,
    'browserstack.debug': true,
  },

  multiCapabilities: [
    {
      'browserName': 'Chrome',
      'os': 'Windows',
      'os_version': '10'
    },
  ],

  // Code to start browserstack local before start of test
  beforeLaunch: function() {
    console.log("Connecting local");
    return new Promise(function (resolve, reject) {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({ 'key': exports.config.commonCapabilities['browserstack.key'] }, function (error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');

        resolve();
      });
    });
  },

  // Code to stop browserstack local after end of test
  afterLaunch: function () {
    return new Promise(function (resolve, reject) {
      exports.bs_local.stop(resolve);
    });
  },

  onPrepare: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });

    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },

  baseUrl: 'http://localhost:4200/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },

};

// Code to support common capabilities
exports.config.multiCapabilities.forEach(function (caps) {
  for (var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});
