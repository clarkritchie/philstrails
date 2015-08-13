var _weatherIconBase = "http://openweathermap.org/img/w/";
var _randomPoacher;
var _countByHour;

Template.weather.onRendered(function() {
    // nothing
    console.log("weather.onRendered", this.data);
});

function setPoacher(time, segments) {
    // time is in seconds
    var isoTime = new Date(time * 1000).toISOString();
    var isoTimePlusOneHour = new Date((time + 3600) * 1000).toISOString();
    // console.log("isoTime: ",isoTime);
    // console.log("isoTimePlusOneHour: ",isoTimePlusOneHour);

    var filteredSegments = _.filter(segments, function(segment){
        return segment.start_date_local >= isoTime && segment.start_date_local <= isoTimePlusOneHour;
    });

    // if at least one person rode the segment during the timeframe
    if (filteredSegments.length) {
        _countByHour = filteredSegments.length;
        _randomPoacher = filteredSegments[Math.floor(Math.random() * (filteredSegments.length))];
        // console.log("Setting _randomPoacher: ",_randomPoacher);
        return true;
    }
    _countByHour = 0;
    return false;
}

Template.weather.helpers({
    getHour: function() {
        var str = this.hour + ' hour';
        switch(this.hour) {
            case 0:
                str = "Current hour";
                break;
            default:
                str += 's';
                break;
        }
        return str;
    },
    getWeatherDescription: function() {
        return this.weather.description;
    },
    getWeatherIcon: function() {
        return _weatherIconBase + this.weather.icon + '.png';
    },
    atLeastOnePoacher: function(segments) {
        // console.log("? ",setPoacher(this.time, segments));
        return setPoacher(this.time, segments);
    },
    getPoacher: function() {
        // if at least one person rode the segment during the timeframe
        // console.log("_randomPoacher: ", _randomPoacher);
        if (_randomPoacher) {
            var str = '<a href="https://www.strava.com/activities/' + _randomPoacher.activity.id + '">';
            str += _randomPoacher.name;
            str += '</a>';
            return str;
        }
    },
    getCount: function() {
        if (_countByHour === 1) {
            return _countByHour + ' person';
        };
        return _countByHour + ' people';
    }
});

Template.weather.events({
    // none
});
