var weatherDep = new Tracker.Dependency;
var _stravaTemplate; // handle to template instance

function updateWeather() {
    Meteor.call('getTodaysWeather', $('#city').val(), function(err, res) {
        if (err) {
            console.log("err: ", err);
        } else {
            weatherDep.changed();
        }
    });
}

Template.index.onRendered(function() {
    // console.log("onRendered: ", this.data.weather.fetch());
    updateWeather();
});

function getRandomPositiveString() {
    var options = [
        "Yes!",
        "w00t!",
        "Cools."
    ]
    var x = Math.floor(Math.random() * (options.length));
    return options[x];
}

function getRandomNegativeString() {
    var options = [
        "Eff!",
        "Drat.",
        "Oh Noes!",
        "Boo!"
    ]
    var x = Math.floor(Math.random() * (options.length));
    return options[x];
}

Template.index.helpers({
    title: function() {
        return "Is it dry at Phil's Trail?"
    },
    weatherData: function() {
        weatherDep.depend();

        // can't proceed unless the DOM is ready
        if (!$(document).ready()) {
            return;
        }

        var rained = false;
        var rainTypes = [];
        var weather = Weather.findOne();
        if (weather) {
            _.each(weather.list, function(hourWeather) {
                // console.log(hourWeather);
                var w = _.first(hourWeather.weather);
                if (w && w.id >= 500 && w.id < 600) {
                    // console.log(w);
                    rained = true;
                    // keep track of the rain kind
                    if (_.findWhere(rainTypes, {id: w.id}) == null) {
                        rainTypes.push(w);
                    }
                }
            });
        }
        rainTypes = _.uniq(rainTypes);

        // console.log("rained? ",rained);
        // console.log("rainTypes: ",rainTypes);

        // http://localhost:3000/img/noun_168576_cc.png
        if (!rained) {
            // cleanup UI
            if (_stravaTemplate) {
                $("#sad-face").addClass('hidden');
                Blaze.remove(_stravaTemplate);
            }
            // end cleanup

            $('.weather').text( getRandomPositiveString() + "  There hasn't been been any rain or snow in the last 24 hours.");
            $('.message').text("Go ride your bike!");
            $("#wheel").removeClass('hidden').animate({
                left: '250px',
                opacity: '0.5',
                height: '300px',
                width: '300px'
            });
        } else {
            // cleanup UI
            $("#wheel").addClass('hidden');
            $('.message').text("");
            if (_stravaTemplate) {
                Blaze.remove(_stravaTemplate);
            }
            // end cleanup

            var str = getRandomNegativeString() + "  There has been ";
            var n = 0;
            _.each(rainTypes, function(rainType) {
                str += rainType.description;
                n++;
                if (n < rainTypes.length) {
                    str += ", ";
                }
                if (n === (rainTypes.length - 1)) {
                    str += " and ";
                }
            });
            str += ".";
            $('.weather').text(str);
            $("#sad-face").removeClass('hidden').animate({
                left: '250px',
                opacity: '0.5',
                height: '300px',
                width: '300px'
            });
            // data supplied by IR data context
            _stravaTemplate = Blaze.render(Template.strava, document.getElementById("strava"));
            Meteor.call('getStravaData', function(err) {
                if (err) {
                    console.log("getStrava err: ", err);
                }
            });
        }

    }
});

Template.index.events({
    'change #city': function(e) {
        e.preventDefault();
        updateWeather();
    }
});
