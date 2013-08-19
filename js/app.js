// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
   'localstorage',
   'communication',
   'custom',
   'less'
], function($, _, Backbone, Router, LocalStorage, Communication, Custom, Less){

    var initialize = function(){
        Communication.checkHash(Custom.runApplication);
    	var appRouter = new Router();
        Backbone.history.start();
    };

    return {
        initialize: initialize
    }
});
