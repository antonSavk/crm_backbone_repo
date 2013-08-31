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

      wrapperView: null,
      mainView: null,
      topBarView: null,
      view: null,

      routes: {
          "home": "main",
          "login":"login",
          "home/content-:type(/:viewtype)(/:curitem)" : "getList",
          "home/action-:type/:action" : "makeAction",
          "*actions":"main"
      },

      getList: function(contentType, viewType, itemIndex){
    	  if (this.mainView == null) this.main();
    	  console.log('GetList: '+contentType+" "+viewType+" "+itemIndex);
    	  
    	  var ContentViewUrl = "views/" + contentType + "/ContentView",
    	  	  ContentTopBarViewUrl = "views/" + contentType + "/ContentTopBarView",
              CollectionUrl = "collections/" + contentType + "/" + contentType + "Collection",
              self = this;
    	  
    	  self.Custom = Custom;
    	  
          require([ContentViewUrl, ContentTopBarViewUrl, CollectionUrl], function(ContentView, ContentTopBarView, ContentCollection){
        	  var contentCollection = new ContentCollection();
        	  contentCollection.bind('reset', _.bind(createViews, self));
        	  function createViews()
        	  {
        		  
        		  contentCollection.unbind('reset');
        		  Custom.setCurrentCL(contentCollection.models.length);
        		  
        		  if (viewType)
        			  this.Custom.setCurrentVT(viewType);
            	  if (itemIndex)
            		  this.Custom.setCurrentII(itemIndex);
            	  
            	  viewType = this.Custom.getCurrentVT();
            	  itemIndex = this.Custom.getCurrentII();
        		  
                  var url = "#home/content-"+ contentType + "/" + viewType;
                  
                  if (viewType === "form")
                  {
                	  url += "/" + itemIndex; 
                  }
                  
                  Backbone.history.navigate(url);
                  var contentView = new ContentView({collection: contentCollection});
                  var contentTopBarView = new ContentTopBarView();
                  
                  contentTopBarView.bind('deleteEvent', contentView.deleteItems, contentView);
                  
        		  this.changeView(contentView);
                  this.changeTopBarView(contentTopBarView);
        	  }
              
          });
          
      },
      makeAction: function(type, action){
    	  if (this.mainView == null) this.main();
    	  var actionVariants = ["Create", "Edit"];
    	  
    	  if ($.inArray(action, actionVariants) == -1)
    	  {
    		  action = "Create";
    	  }
          var ActionViewUrl = "views/" + type + "/" + action + "View";
          
          var self = this;
          require([ActionViewUrl], function(ActionView){
             self.changeView(new ActionView()); 
          }, self);
      },

      changeWrapperView: function(wrapperView){
          if(this.wrapperView){
              this.wrapperView.undelegateEvents();
          }
          this.wrapperView = wrapperView;
      },
      
      changeTopBarView: function(topBarView){
          if(this.topBarView){
              this.topBarView.undelegateEvents();
          }
          this.topBarView = topBarView;
      },
      
      changeView: function(view){
          if(this.view){
              this.view.undelegateEvents();
          }
          this.view = view;
      },

      main: function(){
    	  this.mainView = new MainView();
    	  this.changeWrapperView(this.mainView);
      },

      login: function(){
    	  this.mainView = null;
          this.changeWrapperView(new LoginView());
      }

  });
    return AppRouter;
});


