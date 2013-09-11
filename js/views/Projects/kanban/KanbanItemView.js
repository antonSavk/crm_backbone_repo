define([
    "jquery",
    "underscore",
    "backbone",
    "jqueryui",
    "text!templates/Tasks/kanban/KanbanItemTemplate.html",
    "collections/Tasks/TasksCollection",
     'localstorage'
],
    function ($, _, Backbone, jqueryui, KanbanItemTemplate, TasksCollection, LocalStorage) {
        var TasksItemView = Backbone.View.extend({
            //el: ".kanban",
            initialize: function () {
                this.collection = new TasksCollection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            events: {
                "click #delete": "deleteTask",
                "click .dropDown > a": "openDropDown",
                "click .colorPicker a": "pickColor"
            },

            template: _.template(KanbanItemTemplate),

            deleteTask: function (e) {
                e.preventDefault();
                var self = this,
                    hash = LocalStorage.getFromLocalStorage('hash'),
                    uid = LocalStorage.getFromLocalStorage('uid'),
                    mid = 39;
                var that = this;
                this.$("#delete").closest(".task").fadeToggle(300, function () {
                    var model = that.collection.get($(this).attr("id"));
                    model.destroy({headers: {
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }
                    });
                    $(this).remove();
                    self.collection.trigger('reset');
                    console.log(model.id);
                });
            },

            openDropDown: function (e) {
                e.preventDefault();
                this.$(".dropDown > a").toggleClass("selected").siblings(".dropDownOpened").fadeToggle("normal");
            },

            pickColor: function (e) {
                e.preventDefault();
                var color = $(e.target).data("color");
                this.$(".colorPicker a").closest(".task-header").css('background-color', color).closest(".task").css('border-color', color);
            },

            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });

        return TasksItemView;
    });