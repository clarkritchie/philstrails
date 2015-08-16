
if (Meteor.isServer) {
    Meteor.startup(function() {
        // nothing
    });

    // Useful links:
    // https://github.com/UnbounDev/node-strava-v3
    // http://strava.github.io/api/
    // http://www.gps-coordinates.net/
    // http://openweathermap.org/weather-conditions
    // http://openweathermap.org/find
    // http://openweathermap.org/help/city_list.txt

    function fetchWeather(id, cityId) {
        var weatherUrl = "http://api.openweathermap.org/data/2.5/history/city?id=" + cityId + "&type=day";
        HTTP.call("GET", weatherUrl, null,
            function(err, res) {
                if (err) {
                    throw new Error('fetchWeather Err: ', err);
                } else {
                    res.data._id = id || Random.id();
                    Weather.insert(res.data);
                }
            });
    }

    Meteor.methods({
        getTodaysWeather: function(cityId) {
            var weather = Weather.findOne({}, {sort: {timestamp: -1}});
            if (weather && weather.city_id != cityId) {
                Weather.remove({});
            }

            if (!weather) {
                // no data in db
                fetchWeather(id, cityId);
            } else if ((weather.city_id != cityId) || (getTimestamp() - weather.timestamp > 600)) {
                var id = weather._id;
                // last weather insert more than 10 min ago or city changed
                fetchWeather(id, cityId);
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
                    throw new Error('stravaSegmentsSync Err: ', err);
                } else {
                    _.each(res.segments, function(segment) {
                        var date = new Date();
                        var dateOffset = (24*60*60*1000) * 1; // 1 day
                        var endDate = date.toISOString(); // now
                        date.setTime(date.getTime() - dateOffset);
                        var beginDate = date.toISOString();
                        var segmentFilter ={
                            id: segment.id,
                            start_date_local: beginDate,
                            end_date_local: endDate,
                            access_token: Meteor.settings.STRAVA_ACCESS_TOKEN
                        }

                        stravalListEffortsSync(segmentFilter, Meteor.bindEnvironment(function(err, res) {
                            if (err) {
                                throw new Error('stravalListEffortsSync Err: ', err);
                            } else {
                                _.each(res, function(item) {
                                    if (!Segments.findOne({id: item.id})) {
                                        Segments.insert(item);
                                    }
                                });
                                // delete items older than start_date_local
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
