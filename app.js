require('dotenv').config();
const whois = require('whois-to-json');
const chalk = require('chalk');
const notifier = require('node-notifier');
const path = require('path');

const config = require(path.join(__dirname, 'config.json'));
const domains = require(path.join(__dirname, config.domainsFile));
const sendMail = require('gmail-send')(config.email);

const envVars = [
  'DOMAIN_HUNTER_EMAIL_USER',
  'DOMAIN_HUNTER_EMAIL_PASS',
  'DOMAIN_HUNTER_EMAIL_TO'
];

config.notifyByEmail = envVars
  .filter(k => process.env[k] && process.env[k].trim().length > 0)
  .length === envVars.length;

const notify = domain => {
  if (config.notifyByEmail) {
    const wildcard = /%DOMAIN%/gm;

    sendMail(
      {
        user: process.env.DOMAIN_HUNTER_EMAIL_USER,
        pass: process.env.DOMAIN_HUNTER_EMAIL_PASS,
        to: process.env.DOMAIN_HUNTER_EMAIL_TO,
        subject: config.email.subject.replace(wildcard, domain),
        html: config.email.htmlData
          .map(l => l.replace(wildcard, domain))
          .join('<br>')
      },
      (err) => {
        err
          ? console.error(chalk.bold.red(`Error while sending email: ${err}`))
          : console.log(chalk.bold.blue('Email sent successfully!'));
      }
    );
  } else {
    notifier.notify({
      ...config.notify,
      message: `${domain} is available! Buy now!`,
      icon: path.join(__dirname, 'assets', 'dhunter.png')
    });
  }
};

const checkDomain = domain => {
  whois(domain)
    .then(response => response.DomainStatus)
    .then(domainStatus => {
      if (typeof domainStatus === 'undefined') {
        console.log(
          `[${chalk.bold.blue(domain)}] : ${chalk.bold.green('AVAILABLE')}`
        );
        notify(domain);
      } else {
        console.log(
          `[${chalk.bold.blue(domain)}] : ${chalk.bold.gray(domainStatus)}`
        );
        checkDomain(domain);
      }
    })
    .catch(error => {
      console.error(`[${chalk.bold.red('ERROR')}]: ${JSON.stringify(error)}`);
      checkDomain(domain);
    });
};

domains.forEach(domain => checkDomain(domain));
