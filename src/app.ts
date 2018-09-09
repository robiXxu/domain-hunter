import dotenv from 'dotenv';
import chalk from 'chalk';
import notifier from 'node-notifier';
import path from 'path';
import config from './static/config.json';
import domains from './static/domains.json';
import whois from 'whois-to-json';
import sendMail from 'gmail-send';

dotenv.config();

const envVars: string[] = [
  'DOMAIN_HUNTER_EMAIL_USER',
  'DOMAIN_HUNTER_EMAIL_PASS',
  'DOMAIN_HUNTER_EMAIL_TO'
];

const notifyByEmail: boolean = envVars
  .filter((k: string) => process.env[k] && (process.env[k] as string).trim().length > 0)
  .length === envVars.length;

const notify = ( domain: string ) => {
  if ( notifyByEmail ) {
    const wildcard: RegExp = /%DOMAIN%/gm;

    sendMail(
      {
        ...config.email,
        user: process.env.DOMAIN_HUNTER_EMAIL_USER,
        pass: process.env.DOMAIN_HUNTER_EMAIL_PASS,
        to: process.env.DOMAIN_HUNTER_EMAIL_TO,
        subject: config.email.subject.replace(wildcard, domain),
        html: config.email.htmlData
          .map(l => l.replace(wildcard, domain))
          .join('<br>')
      },
      (err: null | object) => {
        err
          ? console.error(chalk.bold.red(`Error while sending email: ${err}`))
          : console.log(chalk.bold.blue('Email sent successfully!'));
      }
    );
  } else {
    notifier.notify({
      ...config.notify,
      icon: path.join(__dirname, 'src', 'assets', 'dhunter.png'),
      message: `${domain} is available! Buy now!`
    });
  }
};

const checkDomain = ( domain: string) => {
  whois( domain )
    .then(( response: any ) => response.DomainStatus)
    .then(( domainStatus: string | undefined ) => {
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
    .catch(( error: object ) => {
      console.error(`[${chalk.bold.red('ERROR')}]: ${JSON.stringify(error)}`);
      checkDomain(domain);
    });
};

domains.forEach(domain => checkDomain(domain));
