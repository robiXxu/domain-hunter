# domain-hunter

#### A small app made to "hunt" domains that are about to be available.
---

## Run

* Install [nodejs](https://nodejs.org/en/download/) if you don't have it.
* Install [PM2](https://pm2.io/doc/en/runtime/quick-start/)
```
npm install -g pm2
```
* Clone repo
```
git clone git@github.com:robiXxu/domain-hunter.git
```
* Navigate to domain-hunter directory
* Run
```
pm2 start app.js
```
* Monitoring
```
pm2 monit
```

---

## Dev
* Install [nodejs](https://nodejs.org/en/download/) or [yarn](https://yarnpkg.com/en/docs/install) if you don't have it. 
* Install [PM2](https://pm2.io/doc/en/runtime/quick-start/)
```
npm install -g pm2
```
* Clone repo
```
git clone git@github.com:robiXxu/domain-hunter.git
```
* Navigate to domain-hunter directory
* Install dependencies
```
npm install
```
* Install nodemon globally
```
npm install -g nodemon
```
* Run in dev
```
npm run dev
```
---

## TODO
- [ ] Ability to choose between push notification or email based notification ( maybe run on a Raspberry PI )
- [ ] replace whois-json with a native implementation of whois in unix systems to avoid calls. (Will not work on Win)
