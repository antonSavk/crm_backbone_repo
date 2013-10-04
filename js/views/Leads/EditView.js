define([
    "text!templates/Leads/EditTemplate.html",
    "collections/Leads/LeadsCollection",
    'collections/Workflows/WorkflowsCollection',
    "collections/Companies/CompaniesCollection",
    "collections/Customers/CustomersCollection",
    "collections/Employees/EmployeesCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Priority/TaskPriority",
    "localstorage",
    "custom"
],
    function (EditTemplate, LeadsCollection, WorkflowsCollection, CompaniesCollection, CustomersCollection, EmployeesCollection, DepartmentsCollection, PriorityCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Leads",

            initialize: function (options) {
                this.workflowsCollection = new WorkflowsCollection({ id: 'lead' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
                this.companiesCollection = new CompaniesCollection();
                this.companiesCollection.bind('reset', _.bind(this.render, this));
                this.customersCollection = new CustomersCollection();
                this.customersCollection.bind('reset', _.bind(this.render, this));
                this.employeesCollection = new EmployeesCollection();
                this.employeesCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.priorityCollection = new PriorityCollection();
                this.priorityCollection.bind('reset', _.bind(this.render, this));
                this.contentCollection = options.collection;
                this.contentCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #cancelCase, #reset": "changeWorkflow"
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

            changeWorkflow: function (e) {
                var hash = LocalStorage.getFromLocalStorage('hash'),
                       uid = LocalStorage.getFromLocalStorage('uid'),
                       mid = 39;

                var breadcrumb = $(e.target).closest('li');
                var a = breadcrumb.siblings().find("a");
                var button = breadcrumb.closest(".breadcrumb").siblings();
                var name, status;

                if (a.hasClass("active")) {
                    a.removeClass("active");
                }
                breadcrumb.find("a").addClass("active");

                if (breadcrumb.is(':last-child')) {
                    button.hide();
                    button.last().show();
                }
                else {
                    button.show();
                    button.last().hide();
                }
                if ($(e.target).hasClass("applicationWorkflowLabel")) {
                    name = breadcrumb.data("name");
                    status = breadcrumb.data("status");
                }
                else {
                    var workflow = {};
                    if ($(e.target).attr("id") == "cancelCase") {
                        workflow = this.workflowsCollection.models[this.workflowsCollection.models.length - 1];
                    }
                    else {
                        workflow = this.workflowsCollection.models[0];
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
                model.on('change', this.render, this);
            },

            saveItem: function () {

                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

                    var name = $.trim($("#name").val());

                    var companyId = this.$("#company option:selected").val();
                    var objCompany = this.companiesCollection.get(companyId);
                    var company = {};
                    if (objCompany) {
                        company.id = companyId;
                        company.name = objCompany.get('cname');
                    }

                    var customerId = this.$("#customer option:selected").val();
                    var objCustomer = this.customersCollection.get(customerId);
                    var customer = {};
                    if (objCustomer) {
                        customer.id = customerId;
                        customer.name = objCustomer.get('name').first + " " + objCustomer.get('name').last;
                    }

                    var address = {};
                    $("p").find(".address").each(function () {
                        var el = $(this);
                        address[el.attr("name")] = el.val();
                    });

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

                    var first = $.trim($("#first").val());
                    var last = $.trim($("#last").val());
                    var contactName = {
                        first: first,
                        last: last
                    };

                    var email = $.trim($("#email").val());
                    var func = $.trim($("#func").val());
                    var phone = $.trim($("#phone").val());
                    var mobile = $.trim($("#mobile").val());
                    var phones = {
                        phone: phone,
                        mobile: mobile
                    };

                    var fax = $.trim($("#fax").val());

                    var priority = $("#priority").val();

                    var internalNotes = $.trim($("#internalNotes").val());

                    var active;
                    if ($("#active").is(":checked")) { console.log("true"); active = true; }
                    else { active = false; }

                    var optout;
                    if ($("#optout").is(":checked")) { optout = true; }
                    else { optout = false; }

                    var reffered = $.trim($("#reffered").val());

                    currentModel.set({
                        name: name,
                        company: company,
                        customer: customer,
                        address: address,
                        salesPerson: salesPerson,
                        salesTeam: salesTeam,
                        contactName: contactName,
                        email: email,
                        func: func,
                        phones: phones,
                        fax: fax,
                        priority: priority,
                        internalNotes: internalNotes,
                        active: active,
                        optout: optout,
                        reffered: reffered
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

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.contentCollection.models[itemIndex];
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), companiesCollection: this.companiesCollection, customersCollection: this.customersCollection, employeesCollection: this.employeesCollection, departmentsCollection: this.departmentsCollection, priorityCollection: this.priorityCollection }));
                    var workflows = this.workflowsCollection.models;
                    _.each(workflows, function (workflow, index) {
                        $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                    });

                    _.each(workflows, function (workflow, i) {
                        var breadcrumb = this.$(".breadcrumb li").eq(i);
                        if (currentModel.get("workflow").name === breadcrumb.data("name")) {
                            breadcrumb.find("a").addClass("active");
                            var button = breadcrumb.closest(".breadcrumb").siblings();
                            if (breadcrumb.is(':last-child')) {
                                button.hide();
                                button.last().show();
                            }
                            else {
                                button.show();
                                button.last().hide();
                            }
                        }
                    }, this);
                }

                return this;
            }

        });

        return EditView;
    });