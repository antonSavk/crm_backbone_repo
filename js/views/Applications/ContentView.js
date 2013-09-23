define([
    'jqueryui',
    'text!templates/Applications/list/ListTemplate.html',
    'text!templates/Applications/form/FormTemplate.html',
    'text!templates/Applications/kanban/KanbanTemplate.html',
    'collections/Applications/ApplicationsCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/Applications/list/ListItemView',
    'views/Applications/thumbnails/ThumbnailsItemView',
    'views/Applications/kanban/KanbanItemView',
    "localstorage",
    'custom'
],

function (jqueryui, ApplicationsListTemplate, ApplicationsFormTemplate, ApplicationsKanbanTemplate, ApplicationsCollection, WorkflowsCollection, ApplicationsListItemView, ApplicationsThumbnailsItemView, ApplicationsKanbanItemView, LocalStorage, Custom) {
    var ApplicationsView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Applications View');
            var that = this;
            this.workflowsCollection = new WorkflowsCollection({ id: 'application' });
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
            "click .fold": "foldUnfoldColumn",
            "click .form a": "gotoProjectForm"
        },

        gotoProjectForm: function (e) {
            e.preventDefault();
            var itemIndex = this.projectsCollection.indexOf(this.projectsCollection.get($(e.target).closest("a").attr("id"))) + 1;
            window.location.hash = "#home/content-Applications/form/" + itemIndex;
        },

        render: function () {
            var that = this;
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Applications View');
            var viewType = Custom.getCurrentVT();
            var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;
            switch (viewType) {
                case "kanban":
                    {
                        this.$el.html(_.template(ApplicationsKanbanTemplate));
                        var workflows = this.workflowsCollection.models;

                        _.each(workflows, function (workflow, index) {
                            $("<div class='column' id='applicationColumn' data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><div class='columnNameDiv'><h2 class='columnName'>" + workflow.get('name') + "</h2></div></div>").appendTo(".kanban");
                        });

                        $(".column").last().addClass("lastColumn");

                        _.each(workflows, function (workflow, i) {
                            var counter = 0,
                                remaining = 0;
                            var column = this.$(".column").eq(i);
                            _.each(this.collection.models, function (model) {
                                if (model.get("workflow").name === column.data("name")) {
                                    column.append(new ApplicationsKanbanItemView({ model: model }).render().el);
                                    counter++;
                                    remaining += model.get("estimated") - model.get("loged");
                                }
                            }, this);
                            column.find("div").append("<p class='counter'>" + counter + "</p><a class='foldUnfold' href='#'><img hidden='hidden' src='./images/downCircleBlack.png'/></a><ul hidden='hidden' class='dropDownMenu'></ul>");
                        }, this);
                        break;
                    }
                case "list":
                    {
                        this.$el.html(_.template(ApplicationsListTemplate));
                        var table = this.$el.find('table > tbody');

                        _.each(this.collection.models, function (model) {
                            table.append(new ApplicationsListItemView({ model: model }).render().el);
                            console.log(model);
                        }, this);

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });

                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > this.collection.models.length - 1) {
                            itemIndex = this.collection.models.length - 1;

                            var urlParts = window.location.hash.split('/');
                            if (urlParts[4]) {
                                urlParts[4] = this.collection.models.length;
                                window.location.hash = urlParts.join('/');
                            }
                            Custom.setCurrentII(this.collection.models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html();
                        } else {
                            var currentModel = this.collection.models[itemIndex];
                            currentModel.set({ nextAction: currentModel.get("nextAction").split('T')[0].replace(/-/g, '/') });
                            this.$el.html(_.template(ApplicationsFormTemplate, currentModel.toJSON()));
                        }

                        break;
                    }
            }
            this.$(".kanban").height(this.$el.siblings("#leftmenu-holder").height() - this.$el.siblings("#top-bar").height());
            this.$(".column").sortable({
                connectWith: ".column",
                cancel: "h2",
                cursor: "move",
                items: ".application",
                opacity: 0.7,
                revert: true,
                helper: 'clone',
                start: function (event, ui) {
                    var column = ui.item.closest(".column");
                    var model = that.collection.get(ui.item.attr("id"));
                    column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
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
                    that.collection.trigger('reset');
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
                column.find(".application, .remaining").show();
                column.find(".dropDownMenu").hide();
                column.find(".columnNameDiv");
                column.removeClass("rotate");
                column.find(".counter, .foldUnfold img").attr('style', '');;
            } else {
                column.css('max-width', '40px');
                column.find(".application, .dropDownMenu, .remaining").hide();
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

    return ApplicationsView;
});
