Template.strava.onRendered(function() {
    // console.log("strava--> ", this.data.segments.fetch() );
});

Template.strava.helpers({
    count: function(id) {
        var n = Segments.find().count();
        if (n===1) {
            return n + " segment was ";
        } else {
            return n + " segments were ";
        }
    },
    getRandomSegment: function(data) {
        var randomSegment = this.segments[Math.floor(Math.random()*this.segments.length)];
        return randomSegment;
    },
    athlete: function() {
        return ""; // TBD
    }
});
