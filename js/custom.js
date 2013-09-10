define(['libs/date.format'],function(dateformat){
	var runApplication = function(success, description){
		if (!Backbone.history.fragment)
			Backbone.history.start({silent: true});
		if(success)
	    {
			var url = (App.requestedURL == null) ? Backbone.history.fragment : App.requestedURL;
			if ((url == "") || (url == "login")) url = 'home';
			
			Backbone.history.fragment = "";
			Backbone.history.navigate(url, {trigger:true});
	    }else
	    {
	    	//console.log(description);
	    	if (App.requestedURL == null)
	    		App.requestedURL = Backbone.history.fragment; 
	    	
	    	Backbone.history.fragment = "";
	    	Backbone.history.navigate("login", {trigger:true});
	    }
		
	};
	
	var changeItemIndex = function(event){
		event.preventDefault();
    	var shift = $(event.target).attr('data-shift'),
    		itemIndex = getCurrentII(),
    		viewType = getCurrentVT();
    	
    	switch(shift){
    		case "left": {
    			setCurrentII(parseInt(itemIndex) - 1);
    			break;
    		}
    		case "right": {
    			setCurrentII(parseInt(itemIndex) + 1);
    			break;
    		}
    	}

    	itemIndex = getCurrentII();
    	
    	if (this.actionType == 'Content')
    	{
    		window.location.hash = "#home/content-" + this.contentType + "/"+viewType+"/"+itemIndex;
    	}else
    	if (this.actionType == 'Edit')
    	{
    		window.location.hash = "#home/action-" + this.contentType + "/"+this.actionType+"/"+itemIndex;
    	}
	};
	
	var changeContentViewType = function(event){
    	event.preventDefault();
    	var viewtype = $(event.target).attr('data-view-type'),
    		url = "#home/content-" + this.contentType + "/"+viewtype;
    	
    	var itemIndex = getCurrentII();
    	
    	if (viewtype == "form") url+="/"+itemIndex; 
    	
    	Backbone.history.navigate(url, {trigger: true});
    };
	
    var getCurrentII = function(){
    	if (App.currentItemIndex == null)
    	{
    		App.currentItemIndex = 1;
    		return App.currentItemIndex;
    	}
    	
    	var testIndex = new RegExp(/^[1-9]{1}[0-9]*$/), itemIndex;
    	if (testIndex.test(App.currentItemIndex) == false) 
    	{
    		App.currentItemIndex = 1; 
    		itemIndex = 1;
    	}else
    	{
    		itemIndex = App.currentItemIndex;
    	}
    	return itemIndex;
    };
    
    var setCurrentII = function(index){
    	var testIndex = new RegExp(/^[1-9]{1}[0-9]*$/),
    		contentLength = getCurrentCL();
  	  
  	  	if (testIndex.test(index) == false)
  	  		index = 1;
  	  	if (index > contentLength) index = contentLength; 
    	App.currentItemIndex = index;
    	
    	return index;
    };
    
    var getCurrentVT = function(){
    	if (App.currentViewType == null) 
    	{
    		App.currentViewType = "list";
    		return App.currentViewType;
    	}	
    	
    	var viewVariants = ["list", "form", "thumbnails", "gantt"], viewType;
  	  
  	  	if ($.inArray(App.currentViewType, viewVariants) == -1) 
  	  	{
  	  		App.currentViewType = "list";
  	  		viewType = "list";
  	  	}else
  	  	{
  	  		viewType = App.currentViewType;
  	  	}
  	  	
    	return viewType;
    };
    
    var setCurrentVT = function(viewType){
    	var viewVariants = ["list", "form", "thumbnails", "gantt"];
    	  
  	  	if ($.inArray(viewType, viewVariants) != -1) 
  	  	{
  	  		App.currentViewType = viewType;
  	  	}else
  	  	{
  	  		viewType = "list"; 
  	  		App.currentViewType = viewType;
  	  	}
  	  	
  	  	return viewType;
    };
    
    var getCurrentCL = function(){
    	if (App.currentContentLength == null)
    	{
    		App.currentContentLength = 0;
    		return App.currentContentLength;
    	}
    	
    	var testLength = new RegExp(/^[0-9]{1}[0-9]*$/), contentLength;
    	if (testLength.test(App.currentContentLength) == false)
    	{
    		App.currentContentLength = 0; 
    		contentLength = 0;
    	}else
    	{
    		contentLength = App.currentContentLength;
    	}
    	return contentLength;
    };
    
    var setCurrentCL = function(length){
    	var testLength = new RegExp(/^[0-9]{1}[0-9]*$/);
  	  
  	  	if (testLength.test(length) == false)
  	  		length = 0;
    	App.currentContentLength = length;
    	
    	return length;
    };

    var convertProjectsForGantt = function (data){
        var projects = [];
        data.forEach(function(project){
            projects.push({
                'id':project.id,
                'projectname':project.projectname,
                'projectmanager':project.projectmanager.uname || 'No name',
                'customer':project.customer || 'Unknown',
                'StartDate': new Date(project.info.StartDate),
                'EndDate': new Date(),
                'plannedtime':  calculateHours(new Date(project.info.StartDate), new Date()),
                'timespent':  calculateHours(new Date(project.info.StartDate), new Date()),
                'progress': '%',
                'status': 'In Progress',
                'taskCount': project.task.tasks.length
            });
        });
        return projects;
    };

    var calculateHours = function (startDate, endDate){
        var hours = 0;
        if(!startDate || !endDate){
            throw new Error("CalculateTaskHours: Start or end date is undefined");
        }
        if(startDate > endDate){
            throw new Error("CalculateTaskHours: Start date can not be greater that end date");
        }
        try {
            var delta = new Date(endDate) - new Date(startDate);
            hours = Math.floor(((delta/1000)/60)/60);
        } catch(error){
            throw new Error(error.message);
        }
        return hours;
    };

    var convertTasksForGantt = function (data){
        var tasks = [];
        data.forEach(function(project){
            if(project.task.tasks.length > 0){
                project.task.tasks.forEach(function(task){
                    tasks.push({
                        'summary':task.summary,
                        'projectname':project.projectname  || 'Unknown project',
                        'assignedto':task.assignedto.uname || 'Unknown name',
                        'stage':'Unknown Stage',
                        'StartDate': dateFormat(new Date(task.extrainfo.StartDate), "dd/mm/yy hh:mm:ss"),
                        'EndDate': dateFormat(new Date(task.extrainfo.EndDate), "dd/mm/yy hh:mm:ss"),
                        'progress':'Unknown progress'
                    });
                });
            }

        });
        return tasks;
    };

    function applyDefaultSettings(chartControl){
        chartControl.setImagePath("/crm_backbone_repo/images/");
        chartControl.setEditable(false);
        chartControl.showTreePanel(true);
        chartControl.showContextMenu(false);
        chartControl.showDescTask(true,'d,s-f');
        chartControl.showDescProject(true,'n,d');
    }

    function createGanttChart(data, withTasks){
        var ganttChartControl = new GanttChart();
        applyDefaultSettings(ganttChartControl);
        var projectArray = [];
        //create gantt chart from projects and descending tasks
        if(withTasks){
            projectArray = convertTasksForGantt(data);
            projectArray.forEach(function(project){
                if(project.task.tasks.length > 0){
                    //get the 'Date' portion of a Date object(without time)
                    var startDate = new Date(project.info.StartDate);
                    var newProject = new GanttProjectInfo(project._id, project.projectname, startDate);
                    project.task.tasks.forEach(function(task){
                        var hourCount = calculateHours(task.extrainfo.StartDate, task.extrainfo.EndDate);
                        var percentCompleted = Math.floor(Math.random()*100+1);
                        var parentTask = new GanttTaskInfo(task._id, task.summary, new Date(task.extrainfo.StartDate), hourCount, percentCompleted, "");//Predecessor and this task will be joined by dependency line in the Gantt Chart.
                        newProject.addTask(parentTask);
                    });
                    ganttChartControl.addProject(newProject);
                }

            });
        }
        //create gantt chart from only projects
        else {
            var newProject = createProjectForGantt(data);
            ganttChartControl.showDescProject(false,'n,d');
            ganttChartControl.addProject(newProject);
        }

        return ganttChartControl;
    };


    function createProjectForGantt(data){
        var projectArray = convertProjectsForGantt(data);
        //get date array
        var arr = $.map(projectArray,function(val){
            return val.StartDate;
        });
        // and find the minimum date
        var date = findMinDate(arr);

        var newProject = new GanttProjectInfo(1, 'Guntt View', date);
        projectArray.forEach(function(project){
            var hourCount = calculateHours(project.StartDate,project.EndDate);
            var percentCompleted = Math.floor(Math.random()*100+1);
            var parentTask = new GanttTaskInfo(project.id, project.projectname, project.StartDate, hourCount, percentCompleted,"");
            newProject.addTask(parentTask);
        });
        return newProject;
    }

    function findMinDate(dateArray){
        return _.min(dateArray);
        /*var minDate = dateArray[0];
        dateArray.forEach(function(date){
            if(minDate>date){
                minDate = date;
            }
        });
        return new Date(minDate);*/
    }
    
	return {
        createGanttChart : createGanttChart,
        calculateHours : calculateHours,
        convertTasksForGantt: convertTasksForGantt,
        convertProjectsForGantt:convertProjectsForGantt,
		runApplication: runApplication,
		changeItemIndex: changeItemIndex,
		changeContentViewType: changeContentViewType,
		getCurrentII: getCurrentII,
		setCurrentII: setCurrentII,
		getCurrentVT: getCurrentVT,
		setCurrentVT: setCurrentVT,
		getCurrentCL: getCurrentCL,
		setCurrentCL: setCurrentCL
	};
});