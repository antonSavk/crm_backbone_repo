define([
    'jqueryui',
    'text!templates/Tasks/list/ListTemplate.html',
    'text!templates/Tasks/form/FormTemplate.html',
    'text!templates/Tasks/kanban/KanbanTemplate.html',
    'collections/Tasks/TasksCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/Tasks/list/ListItemView',
    'views/Tasks/thumbnails/ThumbnailsItemView',
    'views/Tasks/kanban/KanbanItemView',
    "localstorage",
    'custom'
],

function (jqueryui, TasksListTemplate, TasksFormTemplate, TasksKanbanTemplate, TasksCollection, WorkflowsCollection, TasksListItemView, TasksThumbnailsItemView, TasksKanbanItemView, LocalStorage, Custom) {
    var TasksView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Tasks View');
            var that = this;
            this.workflowsCollection = new WorkflowsCollection({ id: 'task' });
            this.workflowsCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.render();

            $(window).resize(function () {
                if (this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(function () {
                    $(this).trigger('resizeEnd');
                }, 1000);
            });

            $(window).bind('resizeEnd', function () {
                that.$(".kanban").height(that.$el.siblings("#leftmenu-holder").height() - that.$el.siblings("#top-bar").height());
            });

        },

        events: {
            "click .checkbox": "checked",
            "click .foldUnfold": "openDropDown",
            "click .fold": "foldUnfoldColumn"
        },

        render: function () {
            var that = this;
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Tasks View');
            var viewType = Custom.getCurrentVT();
            var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;
            switch (viewType) {
                case "kanban":
                    {
                        this.$el.html(_.template(TasksKanbanTemplate));
                        var workflows = this.workflowsCollection.models;
                        _.each(workflows, function (workflow, index) {
                            $("<div class='column' data-index='" + index + "' data-status='"+workflow.get('status')+"' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><div class='columnNameDiv'><h2 class='columnName'>" + workflow.get('name') + "</h2></div></div>").appendTo(".kanban");
                        });

                        _.each(workflows, function (workflow, i) {
                            var counter = 0;
                            var column = this.$(".column").eq(i);
                            _.each(this.collection.models, function (model) {
                                if (model.get("workflow").name === column.data("name")) {
                                    column.append(new TasksKanbanItemView({ model: model }).render().el);
                                    counter++;
                                }
                            }, this);
                            column.find("div").append("<p class='counter'>" + counter + "</p><a class='foldUnfold' href='#'><img hidden='hidden' src='./images/downCircleBlack.png'/></a><ul hidden='hidden' class='dropDownMenu'></ul>");
                        }, this);
                        break;
                    }
                case "list":
                    {
                        this.$el.html(_.template(TasksListTemplate));
                        var table = this.$el.find('table > tbody');

                        this.collection.each(function (model) {
                            table.append(new TasksListItemView({ model: model }).render().el);
                        });
                        break;
                    }
                case "thumbnails":
                    {
                        this.$el.html('');
                        var holder = this.$el;
                        this.collection.each(function (model) {
                            $(holder).append(new TasksThumbnailsItemView({ model: model }).render().el);
                        });
                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > this.collection.models.length - 1) {
                            itemIndex = this.collection.models.length - 1;
                            Custom.setCurrentII(this.collection.models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html();
                        } else {
                            var currentModel = this.collection.models[itemIndex];
                            this.$el.html(_.template(TasksFormTemplate, currentModel.toJSON()));
                        }

                        break;
                    }

                case "gantt":
                    {
                        console.log('render gantt');
                        break;
                    }
            }
            this.$(".kanban").height(this.$el.siblings("#leftmenu-holder").height() - this.$el.siblings("#top-bar").height());
            this.$(".column").sortable({
                connectWith: ".column",
                cancel: "h2",
                cursor: "move",
                items: ".task",
                opacity: 0.7,
                revert: true,
                helper : 'clone',
                stop: function (event, ui) {
                    debugger 
                    var model = that.collection.get(ui.item.attr("id"));
                    var column = ui.item.closest(".column");
                    var ob = {
                        workflow: {
                            id: ui.item.closest(".column").data("id"),
                            name: column.data("name"),
                            status: column.data("status")
                        }
                    };

                    model.set(ob);
                    model.save({}, {
                        headers: {
                            uid: uid,
                            hash: hash,
                            mid: mid
                        }
                    });
                    that.collection.trigger('reset');
                }
            }).disableSelection();
            return this;
        },

        openDropDown: function (e) {
            e.preventDefault();
            console.log(e.target);
            var foldUnfold = "Unfold";
            if (!$(e.target).closest(".column").hasClass("rotate")) {
                foldUnfold = "Fold";
                $(e.target).closest(".columnNameDiv").toggleClass("selected");
            }
            $(e.target).closest(".foldUnfold").siblings(".dropDownMenu").html("<li><a class='fold' href='#'>" + foldUnfold + "</a></li>").fadeToggle("normal");
        },

        foldUnfoldColumn: function (e) {
            e.preventDefault();
            var column = $(e.target).closest(".column");
            if (column.hasClass("rotate")) {
                column.attr('style', '');
                column.find(".task").show();
                column.find(".dropDownMenu").hide();
                column.find(".columnNameDiv");
                column.removeClass("rotate");
                column.find(".counter, .foldUnfold img").attr('style', '');;
            } else {
                column.css('max-width', '40px');
                column.find(".task, .dropDownMenu").hide();
                column.addClass("rotate");
                column.find(".columnNameDiv").removeClass("selected");
                column.find(".counter, .foldUnfold img").css({ 'position': 'relative', 'right': '6px', 'top': '-12px' });
            }

        },

        checked: function (event) {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteItems: function () {
            var that = this,
        		hash = LocalStorage.getFromLocalStorage('hash'),
        		uid = LocalStorage.getFromLocalStorage('uid'),
        		mid = 39;

            $.each($("input:checked"), function (index, checkbox) {
                var task = that.collection.get(checkbox.value);

                task.destroy({
                    headers: {
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }
                },
        		{ wait: true }
        		);
            });

            this.collection.trigger('reset');
        }
    });

    return TasksView;
});
