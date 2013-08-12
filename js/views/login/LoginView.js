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
        
        events: {
        	"submit #loginForm": "login"
        },

        render: function(){
            this.$el.html(LoginTemplate);
            return this;
        },
        
        login: function(event){
        	event.preventDefault();
        	debugger
        	//Communication.checkLogin(function(data){alert('okay login');});
        }
    });

    return LoginView;

});