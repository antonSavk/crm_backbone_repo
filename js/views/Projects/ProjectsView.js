define([
    "jquery",
    "underscore",
    "backbone",
    'text!templates/Projects/list/ProjectsTemplate.html',
    'text!templates/Projects/form/ProjectsTemplate.html',
    'collections/Projects/ProjectsCollection',
    'views/Projects/list/ProjectsItemView',
    'views/Projects/thumbnails/ProjectsItemView'
],
function ($, _, Backbone, ProjectsListTemplate, ProjectsFormTemplate, ProjectsCollection, ProjectsListItemView, ProjectsThumbnailsItemView) {
    var ProjectsView = Backbone.View.extend({
        el: '#content-holder',
        viewtype: null,
        currentItem: null,
        initialize: function(options){
        	this.currentItem = options.currentItem;
        	this.viewtype = options.viewtype; 
            console.log('Init Projects View');
            this.collection = new ProjectsCollection();
            //this.collection.bind('reset',this.render, this);
            this.collection.bind('reset', _.bind(this.render, this));
        },

        
        render: function(){
            console.log('Render Projects View');
            
            switch(this.options.viewtype)
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
            		var currentModel = this.collection.models[(this.currentItem>this.collection.models.length) ? this.collection.models.length-1 : this.currentItem-1];
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
