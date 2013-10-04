define(function () {
    var ProjectModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            projectname: 'Project 1',
            task: {
                avaliable: false,
                tasks: []
            },
            privacy: 'All Users',
            customer: {
                id: '',
                type: '',
                name: ''
            },
            projectmanager: {
                uid: '',
                uname: ''
            },
            teams: {
                users: [],
                Teams: []
            },
            info: {
                StartDate: null,
                duration: 0,
                EndDate:  null,
                sequence: 0 ,
                parent: null
            },
            workflow: {
                name: 'New',
                status: 'New'
            },
            estimated: 0,
            logged: 0,
            remaining: 0,
            progress: 0
        },

        urlRoot: function () {
            return "http://" + App.Server.ip + ":" + App.Server.port + "/Projects";
        }
    });

    return ProjectModel;
});