define(['backbone'],function(Backbone){
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
	    	console.log(description);
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
    
	return {
		runApplication: runApplication,
		changeItemIndex: changeItemIndex,
		changeContentViewType: changeContentViewType,
		getCurrentII: getCurrentII,
		setCurrentII: setCurrentII,
		getCurrentVT: getCurrentVT,
		setCurrentVT: setCurrentVT,
		getCurrentCL: getCurrentCL,
		setCurrentCL: setCurrentCL
	}
});