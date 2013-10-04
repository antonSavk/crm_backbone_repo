﻿define([
    "text!templates/Opportunities/EditTemplate.html",
    "collections/Opportunities/OpportunitiesCollection",
    "collections/Customers/CustomersCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Priority/TaskPriority",
    "collections/Workflows/WorkflowsCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, OpportunitiesCollection, CustomersCollection, EmployeesCollection, DepartmentsCollection, PriorityCollection, WorkflowsCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Opportunities",

            initialize: function (options) {
                this.customersCollection = new CustomersCollection();
                this.customersCollection.bind('reset', _.bind(this.render, this));
                this.employeesCollection = new EmployeesCollection();
                this.employeesCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.priorityCollection = new PriorityCollection();
                this.priorityCollection.bind('reset', _.bind(this.render, this));
                this.workflowsCollection = new WorkflowsCollection({ id: 'opportunity' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
                this.opportunitiesCollection = options.collection;
                this.opportunitiesCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            events: {
                "click .breadcrumb a, #lost, #won": "changeWorkflow"
            },

            saveItem: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

                    var name = $.trim($("#name").val());

                    var expectedRevenueValue = $.trim($("#expectedRevenueValue").val());
                    var expectedRevenueProgress = $.trim($("#expectedRevenueProgress").val());
                    if (expectedRevenueValue || expectedRevenueProgress) {
                        var expectedRevenue = {
                            value: expectedRevenueValue,
                            currency: '$',
                            progress: expectedRevenueProgress
                        };
                    }

                    var customerId = this.$("#customer option:selected").val();
                    var objCustomer = this.customersCollection.get(customerId);
                    var customer = {};
                    if (objCustomer) {
                        customer.id = customerId;
                        customer.name = objCustomer.get('name').first + " " + objCustomer.get('name').last;
                    }

                    var email = $.trim($("#email").val());
                    var phone = $.trim($("#phone").val());

                    var salesPersonId = this.$("#salesPerson option:selected").val();
                    var objSalesPerson = this.employeesCollection.get(salesPersonId);
                    var salesPerson = {};
                    if (objSalesPerson) {
                        salesPerson.id = salesPersonId;
                        salesPerson.name = objSalesPerson.get('name').first + " " + objSalesPerson.get('name').last;
                    }

                    var salesTeamId = this.$("#salesTeam option:selected").val();
                    var objSalesTeam = this.departmentsCollection.get(salesTeamId);
                    var salesTeam = {};
                    if (objSalesTeam) {
                        salesTeam.id = salesTeamId;
                        salesTeam.name = objSalesTeam.get('departmentName');
                    }

                    var nextActionSt = $.trim($("#nextActionDate").val());
                    var nextActionDescription = $.trim($("#nextActionDescription").val());
                    var nextActionDate = "";
                    if (nextActionSt) {
                        //nextActionDate = new Date(Date.parse(nextActionSt)).toISOString();
                        nextActionDate = nextActionSt;
                    }
                    var nextAction = {
                        date: nextActionDate,
                        desc: nextActionDescription
                    };

                    var expectedClosingSt = $.trim($("#expectedClosing").val());
                    var expectedClosing = "";
                    if (expectedClosingSt) {
                        expectedClosing = new Date(Date.parse(expectedClosingSt)).toISOString();
                    }

                    var priority = $("#priority").val();

                    var internalNotes = $.trim($("#internalNotes").val());

                    currentModel.set({
                        name: name,
                        expectedRevenue: expectedRevenue,
                        customer: customer,
                        email: email,
                        phone: phone,
                        salesPerson: salesPerson,
                        salesTeam: salesTeam,
                        nextAction: nextAction,
                        expectedClosing: expectedClosing,
                        priority: priority,
                        internalNotes: internalNotes
                    });
                    currentModel.save({}, {
                        headers: {
                            uid: uid,
                            hash: hash,
                            mid: mid
                        }
                    });
                    Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
                }
            },

            ISODateToDate: function (ISODate) {
                var date = ISODate.split('T')[0].replace(/-/g, '/');
                return date;
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

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                }
                else {
                    var currentModel = this.opportunitiesCollection.models[itemIndex];
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), customersCollection: this.customersCollection, employeesCollection: this.employeesCollection, departmentsCollection: this.departmentsCollection, priorityCollection: this.priorityCollection }));

                    var nextAction = currentModel.get('nextAction').date;
                    //if (nextAction) {
                    //    nextAction['date'] = this.ISODateToDate(nextAction);
                    //    currentModel.set({ nextAction: nextAction }, { silent: true });
                    //}
                    currentModel.on('change', this.render, this);

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
                return this;
            }

        });
        return EditView;
    });