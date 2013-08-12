define(function(){
	var runApplication = function(data){
	    if(data.result.status != 0){
	        window.location.hash = "login";
	    } else{
	        window.location.hash = "";
	    }
	};
	
	return {
		runApplication: runApplication
	}
});