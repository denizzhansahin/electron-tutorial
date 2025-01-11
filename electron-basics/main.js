const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow;

app.on('ready', () => {

    console.log(process.platform)//işletim sistemi bilgisi

    console.log("Uygulama çalışıyor")
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })//pencere oluştur
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file',
        slashes: true,//file://main.html
    }))

    //menu ekleme
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate1);
    Menu.setApplicationMenu(mainMenu);//uygulamayı set et

    //ipcMain, ipcRenderer ile gelen veriyi almak
    ipcMain.on("key", (err, data) => {

        console.log(data)
    })

    ipcMain.on("key:inputValue", (err, data) => {
        console.log(data)
    })

    //Yeni pencere
    ipcMain.on("key:newWindow", (err, data) => {
        createWindow();
    })

    mainWindow.on('closed', () => {
        app.quit();//uygulamayı kapat
    })
})

//menu template 
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
        width: 300,
        height: 200,
        title: "Yeni Pencere",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    }), 
    
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