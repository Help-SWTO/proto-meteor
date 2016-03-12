Missions = new Mongo.Collection("missions");

Router.route('/', function () {
    this.render('landing');
});

Router.route('/backoffice');

Router.route('/MyMissionLiked');

if (Meteor.isClient) {
    $(document).ready(function(){
        $(".button-collapse").sideNav();
    });

    // counter starts at 0
    Session.setDefault('counter', 0);

    Template.mission.helpers({
        'isLiked': function(){
            return this.liked === true;
        },
        'isUnliked': function(){
            return this.liked === false
        },
        'isNotEvaluated': function(){
            return !(this.liked === true || this.liked === false);
        }
    });

    Template.landing.helpers({
        missions: function () {
            return Missions.find({liked: null}, {sort: {createdAt: -1}});
        },
        templateGestures: {
            'swiperight .mission-card': function (event, templateInstance) {
                Missions.update(this._id, {
                    $set: {liked: true}
                });
                console.log('right');
            },
            'swipeleft .mission-card': function (event, templateInstance) {
                Missions.update(this._id, {
                    $set: {liked: false}
                });
                console.log('left');
            }

            /*
            'doubletap .mission-card': function (event, templateInstance) {
                console.log(event, templateInstance);
                console.log(this);
                alert('wut');
            }*/
        }
    });

    Template.MyMissionLiked.helpers({
        missions: function () {
            return Missions.find({liked: true}, {sort: {createdAt: -1}});
        }
    });

    Template.backoffice.helpers({
        missions: function () {
            return Missions.find({});
        }
    });

    Template.missionForm.events({
        'click .new-mission .button-submit': function (event) {
            // Prevent default browser form submit
            event.preventDefault();

            var form = $(event.target).parent();
            var titleInput = form.find('input[name="title"]');
            var whoInput = form.find('input[name="who"]');
            var whereInput = form.find('input[name="where"]');
            var whenInput = form.find('input[name="when"]');
            var descriptionInput = form.find('textare.description-textarea');
            var logoInput = form.find('input[name="logo"]');

            console.log(descriptionInput.html());

            Missions.insert({
                title: titleInput.val(),
                who: whoInput.val(),
                where: whereInput.val(),
                when: whenInput.val(),
                description: descriptionInput.html(),
                logo: logoInput.val(),
                createdAt: new Date()
            });

            titleInput.val('');
            whoInput.val('');
            whereInput.val('');
            whenInput.val('');
            descriptionInput.html('');
            logoInput.val('');
        }
    })
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
