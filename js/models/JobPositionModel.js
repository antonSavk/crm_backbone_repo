define(function () {
    var JobPositionModel = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: {
            name: "New Job Position",
            expectedRecruitment: 0,
            interviewForm: {
                id: "",
                name: ""
            },
            department: {
                id: "",
                name: ""
            },
            description: "",
            requirements: "",
            workflow: {
                name: 'No Recruitment',
                status: 'New' 
            }
        },

        urlRoot: function () {
            return "http://" + App.Server.ip + ":" + App.Server.port + "/JobPosition";
        }
    });

    return JobPositionModel;
});