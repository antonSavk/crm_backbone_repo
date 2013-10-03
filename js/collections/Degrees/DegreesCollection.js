define([
    'models/DegreeModel',
    'localstorage'
],
    function (DegreeModel, Localstorage) {
        var DegreesCollection = Backbone.Collection.extend({
            model: DegreeModel,
            url: function () {
                var hash = Localstorage.getFromLocalStorage('hash'),
                	uid = Localstorage.getFromLocalStorage('uid'),
                	mid = 39,
                	url = "http://" + App.Server.ip + ":" + App.Server.port + "/Degrees";

                return url;
            },

            initialize: function () {
                console.log("Degrees Collection Init");

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
                console.log("Degrees fetchSuccess");
            },

            fetchError: function (error) {

            }

        });

        return DegreesCollection;
    });