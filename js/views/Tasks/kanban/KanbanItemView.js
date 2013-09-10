define([
    "text!templates/Tasks/kanban/KanbanItemTemplate.html",
    "collections/Tasks/TasksCollection",
     'localstorage',
     'custom'
],
    function (KanbanItemTemplate, TasksCollection, LocalStorage, Custom) {
        var TasksItemView = Backbone.View.extend({
            className: "task",
            id: function () {
                return this.model.get("id");
            },
            initialize: function () {
                this.collection = new TasksCollection;
                this.collection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            events: {
                "click #delete": "deleteTask",
                "click .dropDown > a": "openDropDown",
                "click .colorPicker a": "pickColor",
                "click .task-content": "gotoForm",
                "click #edit": "gotoEditForm"
            },

            template: _.template(KanbanItemTemplate),

            gotoEditForm: function (e) {
                e.preventDefault();
                window.location.hash = "#home/action-Tasks/Edit/1";
            },

            gotoForm: function (e) {
                window.location.hash = "#home/content-Tasks/form/1";
            },

            deleteTask: function (e) {
                e.preventDefault();
                hash = LocalStorage.getFromLocalStorage('hash'),
                uid = LocalStorage.getFromLocalStorage('uid'),
                mid = 39;
                var that = this;
                this.$("#delete").closest(".task").fadeToggle(300, function () {
                    var task = this;
                    var model = that.collection.get($(this).attr("id"));
                    model.destroy(
                        {
                            headers: {
                                uid: uid,
                                hash: hash,
                                mid: mid
                            }
                        },
                        { wait: true });
                    $(this).remove();
                });
                that.collection.trigger('reset');
            },

            openDropDown: function (e) {
                e.preventDefault();
                this.$(".dropDown > a").toggleClass("selected").siblings(".dropDownOpened").fadeToggle("normal");
            },

            pickColor: function (e) {
                e.preventDefault();
                var hash = LocalStorage.getFromLocalStorage('hash'),
        		uid = LocalStorage.getFromLocalStorage('uid'),
        		mid = 39;
                var color = $(e.target).data("color");
                this.changeColor(color);
                this.model.set({ color: color });
                this.model.save({ color: color }, {
                    headers: {
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }
                });
            },

            changeColor: function (color) {
                this.$(".colorPicker a").closest(".task-header").css('background-color', color).closest(".task").css('border-color', color);
            },

            isLater: function (str1, str2) {
                return new Date(str1) > new Date(str2);
            },

            changeDeadlineColor: function () {
                if ((this.$(".task").attr("id") == this.model.get('id'))) {
                    this.$(".deadline").css({ 'color': '#E74C3C', 'font-weight': 'bold' });
                }
            },

            render: function () {
                var viewType = Custom.getCurrentVT();
                var itemIndex = Custom.getCurrentII();
                console.log(itemIndex);
                var todayString = new Date().format("yyyy-mm-dd");
                var deadlineString = this.model.get('deadline').split('T')[0];
                this.model.set({ deadline: this.model.get('deadline').split('T')[0].replace('-', '/') }, { silent: true });
                this.$el.html(this.template(this.model.toJSON()));
                if (this.isLater(todayString, deadlineString)) {
                    this.changeDeadlineColor();
                };
                this.changeColor(this.model.get('color'));
                return this;
            }
        });

        return TasksItemView;
    });