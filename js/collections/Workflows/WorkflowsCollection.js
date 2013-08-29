define([
    "jquery",
    "underscore",
    "backbone",
    'localstorage'
],
    function ($, _, Backbone, Localstorage) {
        var WorkflowModel = Backbone.Model.extend({
        });

        var WorkflowsCollection = Backbone.Collection.extend({
            model: WorkflowModel,
            url: function(){
            	var hash = Localstorage.getFromLocalStorage('hash'),
                	uid = Localstorage.getFromLocalStorage('uid'),
                	mid = 39,
                	url = "http://" + App.Server.ip + ":" + App.Server.port + "/workflows?uid="+uid+"&hash="+hash+"&mid="+mid+"&id="+this.type;
                return url;
            },
            
            type: "project",

            initialize: function(){
                console.log("Workflow Collection Init");
                
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
                console.log('parse Workflows');
                $.each(response.data.value, function(index,val){
                    response.data.value[index]["id"] = response.data.value[index]["_id"];
                    delete response.data.value[index]["_id"];
                });
                return response.data.value;
            },

            fetchSuccess: function(collection, response){
                console.log("Workflows fetchSuccess");
                /*if (options.success) {
                    options.success(result);
                }*/
            },
            fetchError: function(error){

            }


        });

        return WorkflowsCollection;
    });