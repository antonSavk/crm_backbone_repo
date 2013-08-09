// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/index/IndexView'
], function($, _, Backbone, IndexView) {
  
  var AppRouter = Backbone.Router.extend({

      currentView: null,

      routes: {
          "": "index",
          "products": "showProducts"
      },
      showProducts: function(){
          this.changeView(new ProductsView());
      },
      changeView: function(view){
          if(this.currentView != null){
              this.currentView.undelegateEvents();
          }
          this.currentView = view;
          this.currentView.render();
      },

      index: function(){
          this.changeView(new IndexView());
      },

      login: function(){
          this.changeView(new LoginView());
      }

  });
    return AppRouter;
});
  
  /*var initialize = function(){

      var app_router = new AppRouter();
      Backbone.history.start();*/
    
   /* app_router.on('route:index', function(){

   
        // Call render on the module we loaded in via the dependency array
        var loginView = new LoginView();
        loginView.render();

    });*/

    /*app_router.on('route:showContributors', function () {
    
        // Like above, call render but know that this view has nested sub views which 
        // handle loading and displaying data from the GitHub API  
        var contributorsView = new ContributorsView();
    });

    app_router.on('route:defaultAction', function (actions) {
     
       // We have no matching route, lets display the home page 
        var homeView = new HomeView();
        homeView.render();
    });*/

    // Unlike the above, we don't call render on this view as it will handle
    // the render call internally after it loads data. Further more we load it
    // outside of an on-route function to have it loaded no matter which page is
    // loaded initially.
    //var footerView = new FooterView();



