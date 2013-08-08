define(function(){
	return {
		socket: {},
		initConnection: function(){
			this.socket = App.Libs.IO.connect('http://'.concat(App.Server.ip,':',App.Server.port));
			this.socket.on('connect', function(){
				console.log('Server connected...');
			});
			
			this.socket.on('disconnect', function(){
				console.log('Server disconnected...');
			});

			this.socket.on('responseCheckHash', function(response){
            	switch(response.result.status)
            	{
            		/*case "0":
            		{
            			console.log('checkHash OK');
            			App.Modules.UI.initUser(response.data._id, response.data.uname);
            			App.Modules.UI.initMainPage();
            			break;
            		}
            		default:
            		{
            			console.log('checkHash BAD');
            			App.Modules.UI.initLoginPage();
            			break;
            		}*/
            	}
            });

		},

		checkHash: function(){	
			var hash = App.Modules.LocalStorage.getFromLocalStorage("hash"),
				_id = App.Modules.LocalStorage.getFromLocalStorage("_id");
			
			if ((hash == false) || (_id == false)) 
			{

				return;
			}
			this.socket.emit('checkHash', {"hash": hash, "uid": _id});
		}

	}
});