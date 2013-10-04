﻿define([
    "text!templates/Applications/EditTemplate.html",
    "collections/Applications/ApplicationsCollection",
    "collections/Employees/EmployeesCollection",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "collections/Degrees/DegreesCollection",
    "collections/SourceOfApplicants/SourceOfApplicantsCollection",
    "collections/Workflows/WorkflowsCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, ApplicationsCollection, EmployeesCollection, JobPositionsCollection, DepartmentsCollection, DegreesCollection, SourceOfApplicantsCollection, WorkflowsCollection, LocalStorage, Custom) {

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
                this.degreesCollection = new DegreesCollection();
                this.degreesCollection.bind('reset', _.bind(this.render, this));
                this.sourceOfApplicantsCollection = new SourceOfApplicantsCollection();
                this.sourceOfApplicantsCollection.bind('reset', _.bind(this.render, this));
                this.workflowsCollection = new WorkflowsCollection({ id: 'application' });
                this.workflowsCollection.bind('reset', _.bind(this.render, this));
                this.applicationsCollection = options.collection;
                this.applicationsCollection.bind('reset', _.bind(this.render, this));
                //this.render();
            },

            events: {
                "click #tabList a": "switchTab",
                "click .breadcrumb a, #refuse": "changeWorkflow"
            },

            changeWorkflow: function (e) {
                var hash = LocalStorage.getFromLocalStorage('hash'),
                       uid = LocalStorage.getFromLocalStorage('uid'),
                       mid = 39;
                var model = {};
                var name = '', status = '';
                if ($(e.target).hasClass("applicationWorkflowLabel")) {
                    var breadcrumb = $(e.target).closest('li');
                    var a = breadcrumb.siblings().find("a");
                    if (a.hasClass("active")) {
                        a.removeClass("active");
                    }
                    breadcrumb.find("a").addClass("active");
                    name = breadcrumb.data("name");
                    status = breadcrumb.data("status");
                }
                else {
                    var workflow = this.workflowsCollection.models[this.workflowsCollection.models.length - 1];
                    console.log(workflow);
                    name = workflow.get('name');
                    status = workflow.get('status');
                }
                model = this.collection.get($(e.target).closest(".formHeader").siblings().find("form").data("id"));
                var ob = {
                    workflow: {
                        name: name,
                        status: status
                    }
                };

                model.set(ob);
                model.save({}, {
                    headers: {
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }

                });

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
                var self = this;
                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

                    var subject = $.trim($("#subject").val());
                    var first = $.trim($("#first").val());
                    var last = $.trim($("#last").val());
                    var name = {
                        first: first,
                        last: last
                    };
                    var wemail = $.trim($("#wemail").val());
                    var phone = $.trim($("#phone").val());
                    var mobile = $.trim($("#mobile").val());
                    var wphones = {
                        phone: phone,
                        mobile: mobile
                    };

                    var degreeId = this.$("#degree option:selected").val();
                    var degree = {
                        id: degreeId,
                        name: degreeId
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

                    var sourceId = this.$("#source option:selected").val();
                    var source = {
                        id: sourceId,
                        name: sourceId
                    };

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
                        degree: degree,
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
                        },
                        wait: true,
                        success: function (model) {
                            Backbone.history.navigate("home/content-" + self.contentType, { trigger: true });
                        },
                        error: function () {
                            Backbone.history.navigate("home", { trigger: true });
                        }
                    });
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
                    //currentModel.on('change', this.render, this);
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), employeesCollection: this.employeesCollection, jobPositionsCollection: this.jobPositionsCollection, departmentsCollection: this.departmentsCollection, degreesCollection: this.degreesCollection, sourceOfApplicantsCollection: this.sourceOfApplicantsCollection }));
                    var workflows = this.workflowsCollection.models;

                    _.each(workflows, function (workflow, index) {
                        if (index < workflows.length - 1) {
                            $(".breadcrumb").append("<li data-index='" + index + "' data-status='" + workflow.get('status') + "' data-name='" + workflow.get('name') + "' data-id='" + workflow.get('_id') + "'><a class='applicationWorkflowLabel'>" + workflow.get('name') + "</a></li>");
                        }
                    });

                    _.each(workflows, function (workflow, i) {
                        var breadcrumb = this.$(".breadcrumb li").eq(i);
                        if (currentModel.get("workflow").name === breadcrumb.data("name")) {
                            breadcrumb.find("a").addClass("active");
                        }
                    }, this);
                }
                return this;
            }

        });
        return EditView;
    });