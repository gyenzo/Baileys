require('./config');
const axios = require("axios")
const fs = require('fs');
const path = require('path');
const util = require("util");
const chalk = require("chalk");
const crypto = require('crypto');
const ssh2 = require("ssh2");
const jimp = require("jimp");
const os = require("os");
const { Client } = require('ssh2');
const { performance } = require("perf_hooks");
const moment = require("moment-timezone");
const { spawn, exec,  execSync } = require('child_process');
const { default: baileys, proto, generateWAMessage, generateWAMessageFromContent, getContentType, 
  prepareWAMessageMedia } = require("@whiskeysockets/baileys");
const { ok } = require('assert');

module.exports = client = async (client, m, chatUpdate, store) => {
  try {
  const body = (
  m.mtype === "conversation" ? m.message.conversation :
  m.mtype === "imageMessage" ? m.message.imageMessage.caption :
  m.mtype === "videoMessage" ? m.message.videoMessage.caption :
  m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
  m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage?.selectedButtonId :
  m.mtype === "listResponseMessage" ? m.message.listResponseMessage?.singleSelectReply?.selectedRowId :
  m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage?.selectedId :
  m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg?.nativeFlowResponseMessage?.paramsJson || "{}")?.id :
  m.text || ""
);


// Load Database JSON
const Owner = JSON.parse(fs.readFileSync('./lib/database/owner.json'));
const contacts = JSON.parse(fs.readFileSync('./lib/database/contacts.json'));


// ====== IMAGE NYE ========
const zora = fs.readFileSync('./image/theZora.jpg');
const exten = fs.readFileSync('./image/exten.jpg');
const zuxo = fs.readFileSync('./image/zora.jpg');


// Waktu Indonesia
let jakartaTime = moment().tz("Asia/Jakarta");
const wib = moment.tz("Asia/Jakarta").format("HH : mm : ss");
const wit = moment.tz("Asia/Jayapura").format("HH : mm : ss");
const wita = moment.tz("Asia/Makassar").format("HH : mm : ss");
const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
const timestamp = moment().tz("Asia/Jakarta").valueOf();
const hariini = jakartaTime.format("DD MMMM YYYY");
const tgl_hariini = moment().tz("Asia/Jakarta").format("DD-MM-YYYY");
const time21 = moment.tz('Asia/Jakarta').format('HH : mm : ss');
const jam = jakartaTime.format("HH:mm:ss");


// Ucapan Waktu
const ucapanWaktu = jam < '05:00:00' ? 'Selamat Pagi 🌉' : jam < '11:00:00' ? 'Selamat Pagi 🌄' : jam < '15:00:00' ? 'Selamat Siang 🏙' : jam < '18:00:00' ? 'Selamat Sore 🌅' : jam < '19:00:00' ? 'Selamat Sore 🌃' : jam < '23:59:00' ? 'Selamat Malam 🌌' : 'Selamat Malam 🌌';


// Info Pengirim
const from = m.key.remoteJid;
const isGroup = from.endsWith("@g.us");
const botNumber = client.decodeJid(client.user.id);
const sender = m.key.fromMe
    ? botNumber
    : m.key.participant || m.key.remoteJid;
const senderNumber = sender.split('@')[0];

// Cek Akses Kontributor / Owner
const kontributor = Owner; // langsung pakai Owner aja
const Access = [botNumber, ...[].concat(kontributor), ...[].concat(global.owner)]
    .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    .includes(sender);


const budy = typeof m.text === 'string' ? m.text : '';
const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><™©®Δ^βα¦|/\\©^]/.test(body)
    ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!™©®Δ^βα¦|/\\©^]/gi)[0]
    : '/';

const isOwner = [botNumber, ...global.owner.map(v => v + '@s.whatsapp.net')].includes(m.sender) || m.key.fromMe;
const isCmd = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
const cmd = prefix + command;
const args = body.trim().split(/ +/).slice(1);
const pushname = m.pushName || "No Name";
const text = q = args.join(" ");
const quoted = m.quoted ? m.quoted : m;
const mime = (quoted.msg || quoted).mimetype || '';
const qmsg = (quoted.msg || quoted);
const isMedia = /image|video|sticker|audio/.test(mime);
    
let groupMetadata = {};
let groupOwner = "";
let groupName = "";
let participants = [];
let groupAdmins = [];
let groupMembers = [];
let isGroupAdmins = false;
let isBotGroupAdmins = false;


if (m.isGroup) {
  groupMetadata = await client.groupMetadata(m.chat).catch(() => ({})) || {};
  groupOwner = groupMetadata.owner || "";
  groupName = groupMetadata.subject || "";
  participants = groupMetadata.participants || [];
  groupMembers = participants;
  groupAdmins = participants
    .filter((v) => v.admin)
    .map((v) => v.id);
  isGroupAdmins = groupAdmins.includes(m.sender);
  isBotGroupAdmins = groupAdmins.includes(botNumber);
}


