define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Projects/ProjectsCreateFormTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Projects/ProjectsCollection"
],
    function ($, _, Backbone, ProjectsCreateFormTemplate, AccountsDdCollection, ProjectsCollection) {

        var ProjectsCreateView = Backbone.View.extend({
            el: "#content-holder",
            _modelBinder: undefined,
            template: _.template(ProjectsCreateFormTemplate),

            initialize: function () {
               this.accountDdCollection = new AccountsDdCollection();
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
                debugger
                this.collection.create({

                });
            },

            render: function () {
                this.$el.html(this.template({collection:this.accountDdCollection}));

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