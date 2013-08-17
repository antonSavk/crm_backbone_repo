define([
    "jquery",
    "underscore",
    "backbone",
    'text!templates/Customers/CustomersTopBarTemplate.html'
],
    function ($, _, Backbone, CustomersTopBarTemplate) {
        var CustomersTopBarView = Backbone.View.extend({
            el:'#top-bar',
            template: _.template(CustomersTopBarTemplate),

            initialize: function(){
                this.render();
            },

            render: function(){
                this.$el.html(this.template());
                return this;
            }

        });



        return CustomersTopBarView;
    });