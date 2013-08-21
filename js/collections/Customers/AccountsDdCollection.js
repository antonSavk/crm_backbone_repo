define([
    "jquery",
    "underscore",
    "backbone",
    "localstorage"
],
    function ($, _, Backbone, Localstorage) {
        var AccountsDdCollection = Backbone.Collection.extend({
            url: function(){
                return "http://" + App.Server.ip + ":" + App.Server.port + "/getAccountsForDd"
            },

            initialize: function(){
                console.log("AccountsForDd Collection Init");
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
                $.each(response.data, function(index){
                    if(response.data[index].hasOwnProperty('_id')){
                        response.data[index]["id"] = response.data[index]["_id"];
                        delete response.data[index]["_id"];
                    }

                });
                return response.data;
            },

            fetchSuccess: function(collection, response){
                console.log("Customers fetchSuccess");
            },
            fetchError: function(error){

            }
        });

        return AccountsDdCollection;
    });