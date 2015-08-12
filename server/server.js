if (Meteor.isServer) {
    Meteor.startup(function() {
        // nothing
    });

    // https://github.com/UnbounDev/node-strava-v3
    // http://strava.github.io/api/
    // http://www.gps-coordinates.net/
    // http://openweathermap.org/weather-conditions
    // http://openweathermap.org/find
    // http://openweathermap.org/help/city_list.txt

    // Returns a random integer between min (inclusive) and max (inclusive)
    // Using Math.round() will give you a non-uniform distribution!
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getTimestamp() {
        // returns time in seconds
        return Math.round(new Date().getTime() / 1000);
    }

    function fetchWeather(id, cityId) {
        var weatherUrl = "http://api.openweathermap.org/data/2.5/history/city?id=" + cityId + "&type=day";
        HTTP.call("GET", weatherUrl, null,
            function(err, res) {
                if (err) {
                    // console.log("err: ", err);
                } else {
                    // console.log("res: ", res.data);
                    res.data._id = id || Random.id();
                    Weather.insert(res.data);
                }
            });
    }

    Meteor.methods({
        getTodaysWeather: function(cityId) {
            var weather = Weather.findOne({}, {sort: {timestamp: -1}});

            if (weather.city_id != cityId) {
                Weather.remove({});
            }
            var now = getTimestamp();
            if ((weather.city_id != cityId) || !weather || (now - weather.timestamp > 600)) {
                var id = null;
                if (weather) {
                    id = weather._id;
                }
                console.log("last weather insert more than 10 min ago, city changed or no weather");
                fetchWeather(id, cityId);
            } else {
                console.log("no weather fetch required");
            }
        },
        getStravaData: function() {
            // To include Node modules when deploying to meteor.com:
            // @see http://stackoverflow.com/questions/10476170/how-can-i-deploy-node-modules-in-a-meteor-app-on-meteor-com
            // e.g.
            // cd public
            // mkdir node_modules
            // npm install foo

            var strava = Meteor.npmRequire('strava-v3');
            // process.env.STRAVA_CLIENT_SECRET = Meteor.settings.STRAVA_CLIENT_SECRET;
            // process.env.STRAVA_ACCESS_TOKEN = Meteor.settings.STRAVA_ACCESS_TOKEN;
            // process.env.STRAVA_CLIENT_ID = Meteor.settings.STRAVA_CLIENT_ID;

            // boundaries of our box from which we will get all segments
            var ne = {
                lat: 44.049627,
                lng: -121.383755
            }

            var sw = {
                lat: 43.984354,
                lng: -121.480594
            }

            var segmentData = {
                bounds: sw.lat + "," + sw.lng + "," + ne.lat + "," + ne.lng,
                activity_type: 'riding', // default, not required
                access_token: Meteor.settings.STRAVA_ACCESS_TOKEN
            }

            var stravaSegmentsSync = function(segmentData, callback) {
                Meteor.wrapAsync(
                    strava.segments.explore(segmentData, function(err,res) {
                        callback(err, res);
                    }) // strava.segments.explore
                ) // wrapAsync
            }

            var stravalListEffortsSync = function(segmentFilter, callback) {
                Meteor.wrapAsync(
                    strava.segments.listEfforts(segmentFilter, function(err,res) {
                        callback(err, res);
                    }) // strava.segments.listEfforts
                ) // wrapAsync
            }

            // @see Meteor.bindEnvironment
            // https://www.discovermeteor.com/blog/wrapping-npm-packages/
            stravaSegmentsSync(segmentData, Meteor.bindEnvironment(function(err, res) {
                if (err) {
                    // console.log("stravaSegmentsSync Err: ",err);
                    throw new Error('stravaSegmentsSync Err: ', err);
                } else {
                    console.log("*** ", res);
                    _.each(res.segments, function(segment) {
                        console.log("*** Segment:  ", segment);
                        // console.log("*** Segment:  ", segment.name + ", id: " + segment.id);
                        var date = new Date();
                        var dateOffset = (24*60*60*1000) * 1; // 1 day
                        var endDate = date.toISOString(); // now
                        date.setTime(date.getTime() - dateOffset);
                        var beginDate = date.toISOString();
                        // console.log("From " + beginDate + " to " + endDate);
                        var segmentFilter ={
                            id: segment.id,
                            start_date_local: beginDate,
                            end_date_local: endDate,
                            access_token: Meteor.settings.STRAVA_ACCESS_TOKEN
                        }

                        stravalListEffortsSync(segmentFilter, Meteor.bindEnvironment(function(err, res) {
                            if (err) {
                                // console.log("stravalListEffortsSync Err: ",err);
                                throw new Error('stravalListEffortsSync Err: ', err);
                            } else {
                                console.log("stravalListEffortsSync *** ", res);
                                _.each(res, function(item) {
                                    if (!Segments.findOne({id: item.id})) {
                                        Segments.insert(item);
                                    }
                                });
                                // console.log("Delete older than:", segmentFilter.start_date_local);
                                Segments.remove(
                                    { start_date: { $lt: segmentFilter.start_date_local } }
                                );
                            }
                        }));
                    })
                }
            }));
        }
    });
}
