define(function () {
    var taskPriority = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            _id: null,
            priority: ""
        },

        urlRoot: function () {
            return "http://" + App.Server.ip + ":" + App.Server.port + "/Priority";
        }
    });

    return taskPriority;
});