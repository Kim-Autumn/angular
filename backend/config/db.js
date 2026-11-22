const mongoose = require('mongoose');

const DEFAULT_URI =
  'mongodb+srv://thayhoweb_db_user:Tuong29042011@cluster0.uafqmya.mongodb.net/bhshop?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    let rawUri =
      process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_URI;

    // Làm sạch khoảng trắng và dấu nháy kép / nháy đơn nếu copy paste nhầm trên Render
    let uri = String(rawUri).trim().replace(/^["']|["']$/g, '');

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      console.warn(
        `[MongoDB] URI không hợp lệ: "${uri}". Tự động chuyển sang DEFAULT_URI của MongoDB Atlas.`
      );
      uri = DEFAULT_URI;
    }

    const conn = await mongoose.connect(uri);
    console.log(
      `[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`
    );
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
