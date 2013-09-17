define([
    "text!templates/Tasks/EditTemplate.html",
    "collections/Projects/ProjectsDdCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Tasks/TasksCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "collections/Priority/TaskPriority",
    "localstorage",
    "custom"
],
    function (EditTemplate, ProjectsDdCollection, AccountsDdCollection, TasksCollection, CustomersCollection, WorkflowsCollection, PriorityCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Tasks",

            initialize: function (options) {
                this.projectsDdCollection = new ProjectsDdCollection();
                this.accountsDdCollection = new AccountsDdCollection();
                this.customersDdCollection = new CustomersCollection();
                this.workflowsDdCollection = new WorkflowsCollection({ id: "task" });
                this.priorityCollection = new PriorityCollection();
                this.tasksCollection = options.collection;

                this.projectsDdCollection.bind('reset', _.bind(this.render, this));
                this.tasksCollection.bind('reset', _.bind(this.render, this));
                this.accountsDdCollection.bind('reset', _.bind(this.render, this));
                this.customersDdCollection.bind('reset', _.bind(this.render, this));
                this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
                this.priorityCollection.bind('reset', _.bind(this.render, this));
                
                this.render();

            },

            events: {
                "click #tabList a": "switchTab",
            },

            switchTab: function (e) {
                e.preventDefault();
                var index = this.$("#tabList a").toggleClass("selected").index($(e.target));
                this.$(".tab").hide().eq(index).show();
            },

            saveItem: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

                    var summary = $("#summary").val();
                    if ($.trim(summary) == "") {
                        summary = "New Summary";
                    }

                    var idProject = this.$("#projectDd option:selected").val();
                    var project = this.projectsDdCollection.get(idProject);
                    if (!project) {
                        project = null;
                    } else {
                        project = project.toJSON();
                    }

                    var assignedto = {};
                    var idAssignedTo = this.$("#assignedTo option:selected").val();
                    var unameAssignedTo = this.accountsDdCollection.get(idAssignedTo);
                    if (!unameAssignedTo) {
                        assignedto = null;
                    }
                    else {
                        assignedto.uname = unameAssignedTo.get('name').first + " " + unameAssignedTo.get('name').last;
                        assignedto.uid = idAssignedTo;
                    }


                    var deadlineSt = $.trim($("#deadline").val());
                    var deadline = "";
                    if (!deadlineSt) {
                        deadline = null;
                    }
                    else {
                        deadline = new Date(Date.parse(deadlineSt)).toISOString();
                    }

                    var tags = $.trim($("#tags").val()).split(',');
                    if (tags.length == 0) {
                        tags = null;
                    }

                    var description = $("#description").val();
                    if ($.trim(description) == "") {
                        description = "New Description";
                    }

                    var sequence = parseInt($.trim($("#sequence").val()));
                    if (!sequence) {
                        sequence = null;
                    }

                    var startDateSt = $.trim($("#StartDate").val());
                    var StartDate = "";
                    if (!startDateSt) {
                        StartDate = null;
                    }
                    else {
                        StartDate = new Date(Date.parse(startDateSt)).toISOString();
                    }

                    var endDateSt = $.trim($("#EndDate").val());
                    var EndDate = "";
                    if (!endDateSt) {
                        EndDate = null;
                    }
                    else {
                        EndDate = new Date(Date.parse(endDateSt)).toISOString();
                    }

                    var idCustomer = this.$("#customerDd option:selected").val();
                    var customer = this.customersDdCollection.get(idCustomer);
                    console.log(idCustomer);
                    if (!customer) {
                        customer = null;
                    } else {
                        customer = customer.toJSON();
                    }

                    var idWorkflow = this.$("#workflowDd option:selected").val();
                    var workflow = this.workflowsDdCollection.get(idWorkflow);
                    if (!workflow) {
                        workflow = null;
                    } else {
                        workflow = workflow.toJSON();
                    }

                    var estimated = $("#estimated").val();
                    if ($.trim(estimated) == "") {
                        estimated = 0;
                    }
                    var loged = $("#loged").val();
                    if ($.trim(loged) == "") {
                        loged = 0;
                    }
                    
                    var priority = $("#priority").val();
                    if ($.trim(priority) == "") {
                        priority = null;
                    }

                    currentModel.set({
                        summary: summary,
                        assignedto: assignedto,
                        workflow: workflow,
                        project: {
                            pId: idProject,
                            projectName: project.projectname
                        },
                        tags: tags,
                        deadline: deadline,
                        description: description,
                        extrainfo: {
                            priority: priority,
                            sequence: sequence,
                            customer:
                                {
                                    id: idCustomer,
                                    name: customer.name,
                                    type: customer.type
                                },
                            StartDate: StartDate,
                            EndDate: EndDate
                        },
                        estimated: estimated,
                        loged: loged
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
                var date = ISODate.split('T')[0].replace('-', '/');
                return date;
            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                }
                else {
                    var currentModel = this.tasksCollection.models[itemIndex];
                    var extrainfo = currentModel.get('extrainfo');
                    extrainfo['StartDate'] = this.ISODateToDate(currentModel.get('extrainfo').StartDate);
                    extrainfo['EndDate'] = this.ISODateToDate(currentModel.get('extrainfo').EndDate);
                    currentModel.set({ deadline: this.ISODateToDate(currentModel.get('deadline')), extrainfo: extrainfo }, { silent: true });
                    this.$el.html(_.template(EditTemplate, {
                        model: currentModel.toJSON(), projectsDdCollection: this.projectsDdCollection, accountsDdCollection: this.accountsDdCollection,
                        customersDdCollection: this.customersDdCollection, workflowsDdCollection: this.workflowsDdCollection, priorityCollection: this.priorityCollection
                    }));
                }
                return this;
            }

        });
        return EditView;
    });