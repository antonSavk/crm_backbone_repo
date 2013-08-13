// Filename: communication.js
define(["jquery", "localstorage"], function($, LocalStorage){
	var checkHash = function(callback){
		var url = "http://" + App.Server.ip + ":" + App.Server.port + "/checkHash",
			uid = LocalStorage.getFromLocalStorage('uid'),
			hash = LocalStorage.getFromLocalStorage('hash');
		
		if(!uid || !hash)
		{
			callback({result: {status: 4, description: 'No variables in local storage'}});
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
                callback(resp);
            },
            error: function(){
                callback({result: {status: 4, description: 'Error during checkHash request'}});
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
            success: function(resp){
            	if (resp.result.status == 0)
            	{
            		LocalStorage.saveToLocalStorage('uid', resp.data._id);
                	LocalStorage.saveToLocalStorage('hash', resp.hash);
            	}
            	
                callback(resp);
            },
            error: function(){
                callback({result: {status: 4, description: 'Error during checkLogin request'}});
            }
        });
	}
	
	return {
		checkHash: checkHash,
		checkLogin: checkLogin
	}
});