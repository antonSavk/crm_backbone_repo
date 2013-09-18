define([
    "localstorage",
    "models/ProfileModel"
],
    function (Localstorage, ProfileModel) {
        var ProfilesCollection = Backbone.Collection.extend({
            model: ProfileModel,
            url: function () {
                return "http://" + App.Server.ip + ":" + App.Server.port + "/Profiles";
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

        return ProfilesCollection;
    });