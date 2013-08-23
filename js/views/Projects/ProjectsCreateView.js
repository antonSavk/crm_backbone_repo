define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Projects/ProjectsCreateFormTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Projects/ProjectsCollection",
    "collections/Customers/CustomersCollection",
    "collections/Workflows/WorkflowsCollection"
],
    function ($, _, Backbone, ProjectsCreateFormTemplate, AccountsDdCollection, ProjectsCollection, CustomersCollection, WorkflowsCollection) {

        var ProjectsCreateView = Backbone.View.extend({
            el: "#content-holder",
            _modelBinder: undefined,
            template: _.template(ProjectsCreateFormTemplate),

            initialize: function () {
               this.accountDdCollection = new AccountsDdCollection();
               this.accountDdCollection.bind('reset', _.bind(this.render, this));
               this.customersDdCollection = new CustomersCollection();
               this.customersDdCollection.bind('reset', _.bind(this.render, this));
               this.workflowsDdCollection = new WorkflowsCollection();
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
                
                var idCustomer = $(this.el).find("#customerDd option:selected").val();
                var customer = this.customersDdCollection.where({id: idCustomer})[0];
                
                var idManager = $(this.el).find("#managerDd option:selected").val();
                var projectmanager = this.accountDdCollection.where({id: idManager})[0];
                
                var idWorkflow = $(this.el).find("#workflowDd option:selected").val();
                var workflow = this.workflowsDdCollection.where({id: idWorkflow})[0];
                debugger
                this.projectsCollection.create({
                	projectname: $("#projectName").val(),
                	customer: customer.toJSON(),
                	projectmanager: projectmanager.toJSON(),
                	workflow: workflow.toJSON(),
                	teams: {
                		users:[]
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

        return ProjectsCreateView;
    });