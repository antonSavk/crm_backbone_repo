define([
    "jquery",
    "underscore",
    "backbone",
    'text!templates/Projects/list/ProjectsTemplate.html',
    'text!templates/Projects/form/ProjectsTemplate.html',
    'collections/Projects/ProjectsCollection',
    'views/Projects/list/ProjectsItemView',
    'views/Projects/thumbnails/ProjectsItemView',
    'custom'
],
function ($, _, Backbone, ProjectsListTemplate, ProjectsFormTemplate, ProjectsCollection, ProjectsListItemView, ProjectsThumbnailsItemView, Custom) {
    var ProjectsView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function(){
            console.log('Init Projects View');
            this.collection = new ProjectsCollection();
            //this.collection.bind('reset',this.render, this);
            this.collection.bind('reset', _.bind(this.render, this));
        },

        render: function(){
        	Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Projects View');
            var viewType = Custom.getCurrentVT();
            switch(viewType)
            {
            	case "list":
            	{
	        		this.$el.html(_.template(ProjectsListTemplate));
	                var table = this.$el.find('table > tbody');
	
	                this.collection.each(function(model){
	                    table.append(new ProjectsListItemView({model:model}).render().el);
	                });
					break;
            	}
            	case "thumbnails":
            	{
            		this.$el.html('');
            		var holder = this.$el;
	                this.collection.each(function(model){
	                	$(holder).append(new ProjectsThumbnailsItemView({model:model}).render().el);
	                });
	                break;
            	}
            	case "form":
            	{
            		var itemIndex = Custom.getCurrentII()-1;
            		if (itemIndex > this.collection.models.length - 1)
            		{
            			itemIndex = this.collection.models.length - 1;
            			Custom.setCurrentII(this.collection.models.length);
            		}
            		var currentModel = this.collection.models[itemIndex];
            		this.$el.html(_.template(ProjectsFormTemplate, currentModel.toJSON()));
            		
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

    return ProjectsView;
});
