const fetch = require("../fetch");
const fs = require("fs");
const { LEVELS, log } = require("./log");

async function getFolderId(token, user_id) {
  const uri_folder = `${process.env.GRAPH_ENDPOINT}v1.0/users/${user_id}/mailFolders`;
  const {value} = await fetch.callApi(uri_folder, token);
  const findedFolder = value.find(folder => {
    return folder.displayName === process.env.FOLDER_PROCESS_OK
  })
  if (!findedFolder) {
    const {id} = await fetch.postApi(uri_folder, {
      "displayName": process.env.FOLDER_PROCESS_OK,
      "isHidden": false
    }, token);
    return id
  } else {
    return findedFolder.id
  }
}

function moveMessages(user_id, folder_id, message_id) {//${process.env.GRAPH_ENDPOINT}v1.0
  const uri_folder = `/users/${user_id}/mailFolders/inbox/messages/${message_id}/move`;
  return {
    url: uri_folder,
    method: "POST",
    body: {
       "destinationId": folder_id,
    }
  }
  // const moved = await fetch.postApi(uri_folder, , token);
  // log(`Movido o Email ID ${message_id} para a pasta ID ${folder_id}`, LEVELS.DEBUG)
}

async function getUserId(token) {
  const uri_user = `${process.env.GRAPH_ENDPOINT}/v1.0/users/${process.env.MAIL}`;
  const { id } = await fetch.callApi(uri_user, token);
  log(`Verificando email de ${process.env.MAIL}`, LEVELS)
  return id;
}

async function listMails(token, user_id) {
  log(`Listando emails do user ID ${user_id}`, LEVELS.DEBUG)
  const uri_mails = `${process.env.GRAPH_ENDPOINT}/v1.0/users/${user_id}/mailFolders/inbox/messages?$select=id`;
  const email = await fetch.callApi(uri_mails, token);
  // console.log(email)
  return email.value;
}

function getAttachmentFromEmail(user_id, email_id) {
  log(`Listando anexos da mensagem ID ${email_id}`, LEVELS.DEBUG) //${process.env.GRAPH_ENDPOINT}/v1.0
  const uri_attachments = `/users/${user_id}/messages/${email_id}/attachments`;
  return {
    url: uri_attachments,
    method: "GET",
  }
  // const { value } = await fetch.callApi(uri_attachments, token);
  //return value;
}

async function postBatch(requests, token){
  const uri_batch = `${process.env.GRAPH_ENDPOINT}v1.0/$batch`;
  const { responses } = await fetch.postApi(uri_batch, {requests}, token);
  return responses
}

async function savefile(name, base64) {
  const filename = `${process.env.PATH_SAVE}/${name}`
  log(`Arquivo salvo em ${filename}`, LEVELS.INFO)
  await fs.writeFileSync(filename, base64, "base64");
}

async function getMail(token) {
  const user_id = await getUserId(token);
  const folder_id = await getFolderId(token, user_id);
  const mails = await listMails(token, user_id);
  const req_attach = [];
  const req_move = []

  mails.map((email) => {
    req_attach.push({
      id: req_attach.length + 1,
      ...getAttachmentFromEmail( user_id, email.id )
    });
    req_move.push({
      id: req_move.length + 1,
      ...moveMessages(user_id, folder_id, email.id),
      headers: {
        "Content-Type": "application/json"
      }
    });
    
  })

  if(req_attach.length === 0) return;

  const allEmailAttach = await postBatch(req_attach, token);
  await Promise.all(
    allEmailAttach.map(async ({body}) => {
      await Promise.all(
        body.value.map(async (attach) => {
          if (attach.name.endsWith('.xml'))
            await savefile(attach.name, attach.contentBytes);
        })
      )
    })
  )
  await postBatch(req_move, token);

  
}

module.exports = {
  getMail,
  getFolderId,
  getUserId,
};
