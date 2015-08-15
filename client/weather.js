var _weatherIconBase = "http://openweathermap.org/img/w/";
var _randomPoacher;
var _countByHour;

Template.weather.onRendered(function() {
    // nothing
    // console.log("weather.onRendered", this.data);
    console.log("weather.onRendered", this.data.weather.length);
});

function setPoacher(time, segments) {
    // time is in seconds
    var isoTime = new Date(time * 1000).toISOString();
    var isoTimePlusOneHour = new Date((time + 3600) * 1000).toISOString();
    // console.log("setPoacher: ",isoTime, + " -> ", isoTimePlusOneHour);

    var filteredSegments = _.filter(segments, function(segment) {
        // console.log(segment.start_date_local + " ? vs. " + isoTime + " to " + isoTimePlusOneHour );
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
                str = "In the last hour";
                break;
            case 1:
                str += ' ago';
                break;
            default:
                str += 's ago';
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
    atLeastOnePoacher: function(time, segments) {
        return setPoacher(time, segments);
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
    },
    count: function() {
        _count++;
    },
    colWidth: function() {
        console.log("_count: ",_count);
        var str = '';
        if (this.weather.length % 2 === 0) {
            console.log(this.weather.length + " mod 2 is 0" );
            str = 'col-sm-3';

        } else {
            str = 'col-sm-4';
        }
        return str;
    }
});

Template.weather.events({
    // none
});
