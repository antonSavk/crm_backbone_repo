define([
    "text!templates/Tasks/list/ListItemTemplate.html",
    'custom'
],
    function (TasksItemTemplate, Custom) {

        var TasksItemView = Backbone.View.extend({
            tagName: "tr",

            initialize: function () {
                this.render();
            },

            events: {
                "click td:not(:has('input[type='checkbox']'))": "gotoForm"
            },

            gotoForm: function (e) {
                App.ownContentType = true;
                var itemIndex = $(e.target).closest("tr").data("index") + 1;
                window.location.hash = "#home/content-Tasks/form/" + itemIndex;
            },

            template: _.template(TasksItemTemplate),

            render: function () {
                var index = this.model.collection.indexOf(this.model);
                this.$el.attr("data-index", index);
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return TasksItemView;
    });