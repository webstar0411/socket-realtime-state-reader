const fs = require("fs");

function getRandomLine(filename, callback){
  fs.readFile(filename, "utf-8", function(err, data){
    if(err) {
        throw err;
    }
    var lines = data.split('\n');
    var line = lines[Math.floor(Math.random()*lines.length)]
    callback(line);
 })
}

setInterval(() => {
  getRandomLine('./stream/sample.txt', (str) => {
    var stream = fs.createWriteStream("./stream/a.txt");
    stream.write(str + '\n');
    console.log("a.txt wrote: ", str)
    stream.end()
  })
}, 1000)

setInterval(() => {
  getRandomLine('./stream/sample.txt', (str) => {
    var stream = fs.createWriteStream("./stream/b.txt");
    stream.write(str + '\n');
    console.log("b.txt wrote: ", str)
    stream.end()
  })
}, 1102)