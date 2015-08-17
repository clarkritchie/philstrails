var _numPoachers;
var _colAdjusted;

Template.weather.onRendered(function() {
    // console.log("weather.onRendered", this.data.weather.length);
});

Template.weather.helpers({
    getPoachers: function() {
        var poachers = [];
        var self = this;
        _colAdjusted = false;
        var index = 0; // Spacebars lacks support for the @index helper, WTF?
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
                    index: index++,
                    weather: weather,
                    count: filteredSegments.length, // total number of segment rides in that hour
                    segment: filteredSegments[Math.floor(Math.random() * (filteredSegments.length))]
                }

                poachers.push(poacher);
            } // else would be if nobody rode during the hour there was bad weather
        });

        // poachers.push( {
        //     index: _.last(poachers).index + 1,
        //     weather: _.last(poachers).weather,
        //     count: _.last(poachers).count,
        //     segment: _.last(poachers).segment
        // });
        // console.log(poachers);
        _numPoachers = poachers.length;
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
    },
    getColWidth: function(index) {
        // index is 0 based
        index = index + 1;
        width = 'col-md-4';
        // console.log("index:", index, ", _numPoachers: ", _numPoachers);
        // var mod = index % _numPoachers;
        // console.log("mod: ", mod);
        if (!_colAdjusted && index >= _numPoachers - 1) {
            if (index === _numPoachers - 1) {
                // 2nd to last
                width += ' col-md-offset-2'
                _colAdjusted = true;
            } else if (index === _numPoachers) {
                // last
                width += ' col-md-offset-4';
                _colAdjusted = true;
            }
        }

        return width;
    }
});

Template.weather.events({
    // none
});
