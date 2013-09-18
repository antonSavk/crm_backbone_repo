define([
    "text!templates/Profiles/CreateProfileTemplate.html"
],
    function (CreateProfileTemplate) {
        var CreateProfileView = Backbone.View.extend({
            el: '#content-holder',
            template: _.template(CreateProfileTemplate),
            initialize: function (options) {
                 this.render();
            },
            render: function () {
                this.$el.html(this.template());
                return this;
            }
        });

        return CreateProfileView;
    });