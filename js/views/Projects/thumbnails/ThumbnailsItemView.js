define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Projects/thumbnails/ThumbnailsItemTemplate.html"
],
    function ($, _, Backbone, ThumbnailsItemTemplate) {
        var ThumbnailsItemView = Backbone.View.extend({
            tagName:"div",

            initialize: function(){
                this.render();
            },

            template: _.template(ThumbnailsItemTemplate),

            render: function(){
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return ThumbnailsItemView;
    });