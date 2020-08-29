const fs = require('fs');
const path = require('path');
const moment = require('moment');

class DataTemplateMapping {
    constructor(){

        // Ex. Raw data
        // {
        //     "Meta Data": {
        //         "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        //         "2. Symbol": "MSFT",
        //         "3. Last Refreshed": "2020-03-13",
        //         "4. Output Size": "Full size",
        //         "5. Time Zone": "US/Eastern"
        //     },
        //     "Time Series (Daily)": {
        //         "2020-03-13": {
        //             "1. open": "147.5000",
        //             "2. high": "161.9100",
        //             "3. low": "140.7300",
        //             "4. close": "158.8300",
        //             "5. volume": "88316120"
        //         },
        //         ...
        //     }
        // }

        this.filePath = null;
        this.outputFilePath = null;

        this.template = {
            'Meta Data':{
                '1. Information': 'Daily Prices (open, high, low, close) and Volumes',
                '2. Symbol': '',
                '3. Last Refreshed': '',
                '4. Output Size': 'Full size',
                '5. Time Zone': ''
            },
            'Time Series (Daily)': {
    
            }
        }
        this.jsonContent = {...this.template};
    }

    getTemplate() { return this.template }

    setCSVFileName(fname) {
        this.filePath = path.resolve(__dirname, `../merged/${fname}.csv`);
        this.outputFilePath = path.resolve(__dirname, `../public/${fname}.json`);
    }

    clearOutputFile() {
        if (fs.existsSync(this.outputFilePath)) {
            // file exists
            fs.unlinkSync(this.outputFilePath);
        }
    }

    mapping() {
        return new Promise((resolve, reject) => {
            this.clearOutputFile();

            try {
                
                // read contents of the file
                const data = fs.readFileSync(this.filePath, 'UTF-8');

                // split the contents by new line
                const lines = data.split(/\r?\n/);

                // print all lines
                lines.forEach((line, lineIndex) => {
                    console.log(line);

                    if(line.length<2) return false;

                    if(lineIndex>0) {
                        let lineObj = line.replace(/","/g, '\";\"').replace(/"/g, '').split(';');
                        console.log(lineObj);
                        let volCol = lineObj[5];
                        let volume = 0;
                        
                        if(volCol) {
                            if (volCol.indexOf('K') > -1) {
                                volume = parseFloat(volCol.replace('K', '')) * 1000
                            } else if (volCol.indexOf('B') > -1) {
                                volume = parseFloat(volCol.replace('B', '')) * 1000000
                            } else if (volCol.indexOf('-') > -1) {
                                volume = 0
                            } else {
                                volume = parseFloat(volCol);
                            }
                        }

                        let ts = moment((lineObj[0]), "MMM DD, YYYY").format('YYYY-MM-DD');

                        if(lineIndex==1){
                            this.jsonContent['Meta Data']['3. Last Refreshed'] = ts;
                        }

                        let tmpData = {
                            '1. open': lineObj[2].replace(',', ''),
                            '2. high': lineObj[3].replace(',', ''),
                            '3. low': lineObj[4].replace(',', ''),
                            '4. close': lineObj[1].replace(',', ''),
                            '5. volume': volume.toString()
                        }

                        // if(lineIndex==1) {
                        //     console.log(line);
                        //     console.log(lineObj);
                        //     console.log(`Timestamp "${ts}" : `, tmpData);
                        // }
                        console.log(`Timestamp "${ts}" : `, tmpData);

                        this.jsonContent['Time Series (Daily)'][ts] = tmpData;
                    }
                });


                fs.writeFile(this.outputFilePath, JSON.stringify(this.jsonContent, null, 4), 'utf8', function (err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        // return console.log(err);
                        reject({ error:err, data:null });
                    }
                
                    console.log("JSON file has been saved.");
                    resolve({ error:null, data:'JSON file has been saved.' })
                });

            } catch (err) {
                console.error(err);
            }
        });
    }
}

module.exports = DataTemplateMapping;