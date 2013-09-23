define([
    "text!templates/Applications/EditTemplate.html",
    "collections/Applications/ApplicationsCollection",
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, ApplicationsCollection, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Applications",

            initialize: function (options) {
                this.employeesCollection = new EmployeesCollection();
                this.employeesCollection.bind('reset', _.bind(this.render, this));
                this.jobPositionsCollection = new JobPositionsCollection();
                this.jobPositionsCollection.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.applicationsCollection = options.collection;
                this.applicationsCollection.bind('reset', _.bind(this.render, this));
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

                    var subject = $.trim($("#subject").val());
                    var name = $.trim($("#name").val());
                    var wemail = $.trim($("#wemail").val());
                    var phone = $.trim($("#phone").val());
                    var mobile = $.trim($("#mobile").val());
                    var wphones = {
                        phone: phone,
                        mobile: mobile
                    };

                    var relatedUser = {};
                    var relatedUserId = this.$("#relatedUser option:selected").val();
                    var objRelatedUser = this.employeesCollection.get(relatedUserId);
                    if (objRelatedUser) {
                        relatedUser.id = relatedUserId;
                        relatedUser.login = objRelatedUser.get('name');
                    }

                    var nextActionSt = $.trim($("#nextAction").val());
                    var nextAction = "";
                    if (nextActionSt) {
                        nextAction = new Date(Date.parse(nextActionSt)).toISOString();
                    }

                    var source = {};
                    var sourceName = $.trim($("#source").val());
                    source.name = sourceName;

                    var referredBy = $.trim($("#referredBy").val());

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

                    var expectedSalary = $.trim($("#expectedSalary").val());
                    var proposedSalary = $.trim($("#proposedSalary").val());
                    var tags = $.trim($("#tags").val()).split(',');
                    var otherInfo = $("#otherInfo").val();

                    currentModel.set({
                        subject: subject,
                        name: name,
                        wemail: wemail,
                        wphones: wphones,
                        relatedUser: relatedUser,
                        nextAction: nextAction,
                        source: source,
                        referredBy: referredBy,
                        department: department,
                        job: job,
                        expectedSalary: expectedSalary,
                        proposedSalary: proposedSalary,
                        tags: tags,
                        otherInfo: otherInfo
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

            ISODateToDate: function (ISODate) {
                var date = ISODate.split('T')[0].replace(/-/g, '/');
                return date;
            },

            render: function () {
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex == -1) {
                    this.$el.html();
                }
                else {
                    var currentModel = this.applicationsCollection.models[itemIndex];
                    currentModel.set({ nextAction: this.ISODateToDate(currentModel.get('nextAction')) }, { silent: true });
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), employeesCollection: this.employeesCollection, jobPositionsCollection: this.jobPositionsCollection, departmentsCollection: this.departmentsCollection }));
                }
                return this;
            }

        });
        return EditView;
    });