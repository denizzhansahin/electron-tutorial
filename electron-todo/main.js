const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow, addWindow;
let todoList = []


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: true,//pencere kenarlarını açma
    })//pencere oluştur
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,//file://main.html
    }))

    mainWindow.setResizable(false);//boyutlandırma


    //menu ekleme
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate1);
    Menu.setApplicationMenu(mainMenu);//uygulamayı set et

    //Yeni pencere
    ipcMain.on("key:newWindow", (err, data) => {
        createWindow();
    })

    mainWindow.on('closed', () => {
        app.quit();//uygulamayı kapat
    })


    ipcMain.on("newTodo:close", (err, data) => {
        addWindow.close();
        addWindow = null;
    })

    ipcMain.on("newTodo:save", (err, data) => {
        if (data) {
            let todo = {
                id: todoList.length + 1,
                text: data,
            }
            todoList.push(todo);
            mainWindow.webContents.send("todo:addItem", todo); // Send todoList to mainWindow
        }
        
        //console.log(todoList);
    })
})


const mainMenuTemplate1 = [{
    label: 'Dosya',
    submenu: [{
        label: "Yeni Todo Ekle"
    },
    {
        label: "Tümünü Sil",
    },
    {
        label: "Çıkış",
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',//kısayol
        role: "quit",//bir işlem rol atama
    }]
}
]



if (process.platform == 'linux') {//aslında macos için darwin
    mainMenuTemplate1.unshift({
        label: app.getName(),//isim getir
        role: 'TODO',//ön tanımlı
    });//başa ekler
}

if (process.env.NODE_ENV !== 'production') { //geliştirme modunda
    mainMenuTemplate1.push(
        {
            label: 'Dev Tools',
            submenu: [
                {
                    label: "Geliştirici Penceresi Aç",
                    click(item, focusWindow) {//nerede açılacağını belirler
                        focusWindow.toggleDevTools();
                    }
                },
                {
                    label: "Yenile",
                    role: "reload"
                }
            ]
        }
    )
}

function createWindow() {
    addWindow = new BrowserWindow({
        width: 500,
        height: 500,
        title: "Yeni Pencere",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame:false,
    }),

    addWindow.setResizable(false);//boyutlandırma

        addWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'modal.html'),
            protocol: 'file',
            slashes: true,//file://main.html
        }))

        ,

        addWindow.on('close', () => {
            addWindow = null; //bellekte yer kaplamasın
        })
        

}

function getTodos() {
    console.log(todoList);
    return todoList;
}