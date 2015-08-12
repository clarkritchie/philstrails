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
    data: function() {
        if (this.ready()) {
            return {
                weather: Weather.find(),
                segments: this.getSegments()
            }
        }
    },
    action: function() {
        this.render();
    }
});
