define([
    'localstorage'
],
    function (Localstorage) {
        var CustomerModel = Backbone.Model.extend({
            idAttribute: '_id'
        });

        var CustomersCollection = Backbone.Collection.extend({
            model: CustomerModel,
            url: function(){
            	var hash = Localstorage.getFromLocalStorage('hash'),
                	uid = Localstorage.getFromLocalStorage('uid'),
                	mid = 39,
                	url = "http://" + App.Server.ip + ":" + App.Server.port + "/Customer?uid=" + uid + "&hash=" + hash + "&mid=" + mid;
                return url;
            },


            initialize: function(){
                console.log("Customer Collection Init");
                
                this.fetch({
                    type: 'GET',
                    reset:true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            parse:true,

            parse: function(response){
                return response.data;
            },

            fetchSuccess: function(collection, response){
                console.log("Customers fetchSuccess");
            },
            fetchError: function(error){

            }


        });

        return CustomersCollection;
    });