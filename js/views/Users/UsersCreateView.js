define([
    "text!templates/Users/CreateUserTemplate.html",
    "collections/Users/UsersCollection"
],
    function (CreateUserTemplate, UsersCollection) {

        var UsersCreateView = Backbone.View.extend({
            el: "#content-holder",
            template: _.template(CreateUserTemplate),

            initialize: function () {
                this.usersCollection = new UsersCollection();
                this.usersCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            close: function () {
                //this._modelBinder.unbind();
            },

            events: {
                "submit form": "submit"
            },

            submit: function (event) {
                event.preventDefault();

                var email = $("#email").val();
                if ($.trim(email) == "") {
                    email = "New Email";
                }
                var login = $("#login").val();
                if ($.trim(login) == "") {
                    login = "New Login";
                }
                var password = $("#password").val();
                if ($.trim(password) == "") {
                    password = "New Password";
                }

                this.usersCollection.create({
                    email: email,
                    login: login,
                    password: password
                });

            },
            render: function () {
                this.$el.html(this.template({ usersCollection: this.usersCollection }));
                return this;
            }
        });

        return UsersCreateView;
    });