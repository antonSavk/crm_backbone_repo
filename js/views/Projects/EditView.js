define([
    "text!templates/Projects/EditTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Projects/ProjectsCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, AccountsDdCollection, ProjectsCollection, CustomersCollection, WorkflowsCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Projects",

            initialize: function (options) {
               this.accountsDdCollection = new AccountsDdCollection();
               this.customersDdCollection = new CustomersCollection();
               this.workflowsDdCollection = new WorkflowsCollection({id:'project'});
               this.projectsCollection = options.collection;
               
               this.projectsCollection.bind('reset', _.bind(this.render, this));
               this.accountsDdCollection.bind('reset', _.bind(this.render, this));
               this.customersDdCollection.bind('reset', _.bind(this.render, this));
               this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
               
               this.render();
            },

            saveItem: function(){
            	var itemIndex = Custom.getCurrentII() - 1;
            	
            	if (itemIndex != -1) 
        		{
            		var currentModel = this.collection.models[itemIndex];
            		
            		var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;
            	    debugger 
            		var projectname = $("#projectName").val();
            		if ($.trim(projectname) == "") {
            		    projectname = "New Project";
            		}

            		var idCustomer = $(this.el).find("#customerDd option:selected").val();
            		var customer = this.customersDdCollection.get(idCustomer);

            		if (!customer) {
            		    customer = null;
            		}
            		else {
            		    customer = customer.toJSON();
            		}
            		var idManager = $(this.el).find("#managerDd option:selected").val();
            		var projectmanager = this.accountsDdCollection.get(idManager);
            		if (!projectmanager) {
            		    projectmanager = null;
            		} else {
            		    projectmanager = projectmanager.toJSON();
            		}
            		var idWorkflow = $(this.el).find("#workflowDd option:selected").val();
            		var workflow = this.workflowsDdCollection.get(idWorkflow);
            		if (!workflow) {
            		    workflow = null;
            		} else {
            		    workflow = workflow.toJSON();
            		}
            		var $userNodes = $("#usereditDd option:selected"), users = [];
            		$userNodes.each(function (key, val) {
            		    users.push({
            		        uid: val.value,
            		        uname: val.innerHTML
            		    });
            		});
	                
	                
	                currentModel.set({
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
	                });
	                //debugger
	                currentModel.save({}, {
	                	headers: {
	            			uid: uid,
	            			hash: hash,
	            			mid: mid
	            		}
	                });
	                                
	                Backbone.history.navigate("home/content-"+this.contentType, {trigger:true});
        		}
            	
            },

            render: function () {
            	var itemIndex = Custom.getCurrentII() - 1;
            	
            	if (itemIndex == -1) 
        		{
        			this.$el.html();
        		}else
        		{
        			var currentModel = this.projectsCollection.models[itemIndex];
        			this.$el.html(_.template(EditTemplate, {model: currentModel.toJSON(), accountsDdCollection: this.accountsDdCollection, customersDdCollection: this.customersDdCollection, workflowsDdCollection: this.workflowsDdCollection}));
        		}
            	
                return this;
            }

        });

        return EditView;
    });