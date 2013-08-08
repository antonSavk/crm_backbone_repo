// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router'
], function($, _, Backbone, Router){

    var initialize = function(){

        var app_router = new Router();
        Backbone.history.start();
    }

    return {
        initialize: initialize
    };
});
