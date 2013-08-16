// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/main/MainView',
    'views/login/LoginView'
], function($, _, Backbone, MainView, LoginView) {
  
  var AppRouter = Backbone.Router.extend({

      initialize : function(){
      },

      currentView: null,

      routes: {
          "": "main",
          "login":"login",
          ":type": 'getList',
          "*actions":"defaultAction"
           
      },

      changeView: function(view){
          if(this.currentView != null){
              this.currentView.undelegateEvents();
          }
          this.currentView = view;
          //this.currentView.render();
      },

      main: function(){
    	  this.changeView(new MainView());
      },

      login: function(){
          this.changeView(new LoginView());
      },
      getList: function(type){
    	  alert(type);
      }

  });
    return AppRouter;
});


