const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
const BASE_URL = 'http://localhost:5001';

async function testFlow() {
    console.log('--- Starting Automated Flow Test ---');
    try {
        // 1. Shorten a URL
        console.log('\n[1] Testing POST /api/shorten');
        const randomString = Math.random().toString(36).substring(2, 7);
        const testCode = `test${randomString}`;
        const shortenRes = await axios.post(`${API_URL}/shorten`, {
            url: 'https://github.com/nuraalamnaim',
            customCode: testCode
        });
        console.log('Success!', shortenRes.data);
        const { shortCode } = shortenRes.data;

        // 2. Fetch URLs for Table
        console.log('\n[2] Testing GET /api/urls');
        const urlsRes = await axios.get(`${API_URL}/urls`);
        console.log('Success! Total URLs found:', urlsRes.data.total);

        // 3. Test Redirect (should return 302 and redirect to GitHub)
        console.log(`\n[3] Testing Redirect GET /${shortCode}`);
        try {
            await axios.get(`${BASE_URL}/${shortCode}`, { maxRedirects: 0 });
        } catch (error) {
            if (error.response && error.response.status === 302) {
                console.log('Success! Redirects to:', error.response.headers.location);
            } else {
                throw error;
            }
        }

        // 4. Check Stats (Click should be 1)
        console.log(`\n[4] Testing Stats GET /api/stats/${shortCode}`);
        const statsRes = await axios.get(`${API_URL}/stats/${shortCode}`);
        console.log(`Success! Click Count: ${statsRes.data.click_count}`);
        console.log(`Recent Logs: ${statsRes.data.recent_logs.length}`);

        // 5. Test Deletion
        console.log(`\n[5] Testing DELETE /api/urls/${shortCode}`);
        const delRes = await axios.delete(`${API_URL}/urls/${shortCode}`);
        console.log('Success!', delRes.data);

        console.log('\n--- All Tests Passed Successfully! ---');
    } catch (error) {
        console.error('\nTest Failed:', error.response ? error.response.data : error.message);
    }
}

testFlow();
