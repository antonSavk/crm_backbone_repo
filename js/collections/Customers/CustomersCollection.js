define([
    "jquery",
    "underscore",
    "backbone",
    'localstorage'
],
    function ($, _, Backbone, Localstorage) {
        var CustomerModel = Backbone.Model.extend({
        });

        var CustomersCollection = Backbone.Collection.extend({
            model: CustomerModel,
            url: function(){
                return "http://" + App.Server.ip + ":" + App.Server.port + "/getAllForCustomers"
            },


            initialize: function(){
                console.log("Customer Collection Init");
                var hash = Localstorage.getFromLocalStorage('hash'),
                    uid = Localstorage.getFromLocalStorage('uid'),
                    mid = 23;

                this.fetch({data: $.param({
                    hash:hash,
                    uid:uid,
                    mid:mid
                }),
                    type: 'POST',
                    reset:true,
                    success: this.fetchSuccess,
                    error: this.fetchError
                });
            },

            parse:true,

            parse: function(response){
                console.log('parse Customers');
                $.each(response.data, function(index,val){
                    response.data[index]["id"] = response.data[index]["_id"];
                    delete response.data[index]["_id"];
                });
                return response.data;
            },

            fetchSuccess: function(collection, response){
                console.log("Customers fetchSuccess");
                if (options.success) {
                    options.success(result);
                }
            },
            fetchError: function(error){

            }


        });

        return CustomersCollection;
    });