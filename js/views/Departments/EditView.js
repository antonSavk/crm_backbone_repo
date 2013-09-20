define([
    "text!templates/Departments/EditTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, DepartmentsCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Departments",

            initialize: function (options) {
               this.departmentsCollection = options.collection;
               this.departmentsCollection.bind('reset', _.bind(this.render, this));
               
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
            	  
	                currentModel.set({
	                    projectname: projectname,
	                    customer: {
	                        id: customer._id,
	                        type: customer.type,
	                        name: customer.name.last + ' ' + customer.name.first
	                    },
	                    projectmanager: {
	                        uid: projectmanager._id,
	                        uname: projectmanager.name.last + ' ' + projectmanager.name.first
	                    },
	                    workflow: {
	                        name: workflow.name,
	                        status: workflow.status
	                    },
	                    teams: {
	                        users: users
	                    }
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
        			var currentModel = this.departmentsCollection.models[itemIndex];
        			this.$el.html(_.template(EditTemplate, {model: currentModel.toJSON()}));
        		}
            	
                return this;
            }

        });

        return EditView;
    });