const axios = require('axios');
async function validateIpAddress(ip) {
    const response=await axios.get(`http://localhost:3000/manage/checkip/${ip}`);
    return response.data;
}
module.exports = { validateIpAddress };
