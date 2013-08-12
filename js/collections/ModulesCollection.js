define([
    'jquery',
    'underscore',
    'backbone',
    'models/ModulesModel'
], function($, _, Backbone,ModulesModel){
    var ModulesCollection = Backbone.Collection.extend({
        url: 'http://192.168.88.109:8088/getModules',
        initialize: function(){

        },
        model: ModulesModel

    });

    return ModulesCollection;

});