define(function () {
    var ProjectModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            projectname: 'emptyProject',
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
                uid: '00000',
                uname: 'emptyUser'
            },
            teams: {
                users: [],
                Teams: []
            },
            info: {
                StartDate: Date.now,
                EndDate: Date.now,
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