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
            	var url = "http://" + App.Server.ip + ":" + App.Server.port + "/Customer";

                return url;
            },


            initialize: function() {

                console.log("Customer Collection Init");
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

            parse:true,
           
            parse: function (response) {
                return response.data;
            },

            fetchSuccess: function(collection, response){
                console.log("Customers fetchSuccess");
            },
            fetchError: function(error){
                console.log("Customers fetchError");
            }


        });

        return CustomersCollection;
    });