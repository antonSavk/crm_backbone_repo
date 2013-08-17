define([
    "jquery",
    "underscore",
    "backbone",
    'text!templates/Customers/CustomersTemplate.html',
    'collections/CustomersCollection',
    'views/Customers/CustomersItemView'
],
function ($, _, Backbone, CustomersTemplate, CustomersCollection, CustomersItemView) {
    var CustomersView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function(){
            console.log('Init Customers View');
            this.collection = new CustomersCollection();
            //this.collection.bind('reset',this.render, this);
            this.collection.bind('reset', _.bind(this.render, this));
        },

        template: _.template(CustomersTemplate),

        render: function(){
            console.log('Render Customers View');
            this.$el.html(this.template());
            var table = this.$el.find('table > tbody');

            this.collection.each(function(model){
                table.append(new CustomersItemView({model:model}).render().el);
            });

            return this;

        }
    });

    return CustomersView;
});