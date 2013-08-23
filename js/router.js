// Filename: router.js
define([
  'require',
  'jquery',
  'underscore',
  'backbone',
  'views/main/MainView',
  'views/login/LoginView',
  'views/Customers/CustomersCreateView'
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
    	  
          var View = "views/" + type + "/" + type + "View";
          var TopBarView = "views/" + type + "/" + type + "TopBarView";
          var self = this;
          require([View, TopBarView], function(TypeView, TypeTopBarView){
        	  var typeView = new TypeView({viewtype:viewtype, currentItem:curitem}); 
        	  var typeTopBarView = new TypeTopBarView({viewtype:viewtype, currentItem:curitem});
        	  
              self.changeContentView(typeView);
              self.changeTopBarView(typeTopBarView);
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


