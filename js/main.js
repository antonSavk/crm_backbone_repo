var App = App ||
{
    Server: {
        ip: "192.168.88.45",
        port: "8088"
    },
    ID: {
        topMenu: "topmenu-holder",
        leftMenu: "leftmenu-holder",
        pageHolder: "body",
        wrapper: "#wrapper",
        content:"content",
        loginForm: "loginForm",
        contentHolder: "#content-holder",
        viewPanel: "top-bar",
        leftBtn: "leftBtn",
        rightBtn: "rightBtn",
        listBtn: "listBtn",
        thumbBtn: "thumbBtn",
        ganttBtn: "ganttBtn",
        ganttViewHolder: "GanttViewHolder",
        formBtn: "formBtn",
        userPanel: "loginPanel",
        changeCVClass: "changeContentView",
        changeCIClass: "changeContentIndex",
        createBtn:"#top-bar-createBtn",
        discardBtn:"#top-bar-discardBtn",
        saveBtn:"#top-bar-saveBtn",
        saveDiscardHolder:"#saveDiscardHolder",
        createBtnHolder:"#createBtnHolder",
        projectForm:"#createProjectForm",
        privacyDD:"#privacyDD",
        managerSelect: "#projectManagerDD"
    },
    requestedURL: null
};

require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    templates: '../templates',
    text: 'libs/backbone/text',
    socketIO: 'libs/SocketIO/socket.io',
    less: 'libs/less/less-1.4.1.min',
    localstorage: 'localstorage'
  }
});

require(['app'], function(app){
    app.initialize();
});
