define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Projects/list/ProjectsItemTemplate.html"
],
    function ($, _, Backbone, ProjectsItemTemplate) {
        var ProjectsItemView = Backbone.View.extend({
            tagName:"tr",

            initialize: function(){
                this.render();
            },

            template: _.template(ProjectsItemTemplate),

            render: function(){
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return ProjectsItemView;
    });