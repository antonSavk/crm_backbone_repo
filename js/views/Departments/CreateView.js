define([
    "text!templates/Departments/CreateTemplate.html",
    "collections/Departments/DepartmentsCollection",
    "collections/Customers/AccountsDdCollection",
    "models/DepartmentModel",
    "localstorage",
    "custom"
],
    function (CreateTemplate, DepartmentsCollection, AccountsDdCollection, DepartmentModel, LocalStorage, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Departments",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.accountDdCollection = new AccountsDdCollection();
                this.accountDdCollection.bind('reset', _.bind(this.render, this));
                this.bind('reset', _.bind(this.render, this));
                this.departmentsCollection = options.collection;
                this.render();
            },

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {

                var hash = LocalStorage.getFromLocalStorage('hash'),
        			uid = LocalStorage.getFromLocalStorage('uid'),
        			mid = 39;

                var departmentModel = new DepartmentModel();

                var departmentName = $.trim($("#departmentName").val());

                var departmentId = this.$("#parentDepartment option:selected").val();
                var objParentDepartment = this.departmentsCollection.get(departmentId);
                var parentDepartment = {};
                if (objParentDepartment) {
                    parentDepartment.departmentName = objParentDepartment.get('departmentName');
                    parentDepartment.departmentId = departmentId;
                }
                var managerId = this.$("#departmentManager option:selected").val();
                var objDepartmentManager = this.accountDdCollection.get(managerId);
                var departmentManager = {};
                if (objDepartmentManager) {
                    departmentManager.uname = objDepartmentManager.get('name').first + " " + objDepartmentManager.get('name').last;
                    departmentManager.uid = managerId;
                }

                departmentModel.save({
                    departmentName: departmentName,
                    parentDepartment: parentDepartment,
                    departmentManager: departmentManager
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
                this.$el.html(this.template({ accountDdCollection: this.accountDdCollection, departmentsCollection: this.departmentsCollection }));
                return this;
            }

        });

        return CreateView;
    });