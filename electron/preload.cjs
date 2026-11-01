const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('jarvis', {
  getStatus: () => ipcRenderer.invoke('jarvis:status'),
  setModel: (model) => ipcRenderer.invoke('jarvis:set-model', model),
  chat: (message) => ipcRenderer.invoke('jarvis:chat', message)
});
