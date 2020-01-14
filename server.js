let Client = require("ssh2-sftp-client");
let fs = require("fs");
var readlineSync = require("readline-sync");
let sftp = new Client();

const privateKeyLocation = readlineSync.question("Enter Private Key Location: ");

//    /Users/gauravsoni/.ssh/id_rsa

//Get the private key from local
const privateKey = fs.readFileSync(privateKeyLocation, "utf-8");

// Wait for user's response.
var backupName = readlineSync.question("Enter the backup name until .gz: ");

let files = []; //List of files to download

const config = {
  host: "bitrix.allcadservices.com",
  port: "22",
  username: "root",
  privateKey: privateKey
};

const downloadLocation = "/Users/gauravsoni/Desktop/test/";

createLocalFolder();

function createLocalFolder() {
  try {
    fs.mkdirSync(downloadLocation);
  } catch {}

  console.log("folder created");
}

function downloadFiles(file) {
  const remoteLocation = `/home/bitrix/www/bitrix/backup/${file}`;
  const localLocation = downloadLocation + file;

  return sftp.fastGet(remoteLocation, localLocation, {
    step: (total_transferred, chunk, total) => {
      console.log(file, total_transferred);
    }
  });
}

sftp
  .connect(config)
  .then(() => {
    return sftp.list("/home/bitrix/www/bitrix/backup/", `${backupName}.*`);
  })
  .then(async data => {
    files = data.map(file => {
      return file.name;
    });
    console.log("Files to download = ", files.length);
    for (let i = 0; i < files.length; i++) {
      await downloadFiles(files[i]);
    }
    console.log("Total Files Downloaded = ", files.length);
    sftp.end();
  })
  .catch(err => {
    console.log(err, "catch error");
    sftp.end();
  });
