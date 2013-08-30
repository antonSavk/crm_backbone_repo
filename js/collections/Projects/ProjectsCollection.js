define([
    "jquery",
    "underscore",
    "backbone",
    'localstorage'
],
    function ($, _, Backbone, Localstorage) {
        var ProjectModel = Backbone.Model.extend({
        	
        });

        var ProjectsCollection = Backbone.Collection.extend({
            model: ProjectModel,
            url: function(){
            	var hash = Localstorage.getFromLocalStorage('hash'),
                	uid = Localstorage.getFromLocalStorage('uid'),
                	mid = 39,
                	url = "http://" + App.Server.ip + ":" + App.Server.port + "/Projects?uid="+uid+"&hash="+hash+"&mid="+mid; 
            	
            	
                return url;
            },


            initialize: function(){
                console.log("Project Collection Init");
             
                this.fetch({
                    type: 'GET',
                    reset:true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            parse:true,

            parse: function(response){
            	debugger
                console.log('parse Projects');
                $.each(response.data, function(index,val){
                    response.data[index]["id"] = response.data[index]["_id"];
                    delete response.data[index]["_id"];
                });
                return response.data;
            },

            fetchSuccess: function(collection, response){
                console.log("Projects fetchSuccess");
                /*if (options.success) {
                    options.success(result);
                }*/
            },
            fetchError: function(error){

            }


        });

        return ProjectsCollection;
    });