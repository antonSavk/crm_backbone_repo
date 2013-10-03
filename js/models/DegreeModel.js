define(function () {
    var DegreeModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            name: ''
        },

        urlRoot: function () {
            return "http://" + App.Server.ip + ":" + App.Server.port + "/Degrees";
        }
    });

    return DegreeModel;
});