import { app, BrowserWindow } from "electron"
import * as path from "path"

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		height: 600,
		width: 800,
	})

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "../index.html"))

	// Open the DevTools.
	mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
	createWindow()
})
