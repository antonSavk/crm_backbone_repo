define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/main/MainTemplate.html',
   'views/menu/LeftMenuView',
   'collections/menu/MenuItems'
], function($, _, Backbone, MainTemplate, LeftMenuView, MenuItemsCollection){

    var json = [
        {"id":1,"link":false,"mname":"Settings","parrent":null},
        {"id":2,"link":false,"mname":"Companies","parrent":1},
        {"id":3,"link":false,"mname":"Users","parrent":1},
        {"id":4,"link":false,"mname":"Configuration","parrent":1}];

    var MainView = Backbone.View.extend({

        el:'#wrapper',


        initialize: function(){
            this.render();
            var leftMenu = new LeftMenuView();
        },

        render: function(){
            console.log('Render Main View');
            this.$el.html(MainTemplate);
            return this;
    }});

    return MainView;

});
