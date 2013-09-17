// Filename: communication.js
define(["localstorage"], function(LocalStorage){
	var checkHash = function(callback){
		var url = "http://" + App.Server.ip + ":" + App.Server.port + "/checkHash",
			uid = LocalStorage.getFromLocalStorage('uid'),
			hash = LocalStorage.getFromLocalStorage('hash');
		
		if(!uid || !hash)
		{
			callback(false);
			return
		}
		
        $.ajax({
            url: url,
            type:"POST",
            data:{
                uid: uid,
                hash: hash
            },
            success: function(resp){
            	if(resp.result.status == 0){
            		callback(true);
        	    }else
        	    	callback(false, resp.result.description);
                
            },
            error: function(){
                callback(false, "Server is unavailable...");
            }
        });
	},
	checkLogin = function(data, callback){
		var url = "http://" + App.Server.ip + ":" + App.Server.port + "/login";
        $.ajax({
            url: url,
            type:"POST",
            data:{
                ulogin: data.ulogin,
                upass: data.upass
            },
            success: function (resp) {
                 
            	if (resp.result.status == 0)
            	{
            		LocalStorage.saveToLocalStorage('uid', resp.data._id);
                	LocalStorage.saveToLocalStorage('hash', resp.hash);
                	callback(true);
            	}else
            		callback(false, resp.result.description);
            },
            error: function(){
                callback(false, "Server is unavailable...");
            }
        });
    }
    //checkLogin = function(callback) {
    //    $.ajax({
    //        url: "http://" + App.Server.ip + ":" + App.Server.port + "/account/authenticated",
    //        method: "GET",
    //        success: function() {
    //            return callback(true);
    //        },
    //        error: function(data) {
    //            return callback(false);
    //        }
    //    });
    //};
	
	return {
		checkHash: checkHash,
		checkLogin: checkLogin
	}
});