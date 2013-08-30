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
          "home/action-:type/:action" : "makeAction",
          "*actions":"main"
      },

      getList: function(contentType, viewType, itemIndex){
    	  if (this.mainView == null) this.main();
    	  console.log('GetList: '+contentType+" "+viewType+" "+itemIndex);
    	  
    	  var ContentViewUrl = "views/" + contentType + "/ContentView",
              TopBarViewUrl = "views/" + contentType + "/TopBarView",
              CollectionUrl = "collections/" + contentType + "/" + contentType + "Collection",
              self = this;
    	  
    	  self.Custom = Custom;
    	  
          require([ContentViewUrl, TopBarViewUrl, CollectionUrl], function(ContentView, TopBarView, ContentCollection){
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
                  var topBarView = new TopBarView();
                  
                  topBarView.bind('deleteEvent', contentView.deleteItems, contentView);
                  
        		  this.changeContentView(contentView);
                  this.changeTopBarView(topBarView);
        	  }
              
          });
          
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


