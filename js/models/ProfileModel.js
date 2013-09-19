define( function () {
    var ProfileModel = Backbone.Model.extend({
        idAttribute:"_id",
        defaults:{
            profileName: '',
            profileDescription: ''
        },
        urlRoot: function(){
             return "http://" + App.Server.ip + ":" + App.Server.port + "/Profiles";
        }
    });

    return ProfileModel;
});