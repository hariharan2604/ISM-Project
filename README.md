copy .env.dev to .env
change db credentials in .env
npm install
sequelize-cli db:migrate
npm run start
UDP test is in utilities/iot_sim.js
