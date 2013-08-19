// Filename: router.js
define([
  'require',
  'jquery',
  'underscore',
  'backbone',
  'views/main/MainView',
  'views/login/LoginView'
], function(require, $, _, Backbone, MainView, LoginView) {
  
  var AppRouter = Backbone.Router.extend({

      initialize : function(){
          Backbone.View.prototype.close = function(){
              this.remove();
              this.unbind();
          }
      },

      currentView: null,

      routes: {
          "": "main",
          "login":"login",
          ":type" : "getList",
          ":type/:action" : "makeAction",
          "*actions":"defaultAction"
      },

      getList: function(type){
          if(typeof type == "undefined") return window.location.hash = "";
          var View = "views/" + type + "/" + type + "View";
          var TopBarView = "views/" + type + "/" + type + "TopBarView";
               //return;
          require([View, TopBarView], function(TypeView, TypeTopBarView){
              new TypeView();
              new TypeTopBarView();
          });
      },
      makeAction: function(type, action){
          var View = "views/" + type + "/" + type + action + "View";
          var self = this;
          require([View], function(LoadedView){
             self.changeView(new LoadedView()); //new CustomersCreateView
          }, self);
      },



      changeView: function(view){
          if(this.currentView){
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
      }

  });
    return AppRouter;
});


