// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
   'localstorage',
   'communication'
], function($, _, Backbone, Router, LocalStorage, Communication){

    var initialize = function(){
    	Communication.checkHash(runApplication);
    	var appRouter = new Router();
        Backbone.history.start();
    };
    
    var runApplication = function(data){
        if(data.result.status != 0){
            window.location.hash = "login";
        } else{
            window.location.hash = "";
        }
        
    };

    return {
        initialize: initialize
    };
});
