define([
    "text!templates/JobPositions/EditTemplate.html",
    "collections/JobPositions/JobPositionsCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, JobPositionsCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Job Positions",

            initialize: function (options) {
               this.jobPositionsCollection = options.collection;
               this.jobPositionsCollection.bind('reset', _.bind(this.render, this));
               
               this.render();
            },

            saveItem: function () {
              
            	var itemIndex = Custom.getCurrentII() - 1;
            	
            	if (itemIndex != -1) 
        		{
            		var currentModel = this.collection.models[itemIndex];
            		
            		var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

            		var name = $.trim($("#name").val());

            		var expectedRecruitment = $.trim($("#expectedRecruitment").val());

            		var description = $.trim($("#description").val());

            		var requirements = $.trim($("#requirements").val());
            	  
            		currentModel.set({
            		    name: name,
            		    expectedRecruitment: expectedRecruitment,
            		    description: description,
            		    requirements: requirements
	                });
	                
	                currentModel.save({}, {
	                	headers: {
	            			uid: uid,
	            			hash: hash,
	            			mid: mid
	            		}
	                });
	                                
	                Backbone.history.navigate("home/content-"+this.contentType, {trigger:true});
        		}
            	
            },

            render: function () {
            	var itemIndex = Custom.getCurrentII() - 1;
            	
            	if (itemIndex == -1) 
        		{
        			this.$el.html();
        		}else
        		{
            	    var currentModel = this.jobPositionsCollection.models[itemIndex];
        			this.$el.html(_.template(EditTemplate, {model: currentModel.toJSON()}));
        		}
            	
                return this;
            }

        });

        return EditView;
    });