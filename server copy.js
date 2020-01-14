var Client = require("scp2").Client;
// const client = scpClient.Client;
const fs = require("fs");

const privateKey = fs.readFileSync("/Users/gauravsoni/.ssh/id_rsa", "utf-8");
const buffer = Buffer.from("this is a tést");

var client = new Client({
  port: 22,
  host: "bitrix.allcadservices.com",
  username: "root",
  privateKey: privateKey
});

// client.write(
//   {
//     destination: "/home/file.txt",
//     content: buffer
//   },
//   () => {
//     console.log("Created value");
//     client.close();
//   }
// );

client.download(
  "/home/bitrix/www/bitrix/backup/index.php",
  "/Users/gauravsoni/Desktop/",
  ()=>{
      console.log("file downloaded");
      client.close();
  }
);

client.on("connect", () => {
  console.log("clinet is ready yo !!");
});

client.on("transfer",(buff,downloaded,total)=>{
    console.log(total);
})

// scpClient.scp(
//   {
//     host: "bitrix.allcadservices.com",
//     username: "root",
//     privateKey: fs.readFileSync("/Users/gauravsoni/.ssh/id_rsa"),
//     path: "/home/bitrix/www/bitrix/backup/index.php"
//   },
//   "/Users/gauravsoni/Desktop/",
//   function(err) {
//     if (!err) {
//       console.log("Copied");
//     }
//   }
// );
