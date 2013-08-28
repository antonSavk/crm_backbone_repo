// Filename: router.js
define([
  'require',
  'jquery',
  'underscore',
  'backbone',
  'views/main/MainView',
  'views/login/LoginView',
  'custom'
], function(require, $, _, Backbone, MainView, LoginView, Custom) {
  
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
          "home/content-:type(/:viewtype)(/:curitem)" : "getList",
          //"home/:type/:action" : "makeAction",
          "*actions":"main"
      },

      getList: function(contentType, viewType, itemIndex){
    	  console.log('GetList: '+contentType+" "+viewType+" "+itemIndex);
    	  
    	  if (this.mainView == null) this.main();
    	  
    	  if (viewType)
    		  Custom.setCurrentVT(viewType);
    	  if (itemIndex)
    		  Custom.setCurrentII(itemIndex);
    	  
    	  
          var ContentViewUrl = "views/" + contentType + "/ContentView";
          var TopBarViewUrl = "views/" + contentType + "/TopBarView";
          var self = this;
          require([ContentViewUrl, TopBarViewUrl], function(ContentView, TopBarView){
              self.changeContentView(new ContentView());
              self.changeTopBarView(new TopBarView());
          });
          
          viewType = Custom.getCurrentVT();
          var url = "#home/content-"+ contentType + "/" + viewType;
          
          if (viewType === "form")
          {
        	  url += "/" + Custom.getCurrentII(); 
          }
          
          Backbone.history.navigate(url);
      },
      makeAction: function(type, action){
    	  if (this.mainView == null) this.main();
    	  var actionVariants = ["Create", "Edit"];
    	  
    	  if ($.inArray(action, actionVariants) == -1)
    	  {
    		  action = "create";
    	  }
          var View = "views/" + type + "/" + type + action + "View";
          
          var self = this;
          require([View], function(ActionView){
             self.changeContentView(new ActionView()); 
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


