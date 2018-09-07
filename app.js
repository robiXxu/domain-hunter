const whois = require('whois-json');
const chalk = require('chalk');
const notifier = require('node-notifier');
const path = require('path');


//TODO: from a config... 
const options = { 
  follow: 3,
  verbose: true
};

const delay = 2000;

const checkDomain = (domain) => {
  return whois(domain, options)
    .then(response => response[0].data.domainStatus)
    .then((domainStatus) => {
      if( domainStatus.toLowerCase() === "ok" ) {
        console.log(`[${domain}] : ${chalk.bold.green(domainStatus)}`);
  
        notifier.notify({
          title: 'Domain Hunter',
          message: `${domain} is available!!!`,
          icon: path.join( __dirname, 'dhunter.png'),
          sound: true,
          wait: true,
          timeout: 9999
        });

        if( typeof interval !== "undefined" ) clearInterval(interval);
        
      } else {
        console.log(`[${domain}] : ${chalk.bold.green(domainStatus)}`);
      }
    });
};

//TODO: load from file and allow multiple domain check 
const domain = 'saveni.ro';
const interval = setInterval(checkDomain, delay, domain);