define([
    'localstorage'
],
    function (Localstorage) {
        var ProjectModelDd = Backbone.Model.extend({
            idAttribute: "_id"
        });

        var ProjectsDdCollection = Backbone.Collection.extend({
            model: ProjectModelDd,
            url: function () {
                var hash = Localstorage.getFromLocalStorage('hash'),
                	uid = Localstorage.getFromLocalStorage('uid'),
                	mid = 39,
                	url = "http://" + App.Server.ip + ":" + App.Server.port + "/getProjectsForDd?uid=" + uid + "&hash=" + hash + "&mid=" + mid;
                return url;
            },


            initialize: function () {
                this.fetch({
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
            },
            fetchError: function (error) {
            }


        });

        return ProjectsDdCollection;
    });