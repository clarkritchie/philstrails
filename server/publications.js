Meteor.publish('weather', function() {
    return Weather.find({});
});
Meteor.publish('segments', function() {
    return Segments.find({});
});
