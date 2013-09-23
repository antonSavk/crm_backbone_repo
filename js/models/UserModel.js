define(function () {
    var UserModel = Backbone.Model.extend({
        idAttribute: "_id",
    });

    return UserModel;
});