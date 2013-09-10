define([
    "text!templates/Persons/thumbnails/ThumbnailsItemTemplate.html"
],
    function (ThumbnailsItemTemplate) {
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