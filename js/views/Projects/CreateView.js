define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Projects/CreateTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Projects/ProjectsCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection",
    "localstorage"
],
    function ($, _, Backbone, CreateTemplate, AccountsDdCollection, ProjectsCollection, CustomersCollection, WorkflowsCollection, LocalStorage) {
        var hash = LocalStorage.getFromLocalStorage('hash'),
            uid = LocalStorage.getFromLocalStorage('uid');
        var mid = 39;
        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            _modelBinder: undefined,
            template: _.template(CreateTemplate),
            initialize: function () {
               this.accountDdCollection = new AccountsDdCollection();
               this.accountDdCollection.bind('reset', _.bind(this.render, this));
               this.customersDdCollection = new CustomersCollection();
               this.customersDdCollection.bind('reset', _.bind(this.render, this));
               this.workflowsDdCollection = new WorkflowsCollection({id:'project'});
               this.workflowsDdCollection.bind('reset', _.bind(this.render, this));
               this.bind('reset', _.bind(this.render, this));
               this.projectsCollection = new ProjectsCollection();
               this.render();
            },

            close: function(){
                this._modelBinder.unbind();
            },

            events:{
                "submit form": "submit"
            },

            submit: function(event){
                event.preventDefault();
                
                var projectname = $("#projectName").val();
                if ($.trim(projectname) == "")
                {
                	projectname = "New Project";
                }
                debugger
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
                var projectmanager = this.accountDdCollection.where({id: idManager});
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
                $userNodes.each(function (key, val) {
                    
                	users.push({
                		uid: val.value,
                		uname: val.innerHTML
                	});
                });
                
                //debugger
                this.projectsCollection.create({
                	projectname: projectname,
                	customer: customer,
                	projectmanager: projectmanager,
                	workflow: workflow,
                	teams: {
                		users: users
                	}
                }, {
                    
                    headers: {
                        
            			uid: uid,
            			hash: hash,
            			mid: mid
            		}
                });
            },

            render: function () {
                this.$el.html(this.template({accountDdCollection:this.accountDdCollection, customersDdCollection: this.customersDdCollection, workflowsDdCollection: this.workflowsDdCollection}));

                /*var bindings = {
                    testCB : '[name=testCB]',
                    companyCB : [{
                        selector: '[name=companyCB]'
                        },
                        {
                            selector: '[name=testCB]', elAttribute: 'enabled',
                            converter:function(direction, value){
                                return value === 'checked';
                            }
                        }
                    ]


                }
                this._modelBinder.bind(this.model,this.el, bindings);*/
                return this;
            }

        });

        return CreateView;
    });