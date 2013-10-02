define([
    "custom",
    "models/ProjectModel",
    "models/TaskModel",
    "collections/Projects/ProjectsCollection",
    "collections/Tasks/TasksCollection",
    "localstorage"

],function(Custom, ProjectModel, TaskModel,ProjectsCollection,TasksCollection, LocalStorage){

    var tasksCollection, projectsCollection, eventId;

    var create = function(chartContainerId){
        loadDefaultOptions();
        gantt.init(chartContainerId);
        gantt.clearAll();
        tasksCollection = new TasksCollection();
        projectsCollection = new ProjectsCollection();
        if(!gantt.checkEvent("onAfterTaskUpdate")){
            eventId = gantt.attachEvent("onAfterTaskUpdate", onTaskUpdateHandler);
        }
    };

    var onTaskUpdateHandler = function(id,item){
        var updatedTask = gantt.getTask(id);
        var hash = LocalStorage.getFromLocalStorage('hash'),
            uid = LocalStorage.getFromLocalStorage('uid'),
            mid = 39;

        if(updatedTask.parent){
            var task = tasksCollection.get(id);
            var parentProjectId =  gantt.getTask(id).parent;
            var totalduration = 0;
            gantt.eachTask(function(task){
                totalduration += task.duration;
            }, parentProjectId);
            gantt.getTask(parentProjectId).duration  = totalduration;
            gantt.detachEvent(eventId);
            gantt.updateTask(parentProjectId);
            gantt.attachEvent("onAfterTaskUpdate");
            task.save({
                summary: item.text,
                extrainfo:{
                    StartDate:item.start_date,
                    EndDate:item.end_date
                },
                estimated:item.duration
            },{
                headers:{
                    uid: uid,
                    hash: hash,
                    mid: mid
                }
            });
        } else{
            var project = projectsCollection.get(id);
            project.save({
                summary: item.text,
                info:{
                    StartDate:item.start_date,
                    EndDate:item.end_date
                }
            },{
                headers:{
                    uid: uid,
                    hash: hash,
                    mid: mid
                }
            });
        }
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