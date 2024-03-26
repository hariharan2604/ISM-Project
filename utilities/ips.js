const axios = require('axios');
async function validateIpAddress(ip,data,sign) {
    const response = await axios.post(`http://localhost:3000/manage/checkip`, {
        ip:ip,data:data,sign:sign
    });
    return response.data;
}
module.exports = { validateIpAddress };
