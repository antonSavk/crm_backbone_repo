define(function () {
    var SourceOfApplicantsModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            name:'New'
        },

        urlRoot: function () {
            return "http://" + App.Server.ip + ":" + App.Server.port + "/SourcesOfApplicants";
        }
    });

    return SourceOfApplicantsModel;
});