define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home/homeTemplate.html'
], function($, _, Backbone, indexTemplate){

    var IndexView = Backbone.View.extend({

        el:'#wrapper',
        template: _.template(indexTemplate),
        initialize: function(){
            this.render();
        },

         render: function(){
            this.$el.html(indexTemplate);
            return this;
        }});
    return IndexView;

});
