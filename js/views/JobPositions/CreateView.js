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
                    this.bind('reset', _.bind(this.render, this));
                //    this.jobPositionsCollection = options.collection;
                this.departmentsCollection = new DepartmentsCollection();
                this.departmentsCollection.bind('reset', _.bind(this.render, this));
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {

                var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

                var jobPositionModel = new JobPositionModel();

                var name = $.trim($("#name").val());

                var expectedRecruitment = parseInt($.trim($("#expectedRecruitment").val()));

                var description = $.trim($("#description").val());

                var requirements = $.trim($("#requirements").val());

                jobPositionModel.save({
                    name: name,
                    expectedRecruitment: expectedRecruitment,
                    description: description,
                    requirements: requirements
                },
                {
                    headers: {
                        uid: uid,
                        hash: hash,
                        mid: mid
                    }
                });

                Backbone.history.navigate("home/content-" + this.contentType, { trigger: true });

            },

            render: function () {
                this.$el.html(this.template({ departmentsCollection: this.departmentsCollection }));
                return this;
            }

        });

        return CreateView;
    });