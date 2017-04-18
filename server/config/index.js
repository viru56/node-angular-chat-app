module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'connecting-people',
  MONGODB_URI: process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/connectingPeople'
};
