define([
    "localstorage",
    "models/PersonModel"
],
    function (Localstorage, PersonModel) {
        var PersonsCollection = Backbone.Collection.extend({
            model:PersonModel,
            url: function () {
                return "http://" + App.Server.ip + ":" + App.Server.port + "/Persons";
            },
            initialize: function(){
                var hash = Localstorage.getFromLocalStorage('hash'),
                    uid = Localstorage.getFromLocalStorage('uid'),
                    mid = 39;

                this.fetch({
                    data: $.param({
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }),
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
            },
            fetchError: function(error){
            }
        });

        return PersonsCollection;
    });