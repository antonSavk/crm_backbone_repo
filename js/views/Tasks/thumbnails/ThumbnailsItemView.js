define([
    "text!templates/Tasks/thumbnails/ThumbnailsItemTemplate.html"
],
    function (TasksItemTemplate) {
        var TasksItemView = Backbone.View.extend({
            tagName:"tr",

            initialize: function(){
                this.render();
            },

            template: _.template(TasksItemTemplate),

            render: function(){
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return TasksItemView;
    });