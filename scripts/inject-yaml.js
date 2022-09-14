const fs = require('fs');
const path = require('path');
if (!process.env.YAML) {
	throw Error("No Yaml")
}
const buff = new Buffer.from(process.env.YAML, 'base64');

console.log("Copying Files");

const dir = './.config'
if (!fs.existsSync(dir)){
	fs.mkdirSync(dir, {recursive: true});
}

fs.writeFileSync(path.join(dir, 'default.yml'), buff);

const dir1 = '/misskey/.config'
if (!fs.existsSync(dir1)){
	fs.mkdirSync(dir1, {recursive: true});
}

fs.writeFileSync(path.join(dir1, 'default.yml'), buff);

console.log("Copying Done!");
