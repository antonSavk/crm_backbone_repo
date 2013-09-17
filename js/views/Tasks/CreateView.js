define([
    "text!templates/Tasks/CreateTemplate.html",
    "collections/Projects/ProjectsDdCollection",
    "collections/Customers/AccountsDdCollection",
    "collections/Tasks/TasksCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "collections/Priority/TaskPriority",
    "localstorage",
    "custom"
],
    function (CreateTemplate, ProjectsDdCollection, AccountsDdCollection, TasksCollection, CustomersCollection, WorkflowsCollection, PriorityCollection, LocalStorage, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Tasks",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.projectsDdCollection = new ProjectsDdCollection();
                this.projectsDdCollection.bind('reset', _.bind(this.render, this));
                this.accountDdCollection = new AccountsDdCollection();
                this.accountDdCollection.bind('reset', _.bind(this.render, this));
                this.customersDdCollection = new CustomersCollection();
                this.customersDdCollection.bind('reset', _.bind(this.render, this));
                this.workflowsDdCollection = new WorkflowsCollection({ id: "task" });
                this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.priorityCollection = new PriorityCollection();
                this.priorityCollection.bind('reset', _.bind(this.render, this));
                this.tasksCollection = options.collection;
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            events: {
                "click #tabList a": "switchTab"
            },

            switchTab: function (e) {
                e.preventDefault();
                var index = this.$("#tabList a").toggleClass("selected").index($(e.target));
                this.$(".tab").hide().eq(index).show();
            },

            saveItem: function () {
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
                var unameAssignedTo = this.accountDdCollection.get(idAssignedTo);
                if (!unameAssignedTo) {
                    unameAssignedTo = null;
                }
                assignedto.uname = unameAssignedTo.get('name').first + " " + unameAssignedTo.get('name').last;
                assignedto.uid = idAssignedTo;


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

                this.tasksCollection.create({
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
                        customer:{
                                id: idCustomer,
                                name: customer.name,
                                type: customer.type
                            },
                        StartDate: StartDate,
                        EndDate: EndDate
                    },
                    estimated: estimated,
                    loged: loged
                },
                {
                    headers: {
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }
                });
                
               

                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
            },

            render: function () {
                this.$el.html(this.template({
                    projectsDdCollection: this.projectsDdCollection, accountDdCollection: this.accountDdCollection, customersDdCollection: this.customersDdCollection,
                    workflowsDdCollection: this.workflowsDdCollection, priorityCollection: this.priorityCollection
                }));

                return this;
            }

        });

        return CreateView;
    });