define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Customers/thumbnails/CustomersItemTemplate.html"
],
    function ($, _, Backbone, CustomersItemTemplate) {
        var CustomersItemView = Backbone.View.extend({
            tagName:"tr",

            initialize: function(){
                this.render();
            },

            template: _.template(CustomersItemTemplate),

            render: function(){
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return CustomersItemView;
    });