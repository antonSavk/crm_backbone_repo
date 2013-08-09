define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login/LoginTemplate.html'
], function($, _, Backbone, LoginTemplate){

    var LoginView = Backbone.View.extend({

        el: '#content-holder',

        render: function(){
            this.$el.html(LoginTemplate);
            return this;
        }
    });

    return LoginView;

});