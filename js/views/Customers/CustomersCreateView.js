define([
    "jquery",
    "underscore",
    "backbone",
    "text!templates/Customers/CustomersCreateFormTemplate.html",
    "collections/Customers/AccountsDdCollection"
],
    function ($, _, Backbone, CustomersCreateFormTemplate, AccountsDdCollection) {
        var CustomersCreateView = Backbone.View.extend({
            el: "#content-holder",

            template: _.template(CustomersCreateFormTemplate),

            initialize: function () {
                this.collection = new AccountsDdCollection();
                this.collection.bind('reset', _.bind(this.render, this));
            },

            render: function () {
                this.$el.html(this.template());
                return this;
            }

        });

        return CustomersCreateView;
    });