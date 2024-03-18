const RegisteredIP  = require('../models/RegisteredIP'); // Assuming you have a RegisteredIP model defined

class IPController {
    async registerIP(req, res) {
        const { ip } = req.body;

        try {
            // Check if the IP address is already registered
            const existingIP = await RegisteredIP.findOne({ where: { ip } });

            if (existingIP) {
                return res.status(400).json({ error: 'IP address already registered' });
            }

            // If the IP is not already registered, create a new record in the database
            const newIP = await RegisteredIP.create({
                ip: ip
            });

            res.status(201).json(newIP); // Respond with the registered IP data
        } catch (error) {
            console.error('Error registering IP address:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async checkIP(req, res) {
        const { ip } = req.params.ip;

        try {
            // Check if the IP address is registered
            const existingIP = await RegisteredIP.findOne({ where: { ip } });

            // Send true if the IP address is registered, otherwise send false
            res.json({ exists: !!existingIP });
        } catch (error) {
            console.error('Error checking IP address:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = IPController;
