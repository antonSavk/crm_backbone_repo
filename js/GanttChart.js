define(["custom"],function(Custom){

    var create = function(chartContainerId){
        loadDefaultOptions();
        //gantt.clearAll();
        gantt.init(chartContainerId);
    };

    var parseProjects = function(jsonCollection){
        var array = Custom.convertProjectsCollectionForGantt(jsonCollection);
        if(array.data.length > 0) gantt.parse(array);
    };

    var parseTasks = function(jsonCollection){
        var array = Custom.convertTasksCollectionForGantt(jsonCollection);
        if(array.data.length > 0) gantt.parse(array);
    }

    var loadDefaultOptions = function(){
        gantt.config.scale_unit = "day";
        gantt.config.step = 1;
        gantt.config.date_scale = "%M, %d";
        gantt.templates.scale_cell_class = function(date){
            if(date.getDay() == 0 || date.getDay() == 6){
                return "weekend";
            }
        };
        gantt.templates.task_cell_class = function(item, date){
            if(date.getDay() == 0 || date.getDay() == 6){
                return "weekend";
            }
        }
    };
    return {
        create:create,
        parseProjects: parseProjects,
        parseTasks: parseTasks
    }
});