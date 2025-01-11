const electron = require("electron");
const { ipcRenderer } = electron;



ipcRenderer.on("todo:addItem", (e, data) => {
    console.log(data);
});