define([
    'jqueryui',
    'text!templates/Opportunities/list/ListTemplate.html',
    'text!templates/Opportunities/form/FormTemplate.html',
    'text!templates/Opportunities/kanban/KanbanTemplate.html',
    'collections/Opportunities/OpportunitiesCollection',
    'collections/Leads/LeadsCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/Opportunities/list/ListItemView',
    'views/Opportunities/kanban/KanbanItemView',
    'localstorage',
    'custom'
],

function (jqueryui, ListTemplate, FormTemplate, KanbanTemplate, OpportunitiesCollection, LeadsCollection, WorkflowsCollection, ListItemView, KanbanItemView, LocalStorage, Custom) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Opportunities View');
            var that = this;
            this.workflowsCollection = new WorkflowsCollection({ id: 'opportunity' });
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
            "click .breadcrumb a, #lost, #won": "changeWorkflow",
            "click #hire": "isEmployee",
            "click #tabList a": "switchTab"
        },

        switchTab: function (e) {
            e.preventDefault();
            var link = this.$("#tabList a");
            if (link.hasClass("selected")) {
                link.removeClass("selected");
            }
            var index = link.index($(e.target).addClass("selected"));
            this.$(".tab").hide().eq(index).show();
        },

        render: function () {
            var that = this;
            Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Opportunities View');
            var viewType = Custom.getCurrentVT();
            var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;
            switch (viewType) {
                case "kanban":
                    {
                        this.$el.html(_.template(KanbanTemplate));
                        var workflows = this.workflowsCollection.models;

                        _.each(workflows, function (workflow, index) {
                            $("<div class='column' data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><div class='columnNameDiv'><h2 class='columnName'>" + workflow.get('name') + "</h2></div></div>").appendTo(".kanban");
                        });

                        $(".column").last().addClass("lastColumn");

                        _.each(workflows, function (workflow, i) {
                            var counter = 0,
                                revenue = 0;
                            var column = this.$(".column").eq(i);
                            _.each(this.collection.models, function (model) {
                                if (model.get("workflow").name === column.data("name")) {
                                    column.append(new KanbanItemView({ model: model }).render().el);
                                    counter++;
                                    revenue += model.get("expectedRevenue").value;
                                }
                            }, this);
                            column.find(".columnNameDiv").append("<p class='counter'>" + counter + "</p><a class='foldUnfold' href='#'><img hidden='hidden' src='./images/downCircleBlack.png'/></a><ul hidden='hidden' class='dropDownMenu'></ul><p class='revenue'>Expected Revenues: <span>" + revenue + "</span></p>");
                        }, this);
                        break;
                    }
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate));
                        var table = this.$el.find('table > tbody');

                        _.each(this.collection.models, function (model) {
                            table.append(new ListItemView({ model: model }).render().el);
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
                            //currentModel.set({ nextAction: currentModel.get("nextAction").split('T')[0].replace(/-/g, '/') });
                            currentModel.on('change', this.render, this);
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));

                            var workflows = this.workflowsCollection.models;
                            _.each(workflows, function (workflow, index) {
                                $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                                if (index == workflows.length - 1)
                                    this.$(".breadcrumb li").last().hide();
                            });

                            _.each(workflows, function (workflow, i) {
                                var breadcrumb = this.$(".breadcrumb li").eq(i);
                                if (currentModel.get("workflow").name === breadcrumb.data("name")) {
                                    breadcrumb.find("a").addClass("active");
                                    var button = breadcrumb.closest(".breadcrumb").siblings();
                                    if (breadcrumb.is(':nth-last-child(2)') || breadcrumb.is(':last-child')) {
                                        button.hide();
                                    }
                                    else {
                                        button.show();
                                    }
                                    if (breadcrumb.is(':last-child')) {
                                        this.$(".breadcrumb li").last().show();
                                    }
                                }
                            }, this);
                        }

                        break;
                    }
            }
            this.$(".kanban").height(this.$el.siblings("#leftmenu-holder").height() - this.$el.siblings("#top-bar").height());
            this.$(".column").sortable({
                connectWith: ".column",
                cancel: "h2",
                cursor: "move",
                items: ".opportunity",
                opacity: 0.7,
                revert: true,
                helper: 'clone',
                start: function (event, ui) {
                    var column = ui.item.closest(".column");
                    var model = that.collection.get(ui.item.attr("id"));
                    column.find(".counter").html(parseInt(column.find(".counter").html()) - 1);
                    column.find(".revenue span").html(parseInt(column.find(".revenue span").html()) - (model.get("expectedRevenue").value));
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
                    column.find(".revenue span").html(parseInt(column.find(".revenue span").html()) + (model.get("expectedRevenue").value));
                }
            }).disableSelection();
            return this;
        },

        changeWorkflow: function (e) {
            var hash = LocalStorage.getFromLocalStorage('hash'),
                   uid = LocalStorage.getFromLocalStorage('uid'),
                   mid = 39;
            var name = '', status = '';
            var breadcrumbList = $(e.target).closest(".formHeader").find(".breadcrumb");
            var length = this.workflowsCollection.models.length;
            var breadcrumb = $(e.target).closest('li');
            var button = breadcrumb.closest(".breadcrumb").siblings();
            var a = breadcrumb.siblings().find("a");
            this.$(".breadcrumb li").last().hide();
            if (a.hasClass("active")) {
                a.removeClass("active");
            }
            breadcrumb.find("a").addClass("active");
            if (breadcrumb.is(':nth-last-child(2)')) {
                button.hide();
            }
            else {
                button.show();
            }
            if ($(e.target).hasClass("applicationWorkflowLabel")) {
                name = breadcrumb.data("name");
                status = breadcrumb.data("status");
            }
            else {
                var workflow = {};
                if ($(e.target).attr("id") == "won") {
                    workflow = this.workflowsCollection.models[length - 2];
                }
                else {
                    workflow = this.workflowsCollection.models[length - 1];
                    console.log(breadcrumbList.children().length);
                    if (breadcrumbList.children().length == length) {
                        this.$(".breadcrumb li").last().show();
                    }
                }
                name = workflow.get('name');
                status = workflow.get('status');
            }
            var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
            var ob = {
                workflow: {
                    name: name,
                    status: status
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

        },

        isEmployee: function (e) {
            var hash = LocalStorage.getFromLocalStorage('hash'),
                   uid = LocalStorage.getFromLocalStorage('uid'),
                   mid = 39;
            var model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
            model.set({ isEmployee: true });
            model.save({}, {
                headers: {
                    uid: uid,
                    hash: hash,
                    mid: mid
                }

            });
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
                column.find(".opportunity, .revenue").show();
                column.find(".dropDownMenu").hide();
                column.find(".columnNameDiv");
                column.removeClass("rotate");
                column.find(".counter, .foldUnfold img").attr('style', '');;
            } else {
                column.css('max-width', '40px');
                column.find(".opportunity, .dropDownMenu, .revenue").hide();
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

    return ContentView;
});
