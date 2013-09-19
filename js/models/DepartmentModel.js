define(function () {
    var departmentModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            departmentName: 'emptyDepartment',
            parentDepartment: {
                departmentId: null,
                departmentName: null
            },
            departmentManager: {
                uid: null,
                uname: ''
            }
        },

        urlRoot: function () {
            return "http://" + App.Server.ip + ":" + App.Server.port + "/Departments";
        }
    });

    return departmentModel;
});