const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://yoo:Tema1212$@cluster0.qv49xwr.mongodb.net/jobtracker?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const users = await db.collection('users').find().toArray();
    
    console.log('Users found:', users.length);
    users.forEach(user => {
      console.log('Email:', user.email, 'Role:', user.role);
    });
    
    process.exit();
  })
  .catch(err => {
    console.log('Error:', err);
    process.exit();
  });
