define([
    "text!templates/Employees/EditTemplate.html",
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, AccountsDdCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",

            initialize: function (options) {
                this.jobPositionsCollection = new JobPositionsCollection();
                this.jobPositionsCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.accountsDdCollection = new AccountsDdCollection();
                this.accountsDdCollection.bind('reset', _.bind(this.render, this));
                this.employeesCollection = options.collection;
                this.employeesCollection.bind('reset', _.bind(this.render, this));

                this.render();
            },

            events: {
                "click #tabList a": "switchTab"
            },

            switchTab: function (e) {
                e.preventDefault();
                var link = this.$("#tabList a");
                if (link.hasClass("selected")) {
                    link.removeClass("selected");
                }
                var index = link.index($(e.target).addClass("selected"));
                this.$(".tab").hide().eq(index).show();
            },

            saveItem: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

                    var name = $("#name").val();
                    if ($.trim(name) == "") {
                        name = "New Employee";
                    }

                    var wemail = $("#wemail").val();
                    if ($.trim(wemail) == "") {
                        wemail = null;
                    }

                    var phone = $("#phone").val();
                    var mobile = $("#mobile").val();
                    var wphones = {};
                    if ($.trim(phone) == "" || $.trim(mobile) == "") {
                        wphones = null;
                    }
                    else {
                        wphones.phone = phone;
                        wphones.mobile = mobile;
                    }

                    var officeLocation = $("#officeLocation").val();
                    if ($.trim(officeLocation) == "") {
                        officeLocation = null;
                    }

                    var departmentId = this.$("#department option:selected").val();
                    var objDepartment = this.departmentsCollection.get(departmentId);
                    var department = {};
                    if (objDepartment) {
                        department.departmentName = objDepartment.get('departmentName');
                        department.departmentId = departmentId;
                    }

                    var jobId = this.$("#job option:selected").val();
                    var objJob = this.jobPositionsCollection.get(jobId);
                    var job = {};
                    if (objJob) {
                        job.jobPositionId = jobId;
                        job.jobPositionName = objJob.get('name');
                    }
                    console.log(job);

                    var managerId = this.$("#manager option:selected").val();
                    var objManager = this.accountsDdCollection.get(managerId);
                    var manager = {};
                    if (objManager) {
                        manager.employeeName = objManager.get('name').first + " " + objManager.get('name').last;
                        manager.employeeId = managerId;
                    }

                    var coachId = this.$("#coach option:selected").val();
                    var objCoach = this.accountsDdCollection.get(coachId);
                    var coach = {};
                    if (objCoach) {
                        coach.employeeName = objCoach.get('name').first + " " + objCoach.get('name').last;
                        coach.employeeId = coachId;
                    }

                    var identNo = parseInt($.trim($("#identNo").val()));
                    if (!identNo) {
                        identNo = null;
                    }

                    var passportNo = parseInt($.trim($("#passportNo").val()));
                    if (!passportNo) {
                        passportNo = null;
                    }

                    var otherId = parseInt($.trim($("#otherId").val()));
                    if (!otherId) {
                        otherId = null;
                    }

                    var dateBirthSt = $.trim($("#dateBirth").val());
                    var dateBirth = "";
                    if (!dateBirthSt) {
                        dateBirth = null;
                    }
                    else {
                        dateBirth = new Date(Date.parse(dateBirthSt)).toISOString();
                    }

                    var active = false;
                    if ($("#active:checked")) active = true;

                    currentModel.set({
                        name: name,
                        wemail: wemail,
                        wphones: wphones,
                        officeLocation: officeLocation,
                        relatedUser: null,
                        visibility: null,
                        department: department,
                        job: job,
                        manager: manager,
                        coach: coach,
                        nationality: null,
                        identNo: identNo,
                        passportNo: passportNo,
                        bankAccountNo: null,
                        otherId: otherId,
                        gender: null,
                        maritalStatus: null,
                        homeAddress: null,
                        dateBirth: dateBirth,
                        active: active
                    });

                    currentModel.save({}, {
                        headers: {
                            uid: uid,
                            hash: hash,
                            mid: mid
                        }
                    });

                    Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });
                }

            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                } else {
                    var currentModel = this.employeesCollection.models[itemIndex];
                    currentModel.set({ dateBirth: currentModel.get('dateBirth').split('T')[0].replace(/-/g, '/') }, { silent: true });
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), departmentsCollection: this.departmentsCollection, jobPositionsCollection: this.jobPositionsCollection, accountsDdCollection: this.accountsDdCollection }));
                }

                return this;
            }

        });

        return EditView;
    });