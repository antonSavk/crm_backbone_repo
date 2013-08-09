// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
   'localstorage'
], function($, _, Backbone, Router, LocalStorage){

    var initialize = function(){
        var router = new Router();
        Backbone.history.start();
        //checkLogin(runApplication);
    }

    /*var checkLogin = function(callback){
        var url = "http://" + App.Server.ip + ":" + App.Server.port + "/login";
        $.ajax({
            url: url,
            method:"POST",
            data:{
                ulogin:'romashka50',
                upass: '123456789'
            },
            success: function(resp){
                callback(resp);
            },
            error: function(resp){
                callback(resp);
            }
        });
    }

    var runApplication = function(data){
        if(!data.success){
            window.location.hash = "login";
        } else{
            window.location.hash = "";
        }
        var app_router = new Router();
        Backbone.history.start();
    }*/

    return {
        initialize: initialize
    };
});
