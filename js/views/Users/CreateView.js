define([
    "text!templates/Users/CreateUserTemplate.html",
    "collections/Users/UsersCollection",
    "collections/Companies/CompaniesCollection",
    "collections/Profiles/ProfilesCollection",
    "models/UserModel",
    "localstorage"
],
    function (CreateUserTemplate, UsersCollection, CompaniesCollection, ProfilesCollection, UserModel, LocalStorage) {

        var UsersCreateView = Backbone.View.extend({
            el: "#content-holder",
            template: _.template(CreateUserTemplate),

            initialize: function () {
                this.usersCollection = new UsersCollection();
                this.usersCollection.bind('reset', _.bind(this.render, this));
                this.profilesCollection = new ProfilesCollection();
                this.profilesCollection.bind('reset', _.bind(this.render, this));
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            close: function () {
                //this._modelBinder.unbind();
            },

            events: {
                "submit form": "submit"
            },

            submit: function (event) {
                var self = this;
                event.preventDefault();
                var hash = LocalStorage.getFromLocalStorage('hash'),
                    uid = LocalStorage.getFromLocalStorage('uid'),
                    mid = 39;
                this.model = new UserModel();
                this.model.set({
                    uemail:$('#email').val(),
                    ulogin:$('#login').val(),
                    upass:$('#password').val(),
                    profile:{
                        company:{
                            id:$('#companiesDd option:selected').val(),
                            name: $('#companiesDd option:selected').text()
                        },
                        profile:{
                            id:$('#profilesDd option:selected').val(),
                            name: $('#profilesDd option:selected').text()
                        }
                    }
                }, {validate:true, confirmPass:$('#confirmpassword').val()});
                this.model.save(null,
                    {
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
                        },
                        confirmPass:$('#confirmpassword').val()
                    });

            },
            render: function () {
                this.$el.html(this.template({ usersCollection: this.usersCollection, companiesCollection: this.companiesCollection, profilesCollection:this.profilesCollection }));
                return this;
            }
        });

        return UsersCreateView;
    });