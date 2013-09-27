define([
    "text!templates/Profiles/CreateProfileTemplate.html",
    "models/ProfileModel",
    "localstorage",
    "collections/Users/UsersCollection"
],
    function (CreateProfileTemplate, ProfileModel, LocalStorage, UsersCollection) {
        var CreateView = Backbone.View.extend({
            el: '#content-holder',
            contentType: "Profiles",
            template: _.template(CreateProfileTemplate),
            initialize: function (options) {
                this.model = new ProfileModel();
                this.render();
            },
            events:{
                "submit #createProfileForm": "submitForm"
            },
            submitForm: function (event) {
                var self = this;
                event.preventDefault();
                var hash = LocalStorage.getFromLocalStorage('hash'),
                    uid = LocalStorage.getFromLocalStorage('uid'),
                    mid = 39;

                this.model.set({
                    profileName: $('#profileNameInput').val(),
                    profileDescription: $('#profileDescInput').val()
                });
                if(this.model.isNew()){
                    this.model.save(null,{
                        headers: {
                            uid: uid,
                            hash: hash,
                            mid: mid
                        },
                        wait: true,
                        success: function (model) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });
                }
            },
            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return CreateView;
    });