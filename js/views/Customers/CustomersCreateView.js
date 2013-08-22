define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Customers/CustomersCreateFormTemplate.html",
    "collections/Customers/AccountsDdCollection",
    "collections/Customers/CustomersCollection"
],
    function ($, _, Backbone, CustomersCreateFormTemplate, AccountsDdCollection, CustomersCollection) {

        var CustomersCreateView = Backbone.View.extend({
            el: "#content-holder",
            _modelBinder: undefined,
            template: _.template(CustomersCreateFormTemplate),

            initialize: function () {
               this.accountDdCollection = new AccountsDdCollection();
               this.bind('reset', _.bind(this.render, this));
               this.customersCollection = new CustomersCollection();
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

        return CustomersCreateView;
    });