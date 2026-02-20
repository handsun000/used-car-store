const http = require('http');

// 1. Verify Frontend
const checkFrontend = () => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/',
            method: 'HEAD'
        }, (res) => {
            console.log(`Frontend (localhost:3000): ${res.statusCode}`);
            resolve(res.statusCode);
        });
        req.on('error', (e) => {
            console.error(`Frontend Error: ${e.message}`);
            resolve(false); // Resolve false instead of reject to continue
        });
        req.end();
    });
};

// 2. Verify Backend Search (Public)
const checkBackendSearch = () => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 8080,
            path: '/api/v1/cars/search',
            method: 'GET'
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Backend Search (/api/v1/cars/search): ${res.statusCode}`);
                console.log(`Body: ${data}`);
                resolve(res.statusCode === 200);
            });
        });
        req.on('error', (e) => {
            console.error(`Backend Search Error: ${e.message}`);
            resolve(false);
        });
        req.end();
    });
};

// 3. Verify Backend Login
const checkBackendLogin = () => {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            email: 'admin@mycar.com',
            password: 'admin1234'
        });

        const req = http.request({
            hostname: 'localhost',
            port: 8080,
            path: '/api/v1/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Backend Login (/api/v1/auth/login): ${res.statusCode}`);
                console.log(`Body: ${data}`);
                resolve(res.statusCode === 200);
            });
        });
        req.on('error', (e) => {
            console.error(`Backend Login Error: ${e.message}`);
            resolve(false);
        });
        req.write(postData);
        req.end();
    });
};

async function run() {
    console.log("--- Starting Full Stack Verification ---");
    await checkFrontend();
    await checkBackendSearch();
    await checkBackendLogin();
    console.log("--- Finished ---");
}

run();
