define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Customers/list/ListItemTemplate.html",
    "text!templates/Companies/ListItemTemplate.html"
],
    function ($, _, Backbone, ListItemTemplate, companiesList) {
        var ListItemView = Backbone.View.extend({
            tagName:"tr",

            initialize: function(){
                this.render();
            },

            template: _.template(ListItemTemplate),

            render: function(){
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return ListItemView;
    });