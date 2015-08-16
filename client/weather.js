Template.weather.onRendered(function() {
    // console.log("weather.onRendered", this.data.weather.length);
});

Template.weather.helpers({
    getPoachers: function() {
        var poachers = [];
        var self = this;
        _.each(this.weather, function(weather) {
            // weather.time is in seconds
            var isoTime = new Date(weather.time * 1000).toISOString();
            var isoTimePlusOneHour = new Date((weather.time + 3600) * 1000).toISOString();
            // console.log("Time range: ",isoTime, " to ", isoTimePlusOneHour);

            var filteredSegments = _.filter(self.segments, function(segment) {
                // console.log(segment.start_date_local + " ? vs. " + isoTime + " to " + isoTimePlusOneHour );
                return segment.start_date_local >= isoTime && segment.start_date_local <= isoTimePlusOneHour;
            });

            // if at least one person rode the segment during the timeframe
            if (filteredSegments.length) {
                var poacher = {
                    weather: weather,
                    count: filteredSegments.length, // total number of segment rides in that hour
                    segment: filteredSegments[Math.floor(Math.random() * (filteredSegments.length))]
                }

                poachers.push(poacher);
            } // else would be if nobody rode during the hour there was bad weather
        });
        return poachers;
    },
    getFormattedHour: function(hour) {
        var str;
        switch(hour) {
            case 0:
                str = "In the last hour";
                break;
            case 1:
                str = hour + ' hour ago';
                break;
            default:
                str = hour + ' hours ago';
                break;
        }
        return str;
    },
    getFormattedCount: function(count) {
        var str;
        switch(count) {
            case 1:
                str = count + ' person';
                break;
            default:
                str = count + ' people';
                break;
        }
        return str;
    }
});

Template.weather.events({
    // none
});
