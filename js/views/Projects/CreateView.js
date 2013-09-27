define([
    "text!templates/Projects/CreateTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Projects/ProjectsCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "models/ProjectModel",
    "localstorage",
    "custom"
],
    function (CreateTemplate, AccountsDdCollection, ProjectsCollection, CustomersCollection, WorkflowsCollection, ProjectModel, LocalStorage, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Projects",
            template: _.template(CreateTemplate),

            initialize: function (options) {
               this.accountDdCollection = new AccountsDdCollection();
               this.accountDdCollection.bind('reset', _.bind(this.render, this));
               this.customersDdCollection = new CustomersCollection();
               this.customersDdCollection.bind('reset', _.bind(this.render, this));
               this.workflowsDdCollection = new WorkflowsCollection({id: 'project'});
               this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
               this.projectsCollection = options.collection;
               this.projectsCollection.bind('reset', _.bind(this.render, this));
               this.render();
            },

            close: function(){
                this._modelBinder.unbind();
            },

            saveItem: function () {

                var self = this;
              
            	var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;
            	
            	var projectModel = new ProjectModel();
            	
                var projectname = $("#projectName").val();
                if ($.trim(projectname) == "")
                {
                	projectname = "New Project";
                }
                
                var idCustomer = $(this.el).find("#customerDd option:selected").val();
                var customer = this.customersDdCollection.get(idCustomer);
                
                if (!customer)
                {
                	customer = null;
                }
                else
                {
                	customer = customer.toJSON(); 
                }
                var idManager = $(this.el).find("#managerDd option:selected").val();
                var projectmanager = this.accountDdCollection.get(idManager);
                if (!projectmanager)
                {
                	projectmanager = null;
                }else
                {
                	projectmanager = projectmanager.toJSON(); 
                }
                var idWorkflow = $(this.el).find("#workflowDd option:selected").val();
                var workflow = this.workflowsDdCollection.get(idWorkflow);
                if (!workflow)
                {
                	workflow = null;
                }else
                {
                	workflow = workflow.toJSON(); 
                }
                var $userNodes = $("#usereditDd option:selected"), users = [];
                $userNodes.each(function(key, val){
                	users.push({
                		uid: val.value,
                		uname: val.innerHTML
                	});
                });


                projectModel.save({
                        projectname: projectname,
                        customer: {
                            id: customer._id,
                            type: customer.type,
                            name: customer.name.last + ' ' + customer.name.first
                        },
                        projectmanager: {
                            uid: projectmanager._id,
                            uname: projectmanager.name.last + ' ' + projectmanager.name.first
                        },
                        workflow: {
                            name: workflow.name,
                            status: workflow.status
                        },
                        teams: {
                            users: users
                        }
                    },
                    {
                        headers: {
                            uid: uid,
                            hash: hash,
                            mid: mid
                        }, 
                        wait: true, 
                        success: function (model) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });
            },

            render: function () {
                this.$el.html(this.template({accountDdCollection:this.accountDdCollection, customersDdCollection: this.customersDdCollection, workflowsDdCollection: this.workflowsDdCollection}));

                return this;
            }

        });

        return CreateView;
    });