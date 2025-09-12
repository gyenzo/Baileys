console.clear();
console.log('Starting...');
require('./config');

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, jidDecode, downloadContentFromMessage } = require("@whiskeysockets/baileys");
const pino = require('pino');
const readline = require("readline");
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");
const FileType = require('file-type');
const { Boom } = require('@hapi/boom');
const { smsg, formatSize, isUrl, generateMessageTag, getBuffer, getSizeMedia, runtime, fetchJson, sleep } = require('./lib/myfunction');

const usePairingCode = true;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

const question = (text) => {
    const rl = readline.createInterface({ 
        input: process.stdin, 
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
});

// Function to clean up session files
const clearSession = () => {
    try {
        const sessionPath = './session';
        if (fs.existsSync(sessionPath)) {
            const files = fs.readdirSync(sessionPath);
            files.forEach(file => {
                fs.unlinkSync(path.join(sessionPath, file));
            });
            console.log('Session files cleared');
        }
    } catch (error) {
        console.log('Error clearing session:', error.message);
    }
};

const groupMetadataCache = new Map()

async function clientstart() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('./session');
        
        const client = makeWASocket({
            logger: pino({ level: "silent" }),
            printQRInTerminal: !usePairingCode,
            auth: state,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg?.message || undefined;
                }
                return undefined;
            }, 
                cachedGroupMetadata: async (jid) => {
      if (groupMetadataCache.has(jid)) {
        return groupMetadataCache.get(jid);
      }

      try {
        // Fetch metadata if not in cache
        const metadata = await client.groupMetadata(jid);
        groupMetadataCache.set(jid, metadata); // Cache it
        return metadata;
      } catch (err) {
        console.error(`Failed to fetch metadata for group ${jid}:`, err);
        return null;
      }
    }
        });

     if (usePairingCode && !client.authState.creds.registered) {
        const phoneNumber = await question(chalk.black.bgCyanBright(`
┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬███┬
┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬███┬┴
┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬████┴┬┴┬
┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴█┴┬█┬┴┬┴┬┴┬┴┬██┴┬┴┬┴┬┴
┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬█┬┴██┬┴┬┴┬┴┬██┴┬┴┬┴┬┴┬
█┬┴┬┴┬┴┬█┬┴┬┴┬┴█┴███┴██┬┴┬███┬┴┬┴█┴┬┴
██┬┴┬┴┬┴██┬┴┬┴┬█┬█████┬┴┬███┬┴┬┴██┬┴┬
┴███┴┬┴┬██┴┬┴███┴████┬┴██████┬┴██┬┴┬┴
┬┴███┴┬┴█┴┬┴███┴████████████████┬┴┬┴┬
┴┬┴┬██┴┬██┴┬██████┴┬┴███┴┬┴┬████┴┬┴┬█
┬█┬┴┬█┬┴┬████████┴┬┴┬┴██┬┴┬┴┬███┬┴┬██
┴██┬┴███████████┴┬┴┬┴┬┴┬┴┬┴┬┴███████┴
┬██┴┬┴█████┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴█████┴┬
┴┬█████████┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬████┴┬┴
┬┴┬████┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴██┬┴┬┴┬┴███┴┬┴┬
┴█████┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬██┴┬┴┬┴┬██┴┬┴┬┴
██████┬┴┬┴┬┴┬┴┬┴██┬┴┬┴██┬┴┬┴┬┴███████
┴█████┴┬┴┬██┴┬┴┬██┴┬┴┬██┴┬┴┬┴┬┴█████┴
┬████┴┬┴┬┴██┬┴┬┴██┬┴┬┴┬██┴┬┴┬┴┬██┴┬┴┬
┴████┬┴┬┴┬██┴┬┴┬██┴┬┴┬┴██┬┴┬┴┬┴██┬┴┬┴
┬█████┬┴┬┴██┬┴┬┴██┬┴┬┴┬██┴┬┴┬┴┬███┬┴┬
┴┬████┴┬┴┬██┴┬┴┬██┴┬┴┬┴██┬┴┬┴┬┴█████┴
┬█████┬┴┬┴██┬┴┬┴██┬┴┬┴┬██┴┬┴┬███┬┴███
███┬███┬┴┬██┴┬┴┬██┴┬┴┬┴████┴████┴┬┴┬┴
██┬┴████┬┴███┴┬┴████┴████████████┴┬┴┬
█┬┴┬┴┬██┴█████┴████████┬┴┬┴┬┴██┬██┴┬┴
┬┴┬┴┬┴┬█████████████┬┴███┴┬┴┬██┴┬┴┬┴┬
┴┬┴┬┴┬███┬██┴█████████┬┴┬┴████┴┬┴┬┴┬┴
┬┴┬┴┬┴██┬██┴┬███┬┴┬█████████┬┴┬┴┬┴┬┴┬
┴┬┴┬┴┬┴┬┴██┬┴┬█┬┴┬┴██┬┴┬┴┬██┴┬┴┬┴┬┴┬┴
┬┴┬┴┬┴┬┴┬█┬┴████┬┴┬██┴┬┴┬┴┬██┴┬┴┬┴┬┴┬
┴┬┴┬┴┬┴┬┴┬┴┬████┴┬┴██┬┴┬┴┬┴┬█┬┴┬┴┬┴┬┴
┬┴┬┴┬┴┬┴┬┴┬┴┬┴██┬┴██┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬
┴┬┴┬┴┬┴┬┴┬┴┬┴┬██┴┬█┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴
┬┴┬┴┬┴┬┴┬┴┬┴┬███┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬
┴┬┴┬┴┬┴┬┴┬┴┬┴█┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴┬┴


MASUKAN NOMER ANDA 62xxxx:\n\n`));

 const code = await client.requestPairingCode(phoneNumber.trim());
   console.log(chalk.black.bgGreen(`Your pairing code: ${code}`));
        }

        store.bind(client.ev);
        
        // Message handler with improved error handling
        client.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek || !mek.message) return;
                
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') 
                    ? mek.message.ephemeralMessage.message 
                    : mek.message;
                    
                if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
                if (!client.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
                
                const m = smsg(client, mek, store);
                require("./system")(client, m, chatUpdate, mek, groupMetadataCache);
            } catch (err) {
                console.error('Message handling error:', err);
            }
        });

        // Improved JID decoder
        client.decodeJid = (jid) => {
            if (!jid) return jid;
            if (/:\d+@/gi.test(jid)) {
                const decode = jidDecode(jid) || {};
                return decode.user && decode.server 
                    ? decode.user + '@' + decode.server 
                    : jid;
            } else {
                return jid;
            }
        };

        // Contact update handler
        client.ev.on('contacts.update', update => {
            for (const contact of update) {
                const id = client.decodeJid(contact.id);
                if (store && store.contacts) {
                    store.contacts[id] = { id, name: contact.notify };
                }
            }
        });

        client.public = global.status || true;

        // Enhanced connection handler
        client.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (connection === 'close') {
                const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
                console.log('Connection closed. Reason:', lastDisconnect?.error?.message || 'Unknown');
                
                switch (reason) {
    case DisconnectReason.badSession:
    console.log('Bad Session File, clearing session and restarting...');
    clearSession();
    setTimeout(() => clientstart(), 3000);
    break;
                        
    case DisconnectReason.connectionClosed:
    console.log('Connection closed, reconnecting...');
    if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    setTimeout(() => clientstart(), 5000);
    } else {
    console.log('Max reconnection attempts reached');
    process.exit(1);
    }
    break;
                        
    case DisconnectReason.connectionLost:
    console.log('Connection lost, trying to reconnect...');
    if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    setTimeout(() => clientstart(), 3000);
    } else {
    console.log('Max reconnection attempts reached');
     process.exit(1);
   }
     break;
                        
   case DisconnectReason.connectionReplaced:
     console.log('Connection Replaced, logging out...');
      client.logout();
   break;
                        
   case DisconnectReason.loggedOut:
    console.log('Device Logged Out, clearing session...');
      clearSession();
        process.exit(1);
   break;
                        
   case DisconnectReason.restartRequired:
       console.log('Restart Required, restarting...');
          setTimeout(() => clientstart(), 2000);
   break;
                        
   case DisconnectReason.timedOut:
       console.log('Connection TimedOut, reconnecting...');
          setTimeout(() => clientstart(), 5000);
   break;
                        
   default:
     console.log('Unknown disconnection reason, attempting reconnect...');
       if (reconnectAttempts < maxReconnectAttempts) {
         reconnectAttempts++;
           setTimeout(() => clientstart(), 5000);
         } else {
            process.exit(1);
         }
     break;
         }
            } else if (connection === "connecting") {
                console.log(chalk.cyanBright.italic.bgGray("Menghubungkan. . . ."));
            } else if (connection === "open") {
                console.log(chalk.cyan.bold("✅ Bot Berhasil Terhubung..."));
                reconnectAttempts = 0; // Reset counter on successful connection
            }
        });

        // Enhanced helper functions
        client.sendText = (jid, text, quoted = '', options = {}) => {
            return client.sendMessage(jid, { text: text, ...options }, { quoted });
        };
          client.sendTextWithMentions = async (t, e, n, s = {}) => {
          return client.sendMessage(
      t,
      {
        text: e,
        contextInfo: {
          mentionedJid: [...e.matchAll(/@(\d{0,16})/g)].map(
            (t) => t[1] + "@s.whatsapp.net"
          ),
        },
        ...s,
      },
      { quoted: n }
    );
}

        client.sendImage = async (jid, path, caption = '', quoted = '', options = {}) => {
            try {
                let buffer;
                if (Buffer.isBuffer(path)) {
                    buffer = path;
                } else if (/^data:.*?\/.*?;base64,/i.test(path)) {
                    buffer = Buffer.from(path.split(',')[1], 'base64');
                } else if (/^https?:\/\//.test(path)) {
                    buffer = await getBuffer(path);
                } else if (fs.existsSync(path)) {
                    buffer = fs.readFileSync(path);
                } else {
                    buffer = Buffer.alloc(0);
                }
                return await client.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted });
            } catch (error) {
                console.error('Error sending image:', error);
                throw error;
            }
        };
        
        client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
            try {
                const quoted = message.msg ? message.msg : message;
                const mime = (message.msg || message).mimetype || '';
                const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
                const stream = await downloadContentFromMessage(quoted, messageType);
                let buffer = Buffer.from([]);
                
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                
                const type = await FileType.fromBuffer(buffer);
                const trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
                
                await fs.promises.writeFile(trueFileName, buffer);
                return trueFileName;
            } catch (error) {
                console.error('Error downloading media:', error);
                throw error;
            }
        };
        
        client.downloadMediaMessage = async (message) => {
            try {
                const mime = (message.msg || message).mimetype || '';
                const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
                const stream = await downloadContentFromMessage(message, messageType);
                let buffer = Buffer.from([]);
                
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                return buffer;
            } catch (error) {
                console.error('Error downloading media:', error);
                throw error;
            }
        };

        client.getFile = async (PATH, save) => {
            try {
                let res, data;
                
                if (Buffer.isBuffer(PATH)) {
                    data = PATH;
                } else if (/^data:.*?\/.*?;base64,/i.test(PATH)) {
                    data = Buffer.from(PATH.split(',')[1], 'base64');
                } else if (/^https?:\/\//.test(PATH)) {
                    res = await getBuffer(PATH);
                    data = res;
                } else if (fs.existsSync(PATH)) {
                    data = fs.readFileSync(PATH);
                } else if (typeof PATH === 'string') {
                    data = PATH;
                } else {
                    data = Buffer.alloc(0);
                }

                const type = await FileType.fromBuffer(data) || {
                    mime: 'application/octet-stream',
                    ext: '.bin'
                };
                
                const filename = path.join(__dirname, './tmp/' + new Date().getTime() + '.' + type.ext);
                
                if (data && save) {
                    await fs.promises.writeFile(filename, data);
                }
                
                return {
                    res,
                    filename,
                    size: await getSizeMedia(data),
                    ...type,
                    data
                };
            } catch (error) {
                console.error('Error getting file:', error);
                throw error;
            }
        };

        // Enhanced group participants update handler
        client.ev.on('group-participants.update', async (anu) => {
            if (!global.welcome) return;
            
            try {                
                const metadata = await client.groupMetadata(anu.id);
                groupMetadataCache.set(anu.id, metadata);
                const botNumber = await client.decodeJid(client.user.id);
            if (anu.participants.includes(botNumber)) return;
                const namagc = metadata.subject;
                const participants = anu.participants;
                
                for (const num of participants) {
                    try {
                        const check = anu.author !== num && anu.author.length > 1;
                        const tag = check ? [anu.author, num] : [num];
                        let ppuser;
                        
                        try {
                            ppuser = await client.profilePictureUrl(num, 'image');
                        } catch {
                            ppuser = 'https://telegra.ph/file/320b066dc81928b782c7b.png';
                        }
                        
                        const welcomeLinks = `
*JANGAN LUPA JOIN GRUP DI BAWAH INI*

*⚡ Grup Hosting Close*
https://chat.whatsapp.com/KK0gKJxlCp2Gfnqdb9vkHj
*🔖Grup Hosting Open¹*
https://chat.whatsapp.com/DuCa8JAM6hXB9Zglj02g8k
*🔖Grup Hosting Open²*
https://chat.whatsapp.com/HSeREhDzKE729B0EbXLwXW
*🔖Grup Hosting Open³*
https://chat.whatsapp.com/JVY9enVXkOtLSSApkMTPZw 
*°NandOffc*`;

                        let messageText = '';
                        let titleText = '';
                        
                        switch (anu.action) {
                            case 'add':
                                messageText = check 
                                    ? `@${anu.author.split("@")[0]} Telah Menambahkan @${num.split("@")[0]} Ke Dalam Grup Ini\nᆢᆢ──────  ۪  𐠖  ۫  ──────ᆢᆢ\n${welcomeLinks}`
                                    : `Hallo Kak @${num.split("@")[0]} Selamat Datang Di *${namagc}*\nᆢᆢ──────  ۪  𐠖  ۫  ──────ᆢᆢ\n${welcomeLinks}`;
                                titleText = '© Welcome Message';
                                break;
                                
                            case 'remove':
                                messageText = check 
                                    ? `@${anu.author.split("@")[0]} Telah Mengeluarkan @${num.split("@")[0]} Dari Grup Ini\nᆢᆢ──────  ۪  𐠖  ۫  ──────ᆢᆢ\n${welcomeLinks}`
                                    : `@${num.split("@")[0]} Telah Keluar Dari Grup Ini\n${welcomeLinks}`;
                                titleText = '© Leaving Message';
                                break;
                                
                            case 'promote':
                                messageText = `@${anu.author.split("@")[0]} Telah Menjadikan @${num.split("@")[0]} Sebagai Admin Grup Ini\nᆢᆢ──────  ۪  𐠖  ۫  ──────ᆢᆢ\n${welcomeLinks}`;
                                titleText = '© Promote Message';
                                break;
                                
                            case 'demote':
                                messageText = `@${anu.author.split("@")[0]} Telah Memberhentikan @${num.split("@")[0]} Sebagai Admin Grup Ini\nᆢᆢ──────  ۪  𐠖  ۫  ──────ᆢᆢ\n${welcomeLinks}`;
                                titleText = '© Demote Message';
                                break;
                                
                            default:
                                continue;
                        }
                        
                        await client.sendMessage(anu.id, {
                            text: messageText,
                            contextInfo: {
                                mentionedJid: [...tag],
                                externalAdReply: {
                                    thumbnailUrl: ppuser,
                                    title: titleText,
                                    body: '',
                                    renderLargerThumbnail: true,
                                    sourceUrl: 'https://whatsapp.com/channel/0029VafnlMSBfxo3hyDDQ63U',
                                    mediaType: 1
                                }
                            }
                        });
                        
                        // Add delay to prevent rate limiting
                        await sleep(1000);
                    } catch (participantError) {
                        console.error('Error processing participant:', participantError);
                    }
                }
            } catch (err) {
                console.error('Group participants update error:', err);
            }
        });
        
        client.ev.on('creds.update', saveCreds);
        return client;
    } catch (error) {
        console.error('Error starting client:', error);
        throw error;
    }
}

// Start the client with error handling
async function startBot() {
    try {
        await clientstart();
    } catch (error) {
        console.error('Failed to start bot:', error);
        console.log('Retrying in 10 seconds...');
        setTimeout(startBot, 10000);
    }
}

startBot();

// File watcher with improved error handling
let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
    require('fs').unwatchFile(file);
    console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
    delete require.cache[file];
    require(file);
});

// Graceful shutdown handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Graceful shutdown...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Graceful shutdown...');
    process.exit(0);
});