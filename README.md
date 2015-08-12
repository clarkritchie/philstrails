# Phil's Trails

### Description

A test mashup using the [Open Weather Map](http://openweathermap.org/api) and [Strava ](http://strava.github.io/api/) APIs.  Written in [Meteor](http://www.meteor.com) using the [Simple Node wrapper for Strava v3 API](https://github.com/UnbounDev/node-strava-v3) and the [npm-container](https://github.com/meteorhacks/npm) module.

### API Keys

`settings.json` should look like this:
```
{
    "STRAVA_CLIENT_SECRET": "your_secret_here",
    "STRAVA_ACCESS_TOKEN": "your_token_here",
    "STRAVA_CLIENT_ID": "your_id_here"
}
```

### Run
* `./run.sh` then `http://localhost:3030/`
* `meteor --settings settings.json` `http://localhost:3000/` (default port)