const { smsg, formatSize, isUrl, generateMessageTag, getBuffer, getSizeMedia, runtime, fetchJson, sleep } = require('./lib/myfunction');
    const time = moment.tz("Asia/Makassar").format("HH:mm:ss");
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
})


function getRandom(jumlahDigit) {
  let hasil = '';
  for (let i = 0; i < jumlahDigit; i++) {
    const angka = Math.floor(Math.random() * 10); // Angka 0-9
    hasil += angka.toString();
  }
  return hasil
}



// ====== Loading Messages ======
async function loading(from) {
  let Floading = [
    "□□□□□ 0%,",
    "■□□□□ 20%",
    "■■□□□ 40%",
    "■■■□□ 60%",
    "■■■■□ 80%",
    "■■■■■ 100%",   
    "𝐒𝐮𝐜𝐜𝐞𝐬𝐬 𝐋𝐨𝐚𝐝𝐢𝐧𝐠...",
    "𝐄𝐱𝐭𝐞𝐧𝐬𝐢𝐨𝐧 𝐕2.1"
  ];

  // kirim pesan awal
  let { key } = await client.sendMessage(from, { text: Floading[0] });

  // edit isi pesan berkali-kali
  for (let i = 1; i < Floading.length; i++) {
    await sleep(500);
    await client.sendMessage(from, {
      text: Floading[i],
      edit: key   // <-- ini yang bikin "edit" bukan kirim baru
    });
  }
}


// ====== FUNCTION PAYMENT ========
async function sendPaymentImage(m, client, title, imgPath, copyText) {
  try {
   let teks = `*${title}*\n\nJangan lupa kirim bukti transfer ya kak`;

  let mediaMsg = await prepareWAMessageMedia(
   { image: { url: imgPath } },
   { upload: client.waUploadToServer }
 );

  let msg = await generateWAMessageFromContent(
   m.chat,
    {
     viewOnceMessage: {
     message: {
     interactiveMessage: {
     body: { text: teks },
     footer: { text: "" },
     header: {
     title: "",
     hasMediaAttachment: true,
     imageMessage: mediaMsg.imageMessage
   },
     nativeFlowMessage: {
     buttons: [
       {
         name: "cta_copy",
         buttonParamsJson: JSON.stringify({
         display_text: "📄 Copy Nomor",
         copy_code: copyText
       })
     }
   ]
 },
   contextInfo: { mentionedJid: [m.sender] }
 }
}
}
},
{ quoted: qtext }
);

  await client.relayMessage(msg.key.remoteJid, msg.message, {});
  } catch (err) {
    console.log("Error Payment:", err);
  }
}


