define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Customer/list/ListItemTemplate.html"
],
    function ($, _, Backbone, ListItemTemplate) {
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