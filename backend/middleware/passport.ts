import express from 'express';

// serialization of user obj
app.use(
  passport.serializeUser((user, done) => {
    done(null, user._id);
  })
);

app.use(
  passport.deserializeUser((_email, done) => {
    // myDB ops...
    done(null, null);
  })
);