//===== Format Up Time ======
const formatUptime = (created) => {
  const now = new Date()
  const createdDate = new Date(created)
  const diff = now - createdDate
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

// Versi panjang
function runtimeLong(seconds) {
  seconds = Number(seconds);

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + " hari, " : "";
  const hDisplay = h > 0 ? h + " jam, " : "";
  const mDisplay = m > 0 ? m + " menit, " : "";
  const sDisplay = s > 0 ? s + " detik" : "";

  return (dDisplay + hDisplay + mDisplay + sDisplay).trim();
}

// Versi singkat
function runtimeShort(seconds) {
  seconds = Number(seconds);

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + "d " : "";
  const hDisplay = h > 0 ? h + "h " : "";
  const mDisplay = m > 0 ? m + "m " : "";
  const sDisplay = s > 0 ? s + "s" : "";

  return (dDisplay + hDisplay + mDisplay + sDisplay).trim();
}

    
    // Logging Pesan
if (isCmd) {
  const logMsg = `
${chalk.blue.bold("╭───────────────❍")}
${chalk.red.bold("│📆 TANGGAL :")} ${hariini}
${chalk.yellow.bold("│⏰ WAKTU   :")} ${time21} Wib
${chalk.cyan.bold("│📢 PESAN   :")} ${m.body || m.mtype}
${chalk.green.bold("│🎭 PENGIRIM:")} ${pushname}
${chalk.magenta.bold("│💥 JID     :")} ${senderNumber}
${chalk.blue.bold("╰───────────────❍")}
  `;

  console.log(logMsg);
}

// Logging kalau pesan dari Grup
if (m.isGroup) {
  const groupLog = `
${chalk.blue.bold("╭─────────────❍")}
${chalk.red.bold("│📆 TANGGAL :")} ${hariini}
${chalk.yellow.bold("│⏰ WAKTU   :")} ${time21}
${chalk.cyan.bold("│📢 PESAN   :")} ${m.body || m.mtype}
${chalk.green.bold("│🎭 PENGIRIM:")} ${pushname}
${chalk.magenta.bold("│💥 JID     :")} ${senderNumber}
${chalk.blue.bold("│✳️ GROUP ID:")} ${m.chat}
${chalk.green.bold("╰────────────❍")}
  `;

  console.log(groupLog);
}

console.log(); 




// ===== Resize =======
const createSerial = (size) => {
return crypto.randomBytes(size).toString('hex').slice(0, size)
}


// === Contoh Format Salah ===
const example = (teks) => {
  return `\n*Format Salah!!*\n*Example:* *${prefix + command}* ${teks}\n`;
};


// ====== CONFIG NYE BANG ZO ========
const author = "GyenzoXyc"; // atau nama bot lu
const footer = "༉𝐆𝐲𝐞𝐧𝐳𝐨𝐗𝐲𝐜";
const thumbbot = "https://files.catbox.moe/2sjfrh.jpg";
const idch = "120363403263573138@newsletter";
const namach = "ЄҲƬЄƝƧƖƠƝ ƖƝƑƠƦMAƬƖƠƝ";
const titles = "⚘ 𝐆𝐲𝐞𝐧𝐳𝐨𝐗𝐲𝐜";
const bodys = "Extension Viluets";
const thumbowner = "https://files.catbox.moe/ml5ea8.png";
const totele = "https://t.me/GyenzoXyc";


// ===== Header nye =====
const infomas = `
┌──⌬『 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 』
└┬─────────────────❍
┌┘                         
│✠ 𝙾𝚠𝚗𝚎𝚛 𝙱𝚘𝚝 : ${global.namaOwner}
│✠ 𝙱𝚘𝚝 𝙽𝚊𝚖𝚎 : 𝙶𝚢𝚎𝚗𝚣 𝙱𝚘𝚝 𝚇𝚢𝚌 
│✠ 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : 2.1 _Beta_
│✠ 𝙽𝚊𝚖𝚎 𝚂𝚌 : 𝙶𝚢𝚎𝚗𝚂𝚑𝚘𝚙
│✠ 𝚃𝚢𝚙𝚎 𝚂𝚌 : 𝙲𝚊𝚜𝚎 & 𝙿𝚕𝚞𝚐𝚒𝚗
│✠ 𝚁𝚞𝚗𝚗𝚒𝚗𝚐 : 𝙿𝚝𝚎𝚛𝚘𝚍𝚊𝚌𝚝𝚢𝚕
│✠ 𝙱𝚘𝚝 𝙼𝚘𝚍𝚎 : ${client.public ? "𝙿𝚞𝚋𝚕𝚒𝚌" : "𝚂𝚎𝚕𝚏"}
│✠ 𝚈𝚘𝚞 𝙰𝚔𝚜𝚎𝚜 : ${Access ? "𝚘𝚠𝚗𝚎𝚛" : "𝚞𝚜𝚎𝚛"}
└───────────────────❍`;

//====== BEBAS TARO DIMANA AJA ======
const turucuy = `
╭──【 𝐓𝐢𝐦𝐞 & 𝐃𝐚𝐭𝐞 𝐍𝐨𝐰 】───❥
│👋 *${ucapanWaktu}*
│⏰ *${time2} WIB*
│📆 *${hariini}*
╰───────────────────❥`;


const readmore = `
͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏
`;


//==== Quoted 1 <<( qchanel )>>=====
const qchanel = {
 key: {
 remoteJid: 'status@broadcast',
 fromMe: false,
 participant: '0@s.whatsapp.net'
},
 message: {
 newsletterAdminInviteMessage: {
 newsletterJid: global.idChannel,
 newsletterName: global.namaChannel,
 jpegThumbnail: "", // bisa ganti jadi buffer gambar
 caption: `Name: ${pushname}\nCommand: ${command}`,
 inviteExpiration: Date.now() + 1814400000 // 21 hari
}
}
};


// ===== QUOTED 2 <<( qtext )>> =======
const qtext = {
  key: {
   remoteJid: "status@broadcast",
   participant: "0@s.whatsapp.net"
 },
  message: {
   extendedTextMessage: {
     text: `Waktu: ${time21} wib\nTanggal: ${hariini}\n© By GyenzoXyc`
     }
   }
 };


// ======== QUOTED 3 <( QXTEN )> ==========
const qxten = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    ...(m ? { remoteJid: m.chat } : {})
  },
  message: {
    productMessage: {
      product: {
        productImage: {
          mimetype: "image/jpeg",
          jpegThumbnail: fs.readFileSync("./image/exten.jpg") // logo lu
        },
        title: `– Exten Bot Multi`, // Judul utama
        description: `Version 1.0\nTime: ${time21}\nTanggal: ${hariini}`, 
        currencyCode: "IDR",
        priceAmount1000: "0", // Rp 0
        retailerId: "GyenzBot",
        productImageCount: 1
      },
      businessOwnerJid: "0@s.whatsapp.net"
    }
  }
};



