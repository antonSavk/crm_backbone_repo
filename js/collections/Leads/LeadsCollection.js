define([
    'models/LeadModel',
    'localstorage'
],
    function (LeadModel, Localstorage) {
        var LeadsCollection = Backbone.Collection.extend({
            model: LeadModel,
            url: function () {
                var hash = Localstorage.getFromLocalStorage('hash'),
                	uid = Localstorage.getFromLocalStorage('uid'),
                	mid = 39,
                	url = "http://" + App.Server.ip + ":" + App.Server.port + "/Leads";

                return url;
            },

            initialize: function () {
                console.log("Leads Collection Init");

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
                console.log("Leads fetchSuccess");
            },

            fetchError: function (error) {

            }

        });

        return LeadsCollection;
    });