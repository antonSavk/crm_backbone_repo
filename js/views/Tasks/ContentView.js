define([
    'jqueryui',
    'text!templates/Tasks/list/ListTemplate.html',
    'text!templates/Tasks/form/FormTemplate.html',
    'text!templates/Tasks/kanban/KanbanTemplate.html',
    'collections/Tasks/TasksCollection',
    'collections/Workflows/WorkflowsCollection',
    'collections/Projects/ProjectsCollection',
    'views/Tasks/list/ListItemView',
    'views/Tasks/thumbnails/ThumbnailsItemView',
    'views/Tasks/kanban/KanbanItemView',
    "localstorage",
    'custom'
],

function (jqueryui, TasksListTemplate, TasksFormTemplate, TasksKanbanTemplate, TasksCollection, WorkflowsCollection, ProjectsCollection, TasksListItemView, TasksThumbnailsItemView, TasksKanbanItemView, LocalStorage, Custom) {
    var TasksView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Tasks View');
            var that = this;
            this.workflowsCollection = new WorkflowsCollection({ id: 'task' });
            this.workflowsCollection.bind('reset', _.bind(this.render, this));
            this.projectsCollection = new ProjectsCollection();
            this.projectsCollection.bind('reset', _.bind(this.render, this));
            console.log(this.projectsCollection);
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
            "click .fold": "foldUnfoldColumn",
            "click .form a": "gotoProjectForm"
        },

        gotoProjectForm: function (e) {
            e.preventDefault();
            var itemIndex = this.projectsCollection.indexOf(this.projectsCollection.get($(e.target).closest("a").attr("id"))) + 1;
            window.location.hash = "#home/content-Projects/form/" + itemIndex;
        },

        render: function () {
            var that = this;
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Tasks View');
            var viewType = Custom.getCurrentVT();
            var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;
            var models = [];
            var projectId = window.location.hash.split('/')[3];
            if (!projectId || projectId.length < 24) {
                models = this.collection.models;
            }
            else {
                _.each(this.collection.models, function (item) {
                    if (item.get("project").pId == projectId) models.push(item)
                }, this);
            }
            switch (viewType) {
                case "kanban":
                    {
                        this.$el.html(_.template(TasksKanbanTemplate));
                        var workflows = this.workflowsCollection.models;

                        _.each(workflows, function (workflow, index) {
                            $("<div class='column' data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><div class='columnNameDiv'><h2 class='columnName'>" + workflow.get('name') + "</h2></div></div>").appendTo(".kanban");
                        });

                        $(".column").last().addClass("lastColumn");

                        _.each(workflows, function (workflow, i) {
                            var counter = 0,
                                remaining = 0;
                            var column = this.$(".column").eq(i);
                            _.each(models, function (model) {
                                if (model.get("workflow").name === column.data("name")) {
                                    column.append(new TasksKanbanItemView({ model: model }).render().el);
                                    counter++;
                                    remaining += model.get("estimated") - model.get("loged");
                                }
                            }, this);
                            column.find("div").append("<p class='counter'>" + counter + "</p><a class='foldUnfold' href='#'><img hidden='hidden' src='./images/downCircleBlack.png'/></a><ul hidden='hidden' class='dropDownMenu'></ul><p class='remaining'>Remaining time: <span>" + remaining + "</span></p>");
                        }, this);
                        break;
                    }
                case "list":
                    {
                        this.$el.html(_.template(TasksListTemplate));
                        var table = this.$el.find('table > tbody');

                        _.each(models, function (model) {
                            table.append(new TasksListItemView({ model: model }).render().el);
                        }, this);

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });

                        break;
                    }
                case "thumbnails":
                    {
                        this.$el.html('');
                        var holder = this.$el;
                        _.each(models, function (model) {
                            $(holder).append(new TasksThumbnailsItemView({ model: model }).render().el);
                        }, this);
                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > models.length - 1) {
                            itemIndex = models.length - 1;

                            var urlParts = window.location.hash.split('/');
                            if (urlParts[4]) {
                                urlParts[4] = models.length;
                                window.location.hash = urlParts.join('/');
                            }
                            Custom.setCurrentII(models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html();
                        } else {
                            var currentModel = models[itemIndex];
                            currentModel.set({ deadline: currentModel.get('deadline').split('T')[0].replace('-', '/') }, { silent: true });
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
                helper: 'clone',
                start: function (event, ui) {
                    var column = ui.item.closest(".column");
                    var model = that.collection.get(ui.item.attr("id"));
                    column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                    column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) - (model.get("estimated") - model.get("loged")));
                },
                stop: function (event, ui) {
                    var model = that.collection.get(ui.item.attr("id"));
                    var column = ui.item.closest(".column");
                    var ob = {
                        workflow: {
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
                    column.find(".counter").html(parseInt(column.find(".counter").html()) + 1);
                    column.find(".remaining span").html(parseInt(column.find(".remaining span").html()) + (model.get("estimated") - model.get("loged")));
                    //that.collection.trigger('reset');
                }
            }).disableSelection();
            return this;
        },

        openDropDown: function (e) {
            e.preventDefault();
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
                column.find(".task, .remaining").show();
                column.find(".dropDownMenu").hide();
                column.find(".columnNameDiv");
                column.removeClass("rotate");
                column.find(".counter, .foldUnfold img").attr('style', '');;
            } else {
                column.css('max-width', '40px');
                column.find(".task, .dropDownMenu, .remaining").hide();
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

            $.each($("tbody input:checked"), function (index, checkbox) {
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
