define([
    "text!templates/Employees/CreateTemplate.html",
    "collections/Employees/EmployeesCollection",
    "localstorage",
    "custom"
],
    function (CreateTemplate, EmployeesCollection, LocalStorage, Custom) {

        var CreateView = Backbone.View.extend({
            el: "#content-holder",
            contentType: "Employees",
            template: _.template(CreateTemplate),

            initialize: function (options) {
                this.bind('reset', _.bind(this.render, this));
                this.employeesCollection = options.collection;
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

            close: function () {
                this._modelBinder.unbind();
            },

            saveItem: function () {
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

                this.employeesCollection.create({
                    name: name,
                    wemail: wemail,
                    wphones: wphones,
                    officeLocation: officeLocation,
                    relatedUser: null,
                    visibility: null,
                    department: null,
                    job: null,
                    manager: null,
                    coach: null,
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
                this.$el.html(this.template());
                return this;
            }

        });

        return CreateView;
    });