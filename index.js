const electron = require("electron")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

const path = require("path")

let mainWindow = null
app.on("ready", () => {
    // mainWindow を作成
    mainWindow = new BrowserWindow({
        useContentSize: true,
        width: 720,
        height: 540,
        autoHideMenuBar: true,
    })

    // html を指定
    mainWindow.loadURL(path.join(__dirname, "index.html"))

    // developper tool を開く
    // mainWindow.webContents.openDevTools();

    Menu.setApplicationMenu(null)

    mainWindow.on("closed", () => {
        mainWindow = null
    })
})
