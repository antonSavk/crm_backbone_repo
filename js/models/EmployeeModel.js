define(function () {
    var EmployeeModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            name: '',
            tags: [],
            waddress: {
                custommerId: '',
                custommerName: ''
            },
            wemail: '',
            wphones: {
                mobile: '',
                phone: ''
            },
            officeLocation: '',
            relatedUser: {
                userId: '',
                userName: ''
            },
            visibility: false,
            department: {
                departmentId: '',
                departmentName: ''
            },
            job: {
                jobPositionId: '',
                jobPositionName: ''
            },
            manager: {
                employeeId: '',
                employeeName: ''
            },
            coach: {
                employeeId: '',
                employeeName: ''
            },
            nationality: '',
            identNo: 0,
            passportNo: 0,
            bankAccountNo: '',
            otherId: '',
            homeAddress: {
                custommerId: '',
                custommerName: ''
            },
            dateBirth: '',
            product: '',
            analyticJournal: '',
            active: true
        },

        urlRoot: function () {
            return "http://" + App.Server.ip + ":" + App.Server.port + "/Employees";
        }
    });

    return EmployeeModel;
});