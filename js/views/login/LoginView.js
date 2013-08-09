define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login/loginTemplate.html'
], function($, _, Backbone, loginTemplate){

    var LoginView = Backbone.View.extend({

        el: '#loginDiv',

        render: function(){
            this.$el.html(loginTemplate);
            return this;
        }
    });

    return LoginView;

});