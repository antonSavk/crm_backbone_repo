// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
   'localstorage',
   'communication',
   'custom'
], function($, _, Backbone, Router, LocalStorage, Communication, Custom){

    var initialize = function(){
    	Communication.checkHash(Custom.runApplication);
    	var appRouter = new Router();
        Backbone.history.start();
    };

    return {
        initialize: initialize
    }
});
