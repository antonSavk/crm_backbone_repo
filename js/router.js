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

      },

      currentView: null,

      routes: {
          "": "main",
          "login":"login",
          ":type" : "getList",
          "*actions":"defaultAction"
      },

      getList: function(type){
          if(typeof type == "undefined") return window.location.hash = "";
          var View = "views/" + type + "/" + type + "View";
          var TopBarView = "views/" + type + "/" + type + "TopBarView";

         /* $.ajax({
              url:'http://localhost/crm_backbone_repo/js/views/Customers/CustomersView.js',
              success: function(data){
                  debugger
                        alert('ok');
              },
              error: function(data){
                  alert('not ok');
              }
          });*/
               //return;
          require([View, TopBarView], function(TypeView, TypeTopBarView){
              debugger
              new TypeView();
              new TypeTopBarView();
          });

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
      }

  });
    return AppRouter;
});


