define([
    "text!templates/JobPositions/EditTemplate.html",
    "collections/JobPositions/JobPositionsCollection",
    "collections/Departments/DepartmentsCollection",
    "localstorage",
    "custom"
],
    function (EditTemplate, JobPositionsCollection, DepartmentsCollection, LocalStorage, Custom) {

        var EditView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Job Positions",

            initialize: function (options) {
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.jobPositionsCollection = options.collection;
                this.jobPositionsCollection.bind('reset', _.bind(this.render, this));

                this.render();
            },

            saveItem: function () {

                var itemIndex = Custom.getCurrentII() - 1;

                if (itemIndex != -1) {
                    var currentModel = this.collection.models[itemIndex];

                    var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

                    var name = $.trim($("#name").val());

                    var expectedRecruitment = $.trim($("#expectedRecruitment").val());

                    var description = $.trim($("#description").val());

                    var requirements = $.trim($("#requirements").val());

                    var departmentId = this.$("#department option:selected").val();
                    var objDepartment = this.departmentsCollection.get(departmentId);
                    var department = {};
                    if (objDepartment) {
                        department.name = objDepartment.get('departmentName');
                        department.id = departmentId;
                    }

                    currentModel.set({
                        name: name,
                        expectedRecruitment: expectedRecruitment,
                        description: description,
                        requirements: requirements,
                        department: department
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
                    var currentModel = this.jobPositionsCollection.models[itemIndex];
                    this.$el.html(_.template(EditTemplate, { model: currentModel.toJSON(), departmentsCollection: this.departmentsCollection }));
                }

                return this;
            }

        });

        return EditView;
    });