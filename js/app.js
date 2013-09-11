// Filename: app.js
define([
  'router',
   'localstorage',
   'communication',
   'custom'
], function(Router, LocalStorage, Communication, Custom){
    var initialize = function(){
    	
    	var appRouter = new Router();
    	
    	Communication.checkHash(Custom.runApplication);
    	//Communication.checkLogin(Custom.runApplication);
    };

    return {
        initialize: initialize
    }
});
