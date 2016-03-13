Missions = new Mongo.Collection("missions");

Router.route('/', function () {
    this.render('landing');
});

Router.route('/backoffice');

Router.route('/MyMissionLiked');

Router.map(function () {
    this.route('missionDetail', {
        path: 'missionDetail/:id',
        template: 'missionDetail',
        data: function () {
            return Missions.findOne(this.params.id);
        }
    });
});

Router.route('/subscribe');

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

    Template.menu.events({
        'click .subscribe-logo': function(event){
            console.log('wat');
            window.location = '/';
        }
    });

    Template.card.events({
        'click .card-title': function(event){
            var _this = this;
            $(event.target).parent().parent().parent().parent().parent().animate({/*left:1000,*/height:0,opacity:0},600,'swing',function(){
                Missions.update(_this._id, {
                    $set: {liked: true}
                });
                console.log(event);
            });
        }
    });

    Template.landing.events({
        'click #btn-refuse': function(event)
        {
            console.log(event);
            Missions.update(_this._id, {
                $set: {liked: false}
            });
        },
        'click #btn-validate': function(event)
        {
            console.log(event);
            Missions.update(_this._id, {
                $set: {liked: true}
            });
        }
    });

    Template.landing.helpers({

        missions: function () {
            return Missions.find({liked: null}, {sort: {createdAt: -1}});
        },
        templateGestures: {
            'swiperight .mission-card': function (event, templateInstance) {

                var _this = this;
                $(event.target).parent().parent().parent().parent().parent().parent().animate({left:1000,height:0,opacity:0},600,'swing',function(){
                    Missions.update(_this._id, {
                        $set: {liked: true}
                    });
                    console.log(event);
                });

            },
            'swipeleft .mission-card': function (event, templateInstance) {
                var _this = this;
                $(event.target).parent().parent().parent().parent().parent().parent().animate({right:1000,height:0,opacity:0},600,'swing',function(){
                    Missions.update(_this._id, {
                        $set: {liked: false}
                    });
                });

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

    Template.MyMissionLiked.events({
        'click .mission-liked-wrapper': function(event)
        {

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
        },
        'click .add-all-button': function(event){
            Missions.insert({
                title: 'Accueillir les visiteurs',
                who: 'Tous profils',
                where: 'Paris, Bercy',
                when: '27 mars 2016',
                description: "La mission est orientée vers l'hospitalité, l'accueil, l'orientation, l'accompagnement et l'animation. L'objectif est de faciliter le séjour des visiteurs étrangers venus supporter leurs équipes. On vous attend ! La maîtrise d'une langue étrangère serait un plus",
                logo: 'https://www.om.net/sites/default/files/euro2016_logo.jpg',
                createdAt: new Date()
            });
            Missions.insert({
                title: 'Dispositif de secours',
                who: 'Secouristes',
                where: 'Olympia de Toulouse',
                when: '27 mars 2016',
                description: "Bénévole au sein des équipes secouristes de la Croix-Rouge, vous participerez au dispositif prévisionnel de secours à l'occasion du concert de maître Gims, et à nos opérations de secours en cas de catastrophe.",
                logo: 'http://tournanenbrie.croix-rouge.fr/IMG/gif/CRF.gif',
                createdAt: new Date()
            });
            Missions.insert({
                title: 'Animations pour les enfants',
                who: 'Secouristes',
                where: 'Olympia de Toulouse',
                when: '27 mars 2016',
                description: "UNICEF : Animations menée avec les représentants de la mairie et des acteurs du privé dans le but de défendre et de plaider la cause des enfants, notamment ceux victimes de profondes inégalités.",
                logo: 'http://www.yourlogoresources.com/wp-content/uploads/2011/08/unicef-logo1.gif',
                createdAt: new Date()
            });
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

            /*titleInput.val('');
            whoInput.val('');
            whereInput.val('');
            whenInput.val('');
            descriptionInput.val('');
            logoInput.val('');*/
        }
    })
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
