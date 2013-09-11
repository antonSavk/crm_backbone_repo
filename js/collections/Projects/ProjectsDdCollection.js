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
                console.log("ProjectForDd Collection Init");
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
                console.log("ProjectsForDd fetchSuccess");
                /*if (options.success) {
                    options.success(result);
                }*/
            },
            fetchError: function (error) {
                console.log('ProjectsForDd fetchError' + error);
            }


        });

        return ProjectsDdCollection;
    });