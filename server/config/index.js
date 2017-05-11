module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'connecting-people',
  MONGODB_URI: process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/connectingPeople',
  GoogleAuth: {
    clientID: '712665716616-fs9mh6o8qtfto3ekg1vh3rvgp080qnog.apps.googleusercontent.com',
    clientSecret: 'gn3DRu36Nv4n05u6ueFCSudZ',
    callbackURL: 'http://localhost:4200/auth/google/callback',
    profileFields: ['id', 'email', 'name','photos','profileUrl','gender','displayName'],
  },
  FacebookAuth: {
    clientID: '289317454860186',
    clientSecret: 'ab28990bc75ea5c305443b7ec08c242e',
    callbackURL: 'http://localhost:4200/auth/facebook/callback',
    profileFields: ['id', 'email', 'name','photos','profileUrl','gender','displayName'],
  }
};
