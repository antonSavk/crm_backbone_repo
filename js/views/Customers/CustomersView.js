define([
    "jquery",
    "underscore",
    "backbone",
    'text!templates/Customers/list/CustomersTemplate.html',
    'text!templates/Customers/form/CustomersTemplate.html',
    'collections/CustomersCollection',
    'views/Customers/list/CustomersItemView',
    'views/Customers/thumbnails/CustomersItemView'
],
function ($, _, Backbone, CustomersListTemplate, CustomersFormTemplate, CustomersCollection, CustomersListItemView, CustomersThumbnailsItemView) {
    var CustomersView = Backbone.View.extend({
        el: '#content-holder',
        viewtype: null,
        currentItem: null,
        initialize: function(options){
        	this.currentItem = options.currentItem;
        	this.viewtype = options.viewtype; 
            console.log('Init Customers View');
            this.collection = new CustomersCollection();
            //this.collection.bind('reset',this.render, this);
            this.collection.bind('reset', _.bind(this.render, this));
        },

        render: function(){
            console.log('Render Customers View');
            
            switch(this.options.viewtype)
            {
            	case "list":
            	{
	        		this.$el.html(_.template(CustomersListTemplate));
	                var table = this.$el.find('table > tbody');
	
	                this.collection.each(function(model){
	                    table.append(new CustomersListItemView({model:model}).render().el);
	                });
					break;
            	}
            	case "thumbnails":
            	{
            		this.$el.html('');
            		var holder = this.$el;
	                this.collection.each(function(model){
	                	$(holder).append(new CustomersThumbnailsItemView({model:model}).render().el);
	                });
	                break;
            	}
            	case "form":
            	{
            		var currentModel = this.collection.models[(this.currentItem>this.collection.models.length) ? this.collection.models.length-1 : this.currentItem-1];
            		this.$el.html(_.template(CustomersFormTemplate, currentModel.toJSON()));
            		
            		break;
            	}
            	case "gantt":
            	{
            		console.log('render gantt');
            		break;
            	}
            }
            
            return this;

        }
    });

    return CustomersView;
});