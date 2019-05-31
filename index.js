var https = require('https');

exports.handler = async function (event, context) {
    function doRequest(url) {
        return new Promise(function (resolve, reject) {
            console.log('URL', url);
            https.get(url, (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    resolve(JSON.parse(data));
                });

            }).on("error", (err) => {
                reject(err);
            });
        });
    }
    // Set ticker from event object
    const ticker = event.ticker;
    // Set productCode from event object
    const productCode = event.productCode;

    // If ticker is set, use ticker value to find the corresponding fund
    if (ticker) {
        const URL = `https://fund-service-bucket.s3.amazonaws.com/funddata.json`;
        const fundRecords = await doRequest(URL);
        const fund = fundRecords.filter(function (item) {
            return item.ticker == ticker;
        });
        return fund[0];
    } else if (productCode) {
        // If productCode is set, use productCode value to find the corresponding fund
        const URL = `https://fund-service-bucket.s3.amazonaws.com/funddata.json`;
        const fundRecords = await doRequest(URL);
        const fund = fundRecords.filter(function (item) {
            return item.productCode == productCode;
        });
        return fund[0];
    } else {
        return {
            body: "please provide a search term"
        };

    }
};