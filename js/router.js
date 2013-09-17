// Filename: router.js
define([
  'views/main/MainView',
  'views/login/LoginView',
  'custom'
], function(MainView, LoginView, Custom) {
  
    var AppRouter = Backbone.Router.extend({
        
      wrapperView: null,
      mainView: null,
      topBarView: null,
      view: null,

      routes: {
          "home": "main",
          "login":"login",
          "home/content-:type(/:viewtype)(/:curitem)" : "getList",
          "home/action-:type/:action(/:curitem)" : "makeAction",
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
        		  this.Custom.setCurrentCL(contentCollection.models.length);

        		  if (viewType) {
        		      
        		      if (!App.contentType) {
        		          App.contentType = contentType;
        		      } else if (App.contentType && App.contentType != contentType) {
        		          //App.ownContentType = false;
        		          App.contentType = contentType;
        		      }
        		      this.Custom.setCurrentVT(viewType);
        	      }
        	      if (itemIndex)
            		  this.Custom.setCurrentII(itemIndex);
            	  
        	      viewType = this.Custom.getCurrentVT({
        	           contentType: contentType
        	      });
            	  itemIndex = this.Custom.getCurrentII();
        		  
                  var url = "#home/content-"+ contentType + "/" + viewType;
                  
                  if (viewType === "form")
                  {
                	  url += "/" + itemIndex; 
                  }
                  
                  Backbone.history.navigate(url);
                  var contentView = new ContentView({collection: contentCollection});
                  var topBarView = new TopBarView({actionType: "Content"});
                  
                  topBarView.bind('deleteEvent', contentView.deleteItems, contentView);
                  
        		  this.changeView(contentView);
                  this.changeTopBarView(topBarView);
        	  }
              
          });
          
      },
      makeAction: function(contentType, action, itemIndex){
    	  if (this.mainView == null) this.main();
    	  var actionVariants = ["Create", "Edit"];
    	  
    	  if ($.inArray(action, actionVariants) == -1)
    	  {
    		  action = "Create";
    	  }
          var ActionViewUrl = "views/" + contentType + "/" + action + "View",
          	  TopBarViewUrl = "views/" + contentType + "/TopBarView",
          	  CollectionUrl = "collections/" + contentType + "/" + contentType + "Collection";
          
          var self = this;
          
          self.Custom = Custom;

          require([ActionViewUrl, TopBarViewUrl, CollectionUrl], function(ActionView, TopBarView, ContentCollection) {
              var contentCollection = new ContentCollection();
              contentCollection.bind('reset', _.bind(createViews, self));

              function createViews() {
                  contentCollection.unbind('reset');
                  this.Custom.setCurrentCL(contentCollection.models.length);

                  if (itemIndex)
                      this.Custom.setCurrentII(itemIndex);

                  itemIndex = this.Custom.getCurrentII();

                  var url = "#home/action-" + contentType + "/" + action;

                  if (action === "Edit") {
                      url += "/" + itemIndex;
                  }

                  Backbone.history.navigate(url);


                  var topBarView = new TopBarView({ actionType: action }),
                      actionView = new ActionView({ collection: contentCollection });

                  topBarView.bind('saveEvent', actionView.saveItem, actionView);

                  this.changeView(actionView);
                  this.changeTopBarView(topBarView);
              }
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

      main: function () {
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


