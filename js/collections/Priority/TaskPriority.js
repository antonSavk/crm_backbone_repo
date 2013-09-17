define([
    "localstorage",
    "models/Priority"
],
    function (Localstorage, PriorityModel) {
        var taskPriorityCollection = Backbone.Collection.extend({
            model: PriorityModel,

            url: function () {
                return "http://" + App.Server.ip + ":" + App.Server.port + "/Priority";
            },

            initialize: function () {
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
            
            parse: true,

            parse: function (response) {
                return response.data;
            },

            fetchSuccess: function (collection, response) {
                console.log("Persons fetchSuccess");
            },
            fetchError: function (error) {

            }

        });

        return taskPriorityCollection;
    });