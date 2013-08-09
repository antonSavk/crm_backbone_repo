define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/products/productsTemplate.html'
], function($, _, Backbone, productsTemplate){

    var ProductsView = Backbone.View.extend({

        el:'#wrapper',

        initialize: function(){

        },

        render: function(){
            this.$el.html(productsTemplate);
            return this;
        }});

    return ProductsView;

});
