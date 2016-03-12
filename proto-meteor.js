Missions = new Mongo.Collection("missions");

if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Template.body.helpers({
        missions: function () {
            return Missions.find({}, {sort: {createdAt: -1}});
        }
    });

    Template.missionForm.events({
        'click .new-mission .button-submit': function (event) {
            // Prevent default browser form submit
            event.preventDefault();

            var form = $(event.target).parent();
            console.log(form.data());
            var title = form.find('input[name="title"]').val();
            var description = form.find('input[name="description"]').val();

            console.log('title', title);
            console.log('description', description);

            // Get value from form element
            //var title = event.target.title.value;

            // Insert a task into the collection
            Missions.insert({
                title: title,
                description: description,
                createdAt: new Date() // current time
            });

            // Clear form
            event.target.title.value = "";
        }
    })
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
