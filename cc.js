const fs = require('fs');
const https = require('https');

// Replace this with your desired country number
const num = 1;
const countryList = [
    "US", "JP", "IT", "KR", "FR", "DE", "TW", "RU", "GB", "NL",
    "CZ", "TR", "AT", "CH", "ES", "CA", "SE", "IL", "PL", "IR",
    "NO", "RO", "IN", "VN", "BE", "BR", "BG", "ID", "DK", "AR",
    "MX", "FI", "CN", "CL", "ZA", "SK", "HU", "IE", "EG", "TH",
    "UA", "RS", "HK", "GR", "PT", "LV", "SG", "IS", "MY", "CO",
    "TN", "EE", "DO", "SI", "EC", "LT", "PS", "NZ", "BD", "PA",
    "MD", "NI", "MT", "TT", "SA", "HR", "CY", "PK", "AE", "KZ",
    "KW", "VE", "GE", "ME", "SV", "LU", "CW", "PR", "CR", "BY",
    "AL", "LI", "BA", "PY", "PH", "FO", "GT", "NP", "PE", "UY",
    "-", "AD", "AG", "AM", "AO", "AU", "AW", "AZ", "BB",
    "BQ", "BS", "BW", "CG", "CI", "DZ", "FJ", "GA", "GG", "GL",
    "GP", "GU", "GY", "HN", "JE", "JM", "JO", "KE", "KH", "KN",
    "KY", "LA", "LB", "LK", "MA", "MG", "MK", "MN", "MO", "MQ",
    "MU", "NA", "NC", "NG", "QA", "RE", "SD", "SN", "SR", "ST",
    "SY", "TZ", "UG", "UZ", "VC", "BJ"
];

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
};

// Function to make a GET request
function getRequest(url) {
    return new Promise((resolve, reject) => {
        const options = { headers };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}

async function main() {
    const country = countryList[num - 1];

    try {
        // First request to get the last page number
        const res = await getRequest(`https://www.insecam.org/en/bycountry/${country}`);
        const lastPageMatch = res.match(/pagenavigator\("\?page=", (\d+)/);

        if (!lastPageMatch) {
            console.log("Unable to find the last page number.");
            return;
        }

        const lastPage = parseInt(lastPageMatch[1], 10);

        // Get a random page number
        const page = Math.floor(Math.random() * lastPage);

        const pageRes = await getRequest(`https://www.insecam.org/en/bycountry/${country}/?page=${page}`);
        const ipMatches = pageRes.match(/http:\/\/\d+\.\d+\.\d+\.\d+:\d+/g);

        if (ipMatches && ipMatches.length > 0) {
            const randomIp = ipMatches[Math.floor(Math.random() * ipMatches.length)];
            console.log(randomIp);
        } else {
            console.log("No IP addresses found for the selected country.");
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
}

main();

// Visitor count functionality
const visitorFile = 'count/visitor_count.txt';

function updateVisitorCount() {
    let count = 0;

    if (fs.existsSync(visitorFile)) {
        const data = fs.readFileSync(visitorFile, 'utf8');
        count = parseInt(data, 10) || 0;
    }

    count++;
    fs.writeFileSync(visitorFile, count.toString());
    console.log(`Total visitors: ${count}`);
}

updateVisitorCount();
