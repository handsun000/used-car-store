
const axios = require('axios');
const FormData = require('form-data'); // You might need to install this or use native fetch if node version > 18
const fs = require('fs');
const path = require('path');

async function verifyCarRegistration() {
    const API_URL = 'http://localhost:8080';

    // 1. Login
    console.log('Logging in...');
    let token;
    try {
        const loginRes = await axios.post(`${API_URL}/api/v1/auth/login`, {
            email: 'admin@mycar.com',
            password: 'admin1234'
        });
        token = loginRes.data.accessToken;
        console.log('Login successful. Token obtained.');
    } catch (error) {
        console.error('Login failed full error:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        return;
    }

    // 2. Register Car
    console.log('Attempting to register car...');
    const form = new FormData();

    // Create dummy image
    const imagePath = path.join(__dirname, 'test_image.jpg');
    if (!fs.existsSync(imagePath)) {
        fs.writeFileSync(imagePath, 'dummy image content');
    }

    const carData = {
        brand: 'TestBrand',
        modelName: 'TestModel',
        productionYear: 2023,
        mileage: 1000,
        price: 2000,
        fuelType: 'GASOLINE',
        transmission: 'AUTOMATIC',
        accidentHistory: false,
        description: 'Test Description'
    };

    // Append carRequest as Blob/JSON with correct content-type
    // In Node's form-data, we can specify options
    form.append('carRequest', JSON.stringify(carData), {
        contentType: 'application/json'
    });

    // Append image
    form.append('images', fs.createReadStream(imagePath));

    try {
        const registerRes = await axios.post(`${API_URL}/api/v1/cars`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Car registration successful!', registerRes.status, registerRes.data);
    } catch (error) {
        console.error('Car registration failed:', error.response ? error.response.data : error.message);
    } finally {
        // Cleanup
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
}

verifyCarRegistration();
