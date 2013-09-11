define([
    'localstorage'
],
    function (Localstorage) {
        var CompanyModel = Backbone.Model.extend({
            idAttribute: '_id'
        });

        var CompaniesCollection = Backbone.Collection.extend({
            model: CompanyModel,
            url: function(){
            	var hash = Localstorage.getFromLocalStorage('hash'),
                	uid = Localstorage.getFromLocalStorage('uid'),
                	mid = 39,
                	url = "http://" + App.Server.ip + ":" + App.Server.port + "/Companies";
                
                return url;
            },
           
            initialize: function(){
                console.log("Companies Collection Init");
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

            parse: function (response) {
                return response.data;
            },

            fetchSuccess: function(collection, response){
                console.log("Companies fetchSuccess");
            },
            fetchError: function(error){

            }


        });

        return CompaniesCollection;
    });