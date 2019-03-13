/**
* @name Red
* @summary Red Hydra Express service entry point
* @description
*/
'use strict';

const version = require('./package.json').version;
const hydraExpress = require('hydra-express');



let config = require('fwsp-config');

/**
* Load configuration file and initialize hydraExpress app
*/
config.init('./config/config.json').then(() => {
  config.version = version;

  return hydraExpress.init(config.getObject(), version, () => {
    hydraExpress.registerRoutes({
      '/v1/red': require('./routes/red-v1-routes')
    });
  });

}).then(serviceInfo => {
  let hydra = hydraExpress.getHydra();
  let message = hydra.createUMFMessage({
    to: 'blue-service:[get]/v1/blue/',
    from: 'red-service:/',
    body: {}
  });

  hydra.makeAPIRequest(message).then((response)=> {
    console.log('response:', response);
  });

  return 0;
}).catch(err => {

  console.log('err', err);

});
