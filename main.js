const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;
let mainWindow;

app.on('ready', () => {

    console.log(process.platform)//işletim sistemi bilgisi

    console.log("Uygulama çalışıyor")
    mainWindow = new BrowserWindow({})//pencere oluştur
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file',
        slashes: true,//file://main.html
    }))

    //menu ekleme
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate1);
    Menu.setApplicationMenu(mainMenu);//uygulamayı set et
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