// ======= QUOTED 4 <( FKONTAK )> =========
const fkontak = {
  key: {
	remoteJid: '0@s.whatsapp.net',
	participant: '0@s.whatsapp.net',
	fromMe: false,
	id: 'Gyenzo'
  },
	message: {
	contactMessage: {
	displayName: `Trave The Gyenzo\n${hariini}\n${ucapanWaktu}`,
	vcard: `BEGIN:VCARD
	VERSION:3.0
	N:XL;${author},;;;
	FN:${author}
	item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
	sendEphemeral: true
    }
  }
}


// ====== Quoted 5 ==========
const qkontak = {
    key: {
        participant: `0@s.whatsapp.net`,
        ...(botNumber ? {
            remoteJid: `status@broadcast`
        } : {})
    },
    message: {
        contactMessage: {
            displayName: `T༙r༙a༙v༙e༙ T༙h༙e༙ G༙y༙e༙n༙z༙o༙\n${time21} wib`,
            vcard: `BEGIN:VCARD
            VERSION:3.0
            N:XL;ttname,;;;
            FN:ttname
            item1.TEL;waid=6283894677054:+62 838-9467-7054
            item1.X-ABLabel:Ponsel
            END:VCARD`,
            sendEphemeral: true
        }
    }
};


// =======<( REPLY V1 )>=======
const reply = async (teks) => {
   return client.sendMessage(
    m.chat,
  {
    text: teks,
    mentions: [m.sender],
    contextInfo: {
    externalAdReply: {
    title: "ꦾᬁ࿚𝗚𝘆𝗲𝗻𝘇𝗼𝗫𝘆𝗰ꦿ",
    body: "ꦾꦸX𝖙𝖊𝖓𝖘𝖎𝖔𝖓 𝕭𝖔𝖙𝙯࿐",
    thumbnail: zora,
    sourceUrl: null
    }
  }
},
  { quoted: qtext }
  );
};


// ======<( REPLY V2 )>==========
const zoreply = (teks) => {
client.sendMessage(m.chat, { text: teks, contextInfo: {
     mentionedJid: [],
     groupMentions: [],
     isForwarded: true,
     forwardedNewsletterMessageInfo: {
     newsletterJid: '120363403263573138@newsletter',
     newsletterName: "𝐄𝐱𝐭𝐞𝐧𝐬𝐢𝐨𝐧 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧",
     serverMessageId: -1
   },
     forwardingScore: 256,
     externalAdReply: {
        showAdAttribution: true,
        title: `𝙶𝚢𝚎𝚗𝚣𝚘 𝙴𝚡𝚝𝚎𝚗`,
        body: `– Extension The Zora`,
        thumbnailUrl: `https://files.catbox.moe/i7tv2l.jpg`,
        sourceUrl: "https://t.me/GyenzoXyc",
        mediaType: 1,
        renderLargerThumbnail: false
      }
   }}, { quoted: fkontak })}




// ===========<( REPLY V3 )>===========
async function xreply(teks) {
  const exizo = {
    text: teks,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterName: namach,
        newsletterJid: idch,
      },
      externalAdReply: {
        showAdAttribution: true,
        title: titles,
        body: bodys,
        previewType: "VIDEO",
        thumbnailUrl: thumbowner,
        sourceUrl: totele,
      },
    },
  };
  return client.sendMessage(m.chat, exizo, { quoted: qkontak });
}


// ======<( REPLY V4 )>=========
const exreply = (teks) => {
  const buttons = [
    {
      buttonId: ".ping",
      buttonText: { displayText: "Speed Bot" }
    }
  ];

  const buttonMessage = {
    image: { url: thumbbot },
    caption: teks,
    footer: footer,
    buttons: buttons,
    headerType: 6,
    contextInfo: { 
      forwardingScore: 99999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: idch,
        serverMessageId: null,
        newsletterName: namach
      },
      mentionedJid: ["13135550002@s.whatsapp.net"]
    },
    viewOnce: true
  };

  return client.sendMessage(m.chat, buttonMessage, { quoted: qkontak });
}


//=========== CASE MENU BOT =============
switch (command) {






























































// END CASE JING °^°
default:
if (budy.startsWith('$')) {
if (!isOwner) return reply('*khusus Premium*')
exec(budy.slice(2), (err, stdout) => {
if(err) return reply(err)
if (stdout) return reply(stdout)})}

if (budy.startsWith('>')) {
if (!isOwner) return;
try {
let evaled = await eval(budy.slice(2));
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
await reply(evaled);
} catch (err) {
reply(String(err));
}
}
if (budy.startsWith('<')) {
if (!isOwner) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await reply(require('util').format(teks))
}
}
}
} catch (err) {
console.log(require("util").format(err));
  }
};

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file);
  console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
  delete require.cache[file];
  require(file);
});