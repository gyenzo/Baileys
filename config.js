const fs = require('fs')

//==============[ Setting Di sini ]==================\\
global.namaOwner = "GyenzoXyc"
global.botname = "Bot GyenShop"
global.owner= ["6283894677054"]
global.namaStore = "Gyenzo Store"
global.noOwner = "6283894677054"
global.thumbUrl = "https://files.catbox.moe/i7tv2l.jpg"

//========[ Setting Sosmed Di Sini ]================\\
global.telegram = "https://t.me/GyenzoXyc"
global.linkCh = "https://whatsapp.com/channel/0029VbB0BQhA2pL8ouDCav2W"
global.linkGc = "https://"
global.linkWebsite = "lynk.id/gyenzo-xyc"

//==========[ Setting Payment Di sini ]===========\\
global.dana = "083893989114" 
global.gopay = "083893989114"

//===========[ Setting Message Di Sini ]================\\
global.mess = {
  owner: "Lu Bukan Owner Gue Kocag",
  done: "Done Abangku ✓",
  success: "Mangtaps Lerr",
  error: "Error Nih Jing🗿",
  wiat: "⏳ Mohon Tunggu"
}

//=========[ Gausah Di Ubah Yang Ini ]================\\
let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
