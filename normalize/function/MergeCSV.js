const fs = require('fs');
const path = require('path');
const moment = require('moment');
const minimongo = require("minimongo");

class MergeData {
    constructor(){
        
        this.content = '';
        this.dateList = [];
        this.outputFilePath = null;
        this.LocalDb = minimongo.MemoryDb;
        this.db = new (this.LocalDb)();
        this.columnHeader = '';

        this.fileList = [];
    }

    readAllFilesInDir(){
        return new Promise((resolve, reject) => {
            try {
                //joining path of directory 
                const directoryPath = path.join(__dirname, `../rawdata/`);
                //passsing directoryPath and callback function
                fs.readdir(directoryPath, (err, files) => {
                    //handling error
                    if (err) {
                        return console.log('Unable to scan directory: ' + err);
                    } 
        
                    this.fileList.lenght = 0
        
                    //listing all files using forEach
                    files.forEach( (file) => {
                        // Do whatever you want to do with the file
                        console.log(file); 
                        this.fileList.push(path.join(__dirname, `../rawdata/`, file))
                    });

                    resolve(this.fileList);
                });

            } catch(err) {
                reject(err)
            }
        })
    }

    setCSVFileName(fname) {
        this.collectionName = fname.replace(/[\W_]+/g, '');
        this.outputFilePath = path.resolve(__dirname, `../merged/${fname}.csv`);

        // Add a collection to the database
        this.db.addCollection(this.collectionName);
    }

    clearOutputFile() {
        if (fs.existsSync(this.outputFilePath)) {
            // file exists
            fs.unlinkSync(this.outputFilePath);
        }
    }

    scanData(filePath) {
        return new Promise((resolve, reject) => {
            try {
                // read contents of the file
                const data = fs.readFileSync(filePath, 'UTF-8');

                // split the contents by new line
                const lines = data.split(/\r?\n/);

                // print all lines
                lines.forEach((line, lineIndex) => {
                    // console.log(line);

                    if(lineIndex>0) {
                        let lineObj = line.replace(/","/g, '\";\"').replace(/"/g, '').split(';');
                        // console.log(lineObj);

                        let unix = moment((lineObj[0]), "MMM DD, YYYY").unix()

                        this.db[this.collectionName].find({ unix:unix }, { limit:1 }).fetch((success, error) => {
                            console.log('Fetch local db success : ', success)
                            console.log('Fetch local db success length : ', success.length)
                            console.log('Fetch local db error : ', error)
                            if(success.length==0) {
                                let doc = { 
                                    unix: moment((lineObj[0]), "MMM DD, YYYY").unix(),
                                    data: line
                                };

                                console.log('Prepare doc to upserted : ', doc)

                                this.db[this.collectionName].upsert(doc, function() {
                                    console.log('Upserted to minimongo : ', doc)
                                });
                            } else {
                                console.log('Data existing in minimongo...')
                            }
                        });
                    } else {
                        // Column Header
                        this.columnHeader = `${line}\r\n`
                    }
                });

                resolve()

            } catch(err) {
                reject(err)
            }
        });
    }

    merge(similarFileName) {
        return new Promise((resolve, reject) => {

            // Set output file name
            this.setCSVFileName(`${similarFileName}all`);

            // Clear old file
            this.clearOutputFile();

            try {

                // Scan all file
                this.readAllFilesInDir()
                .then((response) => {

                    let isSetHeader = false;

                    // Filter interest file from list
                    response.filter((v,i) => {
                        if(v.indexOf(similarFileName) > -1) {
                            this.scanData(v)
                            .then(() => {

                                if(isSetHeader==false) {
                                    // Write header to file
                                    fs.appendFileSync(this.outputFilePath, this.columnHeader);
                                    isSetHeader = true;
                                }

                                // Sort by UNIX timestamp
                                this.db[this.collectionName].find({}, { sort:[["unix","desc"]] }).fetch((success, error) => {
                                    if(success) {
                                        success.forEach((lineObj) => {
                                            fs.appendFileSync(this.outputFilePath, `${lineObj.data}\r\n`);
                                            // console.log(success)
                                        });

                                        this.db.removeCollection(this.collectionName);

                                        resolve()
                                    } else {
                                        reject(error)
                                    }
                                });

                            })
                            .catch((scanErr) => {
                                console.log('Scan data error : ', scanErr);
                                this.db.removeCollection(this.collectionName);
                                reject(scanErr)
                            });
                        }
                    });
                })
                .catch((err) => {
                    console.log('MergeCSV error : ', err)
                    this.db.removeCollection(this.collectionName);
                    reject(err)
                });

            } catch (err) {
                console.error(err);
                this.db.removeCollection(this.collectionName);
                reject(err)
            }
        });
    }
}

module.exports = MergeData;