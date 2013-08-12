define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/main/MainTemplate.html'
], function($, _, Backbone, MainTemplate){

    var MainView = Backbone.View.extend({

        el:'#wrapper',

        render: function(){
            this.$el.html(MainTemplate);
            return this;
        }});
    return MainView;

});
