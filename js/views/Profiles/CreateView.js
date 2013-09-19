define([
    "text!templates/Profiles/CreateProfileTemplate.html",
    "models/ProfileModel",
    "localstorage"
],
    function (CreateProfileTemplate, ProfileModel, LocalStorage) {
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
            submitForm: function(event){
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
                        headers:{
                            uid: uid,
                            hash: hash,
                            mid: mid
                        }
                    });
                }
                Backbone.history.navigate("home/content-"+this.contentType, {trigger:true});
            },
            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return CreateView;
    });