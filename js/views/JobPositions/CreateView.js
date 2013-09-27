define([
    "text!templates/JobPositions/CreateTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "models/JobPositionModel",
    "localstorage",
    "custom"
],
    function (CreateTemplate, DepartmentsCollection, JobPositionModel, LocalStorage, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Job Positions",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                //this.bind('reset', _.bind(this.render, this));
                //    this.jobPositionsCollection = options.collection;
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {

                var self = this;

                var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

                var jobPositionModel = new JobPositionModel();

                var name = $.trim($("#name").val());

                var expectedRecruitment = parseInt($.trim($("#expectedRecruitment").val()));

                var description = $.trim($("#description").val());

                var requirements = $.trim($("#requirements").val());

                var departmentId = this.$("#department option:selected").val();
                var objDepartment = this.departmentsCollection.get(departmentId);
                var department = {};
                if (objDepartment) {
                    department.name = objDepartment.get('departmentName');
                    department.id = departmentId;
                }
                console.log(department);

                jobPositionModel.save({
                    name: name,
                    expectedRecruitment: expectedRecruitment,
                    description: description,
                    requirements: requirements,
                    department: department
                },
                {
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
            },

            render: function () {
                this.$el.html(this.template({ departmentsCollection: this.departmentsCollection }));
                return this;
            }

        });

        return CreateView;
    });