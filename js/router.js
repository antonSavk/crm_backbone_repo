// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/main/MainView',
    'views/login/LoginView'
], function($, _, Backbone, MainView, LoginView) {
  
  var AppRouter = Backbone.Router.extend({

      currentView: null,

      routes: {
          "": "main",
          "login":"login",
          "*actions":"defaultAction"
      },

      changeView: function(view){
          if(this.currentView != null){
              this.currentView.undelegateEvents();
          }
          this.currentView = view;
          this.currentView.render();
      },

      index: function(){
          new MainView().render();
      },

      login: function(){
          this.changeView(new LoginView());
      }

  });
    return AppRouter;
});


