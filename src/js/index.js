import './schedule-calculator';
import './lib';
import './components';

import '../scss/index.scss';
// not building the service worker as an entry point because it will fail to
// execute due to the extra code inserted by webpack
import 'file?name=service-worker.js!./service-worker.js';
import 'file?name=manifest.json!../manifest.json';
