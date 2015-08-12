var _weatherIconBase = "http://openweathermap.org/img/w/";

Template.weather.onRendered(function() {
    // nothing
});

// TODO revisit, since this is technically called twice
function getFilteredSegments(time, segments) {
    // time is in seconds
    var isoTime = new Date(time * 1000).toISOString()
    var isoTimePlusOneHour = new Date((time + 3600) * 1000).toISOString()
    var filteredSegments = _.filter(segments, function(segment){
        return segment.start_date_local >= isoTime && segment.start_date_local <= isoTimePlusOneHour;
    });
    return filteredSegments;
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
        if (getFilteredSegments(this.time, segments).length) {
            return true;
        }
        return false;
    },
    getRandomPoacher: function(segments) {
        var filteredSegments = getFilteredSegments(this.time, segments);
        // if at least one person rode the segment during the timeframe
        if (filteredSegments.length) {
            var randomPoacher = filteredSegments[Math.floor(Math.random() * (filteredSegments.length))];
            var str = '<a href="https://www.strava.com/activities/' + randomPoacher.activity.id + '">';
            str += randomPoacher.name;
            str += '</a>';
            return str;
        }
    }
});

Template.weather.events({
    // none
});
