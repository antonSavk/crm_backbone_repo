define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/index/IndexTemplate.html'
], function($, _, Backbone, IndexTemplate){

    var IndexView = Backbone.View.extend({

        el:'#wrapper',

        initialize: function(){
            this.render();
        },

        render: function(){
            this.$el.html(IndexTemplate);
            return this;
        }});
    return IndexView;

});
