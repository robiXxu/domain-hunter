const whois = require('whois-to-json');
const chalk = require('chalk');
const notifier = require('node-notifier');
const path = require('path');
const config = require(path.join(__dirname, 'config.json'));
const domains = require(path.join(__dirname, config.domainsFile));

const checkDomain = (domain) => {
  whois(domain)
    .then(response => response['DomainStatus'])
    .then((domainStatus) => {
      if( typeof domainStatus === "undefined") {
        console.log(`[${chalk.bold.blue(domain)}] : ${chalk.bold.green('AVAILABLE')}`);
  
        notifier.notify({
          ...config.notify,
          message: `${domain} is available! Buy now!`,
          icon: path.join( __dirname, 'dhunter.png'),
        });
        
      } else {
        console.log(`[${chalk.bold.blue(domain)}] : ${chalk.bold.gray(domainStatus)}`);
        checkDomain(domain);
      }
    })
    .catch((error) => {
      console.error(`[${chalk.bold.red("ERROR")}]: ${error}`);
      checkDomain(domain);
    });
};

domains.forEach(domain => checkDomain(domain));