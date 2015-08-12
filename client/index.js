// handles to template instance
var _weatherTemplate;
var _weatherDep = new Tracker.Dependency;

function updateWeather() {
    $('#main-panel').css('opacity', 0)
        .slideDown('slow')
        .animate(
            { opacity: 0 }, // opacity 0 is hidden
            { queue: false, duration: 'slow' }
    );

    var self = this;
    Meteor.call('getTodaysWeather', $('#city').val(), function(err, res) {
        if (err) {
            throw new Error('getTodaysWeather: ', err);
        } else {
            // console.log("Change dependency");
            _weatherDep.changed();
            $('#main-panel').css('opacity', 0)
                .slideDown('slow')
                .animate(
                    { opacity: 1 }, // opacity 1 is visible
                    { queue: false, duration: 'slow' }
            );

            Meteor.call('getStravaData', function(err) {
                if (err) {
                    throw new Error('getStrava: ', err);
                }
            });
        }
    });
}
Template.index.onRendered(function() {
    updateWeather();
});

function getRandomPositiveString() {
    var options = [
        "Yes!",
        "w00t!",
        "Cools --",
        "Nice.",
        "Suh-WEET!"
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
        _weatherDep.depend();
        if ($(document).ready()) {
            if (this.weather.length === 0) {
                return getRandomPositiveString() + "  No rain or snow in the last 24 hours."
            } else {
                return getRandomNegativeString() + "  There's been some weather."
            }
        }
    },
    icon: function() {
        _weatherDep.depend();
        // console.log("icon: ", this.weather);
        if (this.weather && this.weather.length === 0) {
            if (_weatherTemplate) {
                console.log("** remove weather template instance");
                Blaze.remove(_weatherTemplate);
                _weatherTemplate = null;
            }
            return 'img/noun_168576_cc.png';
        } else {
            if (!_weatherTemplate) {
                console.log(">> render weather template");
                _weatherTemplate = Blaze.renderWithData(Template.weather, Template.currentData(), document.getElementById('weather'));
            }
            return 'img/noun_50979_cc.png';
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
