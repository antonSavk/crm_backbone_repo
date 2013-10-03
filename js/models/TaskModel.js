define(function () {
    var TaskModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            summary: '',
            project: {
                pId: '',
                projectName: ''
            },
            assignedto: {
                uid: '00000',
                uname: 'emptyUser'
            },
            deadline: null,
            tags: [],
            description: '',
            extrainfo: {
                priority: 'Medium',
                sequence: 0,
                customer: {
                    id: '',
                    name: ''
                },
                StartDate: null,
                EndDate: null
            },
            workflow: {
                name: 'Analysis',
                status: 'New'
            },
            color: '#4d5a75',
            estimated: 0,
            loged: 0,
            remaining: 0,
            progress: 0
        },

        urlRoot: function () {
            return "http://" + App.Server.ip + ":" + App.Server.port + "/Tasks";
        }
    });

    return TaskModel;
});