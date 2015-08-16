Router.route('/', {
    name: 'index',
    controller: 'MainAppController'
});

MainAppController = RouteController.extend({
    template: 'index',
    waitOn: function() {
        return [
            Meteor.subscribe('weather'),
            Meteor.subscribe('segments')
        ]
    },
    getSegments: function() {
        return _.sortBy(Segments.find().fetch(), 'name');
    },
    getWeather: function() {
        var weatherHistory = [];
        var weather = Weather.findOne();
        if (weather) {
            var hour = 0;
            _.each(weather.list, function(hourWeather) {
                var w = _.first(hourWeather.weather);
                // 500 = rain, 600 = snow
                if (w && w.id >= 500 && w.id < 700) {
                    var hourData = {
                        hour: hour, // our offset, counting backward
                        time: hourWeather.dt, // this will adjusted for localtime
                        weather: w
                    }
                    weatherHistory.push(hourData);
                }
                hour++; // increment hour counter
            });
        }
        return weatherHistory;
    },
    data: function() {
        if (this.ready()) {
            return {
                weather: this.getWeather(),
                segments: this.getSegments()
            }
        }
    },
    action: function() {
        this.render();
    }
});
