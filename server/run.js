'use strict';

const MONITOR_URI = 'http://jenkins-np.moxi.bz/cc.xml';
const MONITOR_INTERVAL = 15000; //ms
const APP_ID = 'adc655ba-638a-45b8-b6a5-f8dab7e31f0d';
const APP_PASS = '57QbFJk0HxAhLEqbRVOe70m';
const APP_PORT =  48910;

let ChatServer = require('./ChatServer');
let MoxiBot = require('./MoxiBot');
let JenkinsBuildMonitor = require('./../app/monitors/JenkinsBuildMonitor');
let Router = require('./Router');

let chatServer = new ChatServer(APP_ID, APP_PASS, APP_PORT);
let moxiBot = new MoxiBot(chatServer);
let router = new Router(moxiBot);

let jenkinsMonitor = new JenkinsBuildMonitor({uri: MONITOR_URI, interval: MONITOR_INTERVAL, bot: moxiBot});

jenkinsMonitor.start();
