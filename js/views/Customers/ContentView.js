define([
    "jquery",
    "underscore",
    "backbone",
    'text!templates/Customers/list/ListTemplate.html',
    'text!templates/Customers/form/FormTemplate.html',
    'collections/Companies/CompaniesCollection',
    'views/Customers/list/ListItemView',
    'views/Customers/thumbnails/ThumbnailsItemView',
    'custom',
    'localstorage'

],
function ($, _, Backbone, ListTemplate, FormTemplate, CompaniesCollection, ListItemView, ThumbnailsItemView, Custom, LocalStorage) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        template: _.template(ListTemplate),
        //initialize: function (options) {
        initialize: function(){
            console.log('Init Customer View');
            this.companiesCollection = new CompaniesCollection();
            this.companiesCollection.bind('reset', _.bind(this.render, this));
            this.render();
        },

        events: {
        	"click .checkbox": "checked"
        },
        
        render: function(){
        	Custom.setCurrentCL(this.collection.models.length);
            console.log('Render Customer View');
            var viewType = Custom.getCurrentVT();
            switch(viewType)
            {
            	case "list":
            	{
	        		this.$el.html(this.template(ListTemplate));
	                var table = this.$el.find('table > tbody');
	
	                this.collection.each(function(model){
	                    table.append(new ListItemView({model:model}).render().el);
	                });
					break;
            	}
            	//case "thumbnails":
            	//{
            	//	this.$el.html('');
            	//	var holder = this.$el;
	            //    this.collection.each(function(model){
	            //    	$(holder).append(new ThumbnailsItemView({model:model}).render().el);
	            //    });
	            //    break;
            	//}
            	//case "form":
            	//{
            	//    debugger
            	//    var itemIndex = Custom.getCurrentII() - 1;
            	//	if (itemIndex > this.collection.models.length - 1)
            	//	{
            	//		itemIndex = this.collection.models.length - 1;
            	//		Custom.setCurrentII(this.collection.models.length);
            	//	}
            		
            	//	if (itemIndex == -1) 
            	//	{
            	//		this.$el.html();
            	//	}
                //    else
            	//	{
            	//		var currentModel = this.collection.models[itemIndex];
            	//		this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
            	//	}
            			
            	//	break;
            	//}
            	//case "gantt":
                //{
                //    console.log('render gantt');
                //    if(this.collection){
                //        var collection = this.collection.toJSON();
                //        var ganttChart =  Custom.createGanttChart(collection, false);
                //        this.$el.html('<div style="width:1180px; height:550px; position:relative;" id="GanttDiv"></div>');
                //        ganttChart.create("GanttDiv");
                //    }
                //    break;
                //}
            }
            
            return this;

        },
        
        checked: function(event)
        {
        	if ($("input:checked").length > 0)
        		$("#top-bar-deleteBtn").show();
        	else
        		$("#top-bar-deleteBtn").hide();
        },
        
        deleteItems: function()
        {
        	var self = this,
        		hash = LocalStorage.getFromLocalStorage('hash'),
        		uid = LocalStorage.getFromLocalStorage('uid'),
        		mid = 39;
        	
        	$.each($("input:checked"), function(index, checkbox){
        		var project = self.collection.where({id: checkbox.value})[0];
        		
        		/*project.set("projectname", 'testEDIT');
        		
        		project.save({},{
        			headers: {
        				uid: uid,
        				hash: hash,
        				mid: mid
        			}
        		});*/
        		
        		project.destroy({headers: {
        			uid: uid,
        			hash: hash,
        			mid: mid
        		}},
        		{ wait: true }
        		);
        	});
        	
        	this.collection.trigger('reset');
        }
    });

    return ContentView;
});