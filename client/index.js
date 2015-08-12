// handles to template instances
var _stravaTemplate;
var _weatherTemplate;

Template.index.onRendered(function() {
    Meteor.call('getTodaysWeather', $('#city').val(), function(err, res) {
        if (err) {
            throw new Error('getTodaysWeather: ', err);
        } else {
            Meteor.call('getStravaData', function(err) {
                if (err) {
                    throw new Error('getStrava: ', err);
                }
            });
        }
    });
});

function getRandomPositiveString() {
    var options = [
        "Yes!",
        "w00t!",
        "Cools."
    ]
    return options[Math.floor(Math.random() * (options.length))];
}

function getRandomNegativeString() {
    var options = [
        "Eff!",
        "Drat.",
        "Oh Noes!",
        "Boo!",
        "Aw shucks.",
        "Shoot."
    ]
    return options[Math.floor(Math.random() * (options.length))];
}

Template.index.helpers({
    title: function() {
        return "Is it dry at Phil's Trail?"
    },
    weatherString: function() {
        if ($(document).ready()) {
            if (this.weather.length === 0) {
                return getRandomPositiveString() + "  There hasn't been been any rain or snow in the last 24 hours."
            } else {
                return getRandomNegativeString() + "  There's been some weather."
            }
        }
    }
});

Template.index.events({
    // for debugging
    'change #city': function(e) {
        e.preventDefault();
        updateWeather();
    }
});
