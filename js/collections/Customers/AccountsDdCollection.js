define([
    "localstorage"
],
    function (Localstorage) {
        var AccountModel = Backbone.Model.extend({
            idAttribute: '_id'
		});
	
        var AccountsDdCollection = Backbone.Collection.extend({
        	model: AccountModel,
            url: function(){
            	var url = "http://" + App.Server.ip + ":" + App.Server.port + "/getAccountsForDd";
                return url;
            },

            initialize: function(){
                console.log("AccountsForDd Collection Init");
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
                console.log("AccountsForDd fetchSuccess");
            },
            fetchError: function(error){

            }
        });

        return AccountsDdCollection;
    });