

class JenkinsBuild {
  static storage() {
    if (JenkinsBuild._storage) {
      return JenkinsBuild._storage;
    }
    JenkinsBuild._storage = require('node-persist');
    JenkinsBuild._storage.initSync();
    return JenkinsBuild._storage;
  }

  static create(opts) {
    const build = new JenkinsBuild(opts);
    build.save();
    return build;
  }

  static find(opts) {
    const builds = JenkinsBuild.findAll();
    var build =  builds[opts.name];
    return (build) ? new JenkinsBuild(build) : null;
  }

  static findAll() {
    return JenkinsBuild.storage().getItemSync(JenkinsBuild.storeName()) || {};
  }

  static storeName() {
    return 'JenkinsBuilds';
  }

  constructor(opts) {
    this.name = opts.name;
    this.activity = opts.activity;
    this.lastBuildLabel = opts.lastBuildLabel;
    this.lastBuildStatus = opts.lastBuildStatus;
    this.lastBuildTime = opts.lastBuildTime;
    this.webUrl = opts.webUrl;
  }

  update(build) {
    var builds = JenkinsBuild.findAll();
    builds[build.name] = build;
    JenkinsBuild.storage().setItemSync(JenkinsBuild.storeName(), builds);
  }

  save() {
    var builds = JenkinsBuild.findAll();
    builds[this.name] = JSON.stringify(this);
    JenkinsBuild.storage().setItemSync(JenkinsBuild.storeName(), builds);
  }

  delete() {
    var builds = JenkinsBuild.findAll();
    delete builds[this.name];
    JenkinsBuild.storage().setItemSync(JenkinsBuild.storeName(), builds);
  }

}

module.exports = JenkinsBuild;