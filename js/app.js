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
    	
    	var appRouter = new Router();
    	Backbone.history.start();
    	Communication.checkHash(Custom.runApplication);
    };

    return {
        initialize: initialize
    }
});
