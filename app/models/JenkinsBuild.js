

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
    const build = new JenkinsBuild({name: opts.name, build: opts.build});
    build.save();
    return build;
  }

  static find(opts) {
    const builds = JenkinsBuild.findAll();
    var build =  builds[opts.name];
    return (build) ? new JenkinsBuild({name: opts.name, build: build}) : null;
  }
  
  static findAll() {
    return JenkinsBuild.storage().getItemSync(JenkinsBuild.storeName()) || {};
  }

  static storeName() {
    return 'JenkinsBuilds';
  }

  constructor(opts) {
    this.name = opts.name;
    this.build = opts.build;
  }

  save() {
    var builds = JenkinsBuild.findAll();
    builds[this.name] = this;
    JenkinsBuild.storage().setItemSync(JenkinsBuild.storeName(), builds);
  }

  delete() {
    var builds = JenkinsBuild.findAll();
    delete builds[this.name];
    JenkinsBuild.storage().setItemSync(JenkinsBuild.storeName(), builds);
  }

}

module.exports = JenkinsBuild;