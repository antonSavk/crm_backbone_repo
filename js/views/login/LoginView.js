define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login/LoginTemplate.html',
    'custom',
    'communication'
], function($, _, Backbone, LoginTemplate, Custom, Communication){

    var LoginView = Backbone.View.extend({
        el: '#wrapper',
        initialize: function(){
            this.render();
        },
        events: {
        	"submit #loginForm": "login"
        },
        render: function(){
            this.$el.html(LoginTemplate);
            return this;
        },
        login: function(event){
        	event.preventDefault();
        	var data = {
        			ulogin: this.$("#ulogin").val(),
        			upass: this.$("#upass").val()
        	};
        	Communication.checkLogin(data, Custom.runApplication);
        }
    });

    return LoginView;

});