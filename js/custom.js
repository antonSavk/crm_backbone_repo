define(['backbone'],function(Backbone){
	var runApplication = function(success, description){
		
		if(success)
	    {
			var url = (App.requestedURL == null) ? Backbone.history.fragment : App.requestedURL;
			if ((url == "") || (url == "login")) url = 'home';
			Backbone.history.navigate(url, {trigger: true});
	    }else
	    {
	    	
	    	console.log(description);
	    	if (App.requestedURL == null)
	    		App.requestedURL = Backbone.history.fragment; 
	    	Backbone.history.navigate('login', {trigger: true});
	    }
		
		
	};
	
	var changeContentIndex = function(event){
		debugger
		event.preventDefault();
    	var shift = $(event.target).attr('data-shift');
    	
    	switch(shift){
    		case "left": {
    			this.currentItem = parseInt(this.currentItem) - 1;
    			if (this.currentItem <= 0) this.currentItem = 1;
    			break;
    		}
    		case "right": {
    			this.currentItem = parseInt(this.currentItem) + 1;
    			debugger
    			//var length = this.getCollectionLength();
    			debugger
    			
    			break;
    		}
    	}
    	
    	window.location.hash = "#home/" + this.contentType + "/"+this.viewtype+"/"+this.currentItem;
	};
	
	var changeContentViewType = function(event){
    	event.preventDefault();
    	var viewtype = $(event.target).attr('data-view-type');
    	
    	window.location.hash = "#home/" + this.contentType + "/"+viewtype+"/"+this.currentItem;
    };
	
	return {
		runApplication: runApplication,
		changeContentIndex: changeContentIndex,
		changeContentViewType: changeContentViewType
	}
});