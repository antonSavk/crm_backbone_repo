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
      mainView: null,
      topBarView: null,
      contentView: null,

      routes: {
          "home": "main",
          "login":"login",
          "home/:type/:viewtype/:curitem" : "getList",
          "home/:type/:action" : "makeAction",
          "*actions":"main"
      },

      getList: function(type, viewtype, curitem){
    	  if (this.mainView == null) this.main();
    	  var viewVariants = ["list", "form", "thumbnails", "gantt"];
    	  
    	  if ($.inArray(viewtype, viewVariants) == -1)
    	  {
    		  viewtype = "list";
    	  }
    	    
    	  var testCuritem = new RegExp(/^[1-9]{1}[0-9]*$/);
    	  
    	  if (testCuritem.test(curitem) == false)
    		  curitem = 1;
    	  
          if(typeof type == "undefined") return window.location.hash = "";
          var View = "views/" + type + "/" + type + "View";
          var TopBarView = "views/" + type + "/" + type + "TopBarView";
          var self = this;
          require([View, TopBarView], function(TypeView, TypeTopBarView){
              self.changeContentView(new TypeView({viewtype:viewtype, currentItem:curitem}));
              self.changeTopBarView(new TypeTopBarView({viewtype:viewtype, currentItem:curitem}));
          });
      },
      makeAction: function(type, action){
          var View = "views/" + type + "/" + type + action + "View";
          var self = this;
          require([View], function(LoadedView){
             self.changeView(new LoadedView()); 
          }, self);
      },



      changeView: function(view){
          if(this.currentView){
              this.currentView.undelegateEvents();
          }
          this.currentView = view;
      },
      
      changeTopBarView: function(topBarView){
          if(this.topBarView){
              this.topBarView.undelegateEvents();
          }
          this.topBarView = topBarView;
      },
      
      changeContentView: function(contentView){
          if(this.contentView){
              this.contentView.undelegateEvents();
          }
          this.contentView = contentView;
      },

      main: function(){
    	  this.mainView = new MainView();
    	  this.changeView(this.mainView);
      },

      login: function(){
    	  this.mainView = null;
          this.changeView(new LoginView());
      }

  });
    return AppRouter;
});


