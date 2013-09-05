define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Projects/EditTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Projects/ProjectsCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "localstorage",
    "custom"
],
    function ($, _, Backbone, EditTemplate, AccountsDdCollection, ProjectsCollection, CustomersCollection, WorkflowsCollection, LocalStorage, Custom) {

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
            	
	                var projectname = $("#projectName").val();
	                if ($.trim(projectname) == "")
	                {
	                	projectname = "New Project";
	                }
	                
	                var idCustomer = $(this.el).find("#customerDd option:selected").val();
	                var customer = this.customersDdCollection.where({id: idCustomer});
	                
	                if (customer.length == 0)
	                {
	                	customer = null;
	                }else
	                {
	                	customer = customer[0].toJSON(); 
	                }
	                var idManager = $(this.el).find("#managerDd option:selected").val();
	                var projectmanager = this.accountsDdCollection.where({id: idManager});
	                if (projectmanager.length == 0)
	                {
	                	projectmanager = null;
	                }else
	                {
	                	projectmanager = projectmanager[0].toJSON(); 
	                }
	                var idWorkflow = $(this.el).find("#workflowDd option:selected").val();
	                var workflow = this.workflowsDdCollection.where({id: idWorkflow});
	                if (workflow.length == 0)
	                {
	                	workflow = null;
	                }else
	                {
	                	workflow = workflow[0].toJSON(); 
	                }
	                var $userNodes = $("#usereditDd option:selected"), users = [];
	                $userNodes.each(function(key, val){
	                	users.push({
	                		uid: val.value,
	                		uname: val.innerHTML
	                	});
	                });
	                
	                
	                currentModel.set({
	                	projectname: projectname,
	                	customer: customer,
	                	projectmanager: projectmanager,
	                	workflow: workflow,
	                	teams: {
	                		users: users
	                	}
	                });
	                debugger
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
        			debugger
        			this.$el.html(_.template(EditTemplate, {model: currentModel.toJSON(), accountsDdCollection: this.accountsDdCollection, customersDdCollection: this.customersDdCollection, workflowsDdCollection: this.workflowsDdCollection}));
        		}
            	
                return this;
            }

        });

        return EditView;
    });