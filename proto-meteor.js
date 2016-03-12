Missions = new Mongo.Collection("missions");

Router.route('/', function () {
    this.render('landing');
});

Router.route('/backoffice');

Router.route('/MyMissionLiked');

/*Template.task_app.tasks = function () {
    return Tasks.find({task_name: task_name});
};*/

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

                var _this = this;
                console.log(this);
                console.log('right');
                console.log(event);
                console.log(templateInstance);
                $(event.target).animate({left:1000},600,'swing',function(){
                    Missions.update(_this._id, {
                        $set: {liked: true}
                    });
                });

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

    Template.backoffice.events({
        'click .delete-all-button': function(event){
            var missions = Missions.find({});
            missions.forEach(function(mission){
                Missions.remove(mission._id);
            });
        },
        'click .delete-one-button': function(event){
            Missions.remove(this._id);
        }
    });

    Template.missionForm.events({
        'click .new-mission .button-submit': function (event) {
            // Prevent default browser form submit
            event.preventDefault();

            var form = $('#mission-form');


            var titleInput = form.find('input[name="title"]');
            var whoInput = form.find('input[name="who"]');
            var whereInput = form.find('input[name="where"]');
            var whenInput = form.find('input[name="when"]');
            var descriptionInput = form.find('.description-textarea');
            var logoInput = form.find('input[name="logo"]');

            console.log(descriptionInput.val());

            Missions.insert({
                title: titleInput.val(),
                who: whoInput.val(),
                where: whereInput.val(),
                when: whenInput.val(),
                description: descriptionInput.val(),
                logo: logoInput.val(),
                createdAt: new Date()
            });

            titleInput.val('');
            whoInput.val('');
            whereInput.val('');
            whenInput.val('');
            descriptionInput.val('');
            logoInput.val('');
        }
    })
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
