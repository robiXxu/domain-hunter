const whois = require('whois-json');
const chalk = require('chalk');
const notifier = require('node-notifier');
const path = require('path');
const config = require(path.join(__dirname, 'config.json'));
const domains = require(path.join(__dirname, config.domainsFile));

const checkDomain = (domain) => {
  whois(domain, config.whois)
    .then(response => response[0].data.domainStatus)
    .then((domainStatus) => {
      if( domainStatus.toLowerCase() === "ok" ) {
        console.log(`[${chalk.bold.blue(domain)}] : ${chalk.bold.green(domainStatus)}`);
  
        notifier.notify({
          title: 'Domain Hunter',
          message: `${domain} is available! Buy now!`,
          icon: path.join( __dirname, 'dhunter.png'),
          sound: true,
          wait: true,
          timeout: 9999
        });
        
      } else {
        console.log(`[${chalk.bold.blue(domain)}] : ${chalk.bold.red(domainStatus)}`);
        checkDomain(domain);
      }
    })
    .catch((error) => {
      console.error(`[${chalk.bold.red("ERROR")}]: ${error}`);
      checkDomain(domain);
    });
};

domains.forEach(domain => checkDomain(domain));