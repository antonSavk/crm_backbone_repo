define([
    'models/ProjectModel',
    'localstorage'
],
    function (ProjectModel, Localstorage) {
        var ProjectsCollection = Backbone.Collection.extend({
            model: ProjectModel,
            url: function(){
            	var hash = Localstorage.getFromLocalStorage('hash'),
                	uid = Localstorage.getFromLocalStorage('uid'),
                	mid = 39,
                	url = "http://" + App.Server.ip + ":" + App.Server.port + "/Projects";
            	
                return url;
            },

            initialize: function(){
                console.log("Project Collection Init");
                
                var hash = Localstorage.getFromLocalStorage('hash'),
            		uid = Localstorage.getFromLocalStorage('uid'),
            		mid = 39;
                
                this.fetch({
                	data: $.param({
                		uid: uid,
                		hash: hash,
                		mid: mid
                	}),
                    type: 'GET',
                    reset: true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            parse: true,

            parse: function(response){
                return response.data;
            },

            fetchSuccess: function(collection, response){
                console.log("Projects fetchSuccess");
            },
            fetchError: function(error){

            }


        });

        return ProjectsCollection;
    });