define([
    "jquery",
    "underscore",
    "backbone",
    'localstorage'
],
    function ($, _, Backbone, Localstorage) {
        var UserModel = Backbone.Model.extend({
        });

        var UsersCollection = Backbone.Collection.extend({
            model: UserModel,
            url: function(){
            	var hash = Localstorage.getFromLocalStorage('hash'),
                	uid = Localstorage.getFromLocalStorage('uid'),
                	mid = 39,
                	url = "http://" + App.Server.ip + ":" + App.Server.port + "/getUsers?uid="+uid+"&hash="+hash+"&mid="+mid;
                return url;
            },


            initialize: function(){
                console.log("User Collection Init");
                
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
            	console.log('parse Users');
                $.each(response.data, function(index,val){
                    response.data[index]["id"] = response.data[index]["_id"];
                    delete response.data[index]["_id"];
                });
                return response.data;
            },

            fetchSuccess: function(collection, response){
                console.log("Users fetchSuccess");
                /*if (options.success) {
                    options.success(result);
                }*/
            },
            fetchError: function(error){

            }


        });

        return UsersCollection;
    });