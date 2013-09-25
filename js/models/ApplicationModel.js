﻿define(function () {
    var ApplicationModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            isEmployee: false,
            subject: '',
            name: '',
            tags: [],
            wemail: '',
            wphones: {
                mobile: '',
                phone: ''
            },
            relatedUser: {
                id: '',
                login: ''
            },
            department: {
                departmentId: '',
                departmentName: ''
            },
            job: {
                jobPositionId: '',
                jobPositionName: ''
            },
            nextAction: null,
            source: {
                id: '',
                name: ''
            },
            referredBy: '',
            expectedSalary: 0,
            proposedSalary: 0,
            otherInfo: '',
            workflow: {
                name: 'Initial Qualification',
                status: 'New'
            },
        },

        urlRoot: function () {
            return "http://" + App.Server.ip + ":" + App.Server.port + "/Applications";
        }
    });

    return ApplicationModel;
});