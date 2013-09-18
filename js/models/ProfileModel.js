define( function () {
    var ProfileModel = Backbone.Model.extend({
        idAttribute:"_id",

        urlRoot: function(){
             return "http://" + App.Server.ip + ":" + App.Server.port + "/Profiles";
        }
    });

    return ProfileModel;
});