const jwt = require("jsonwebtoken");
const UserRefreshTokenModel = require("../models/UserRefreshToken.js");
const generateTokens = async (user) => {
  try {
     console.log(user);
     console.log(process.env.JWT_ACCESS_TOKEN_SECRET_KEY)
    const payload = { _id: user._id, roles: user.roles };

    // Generate access token with expiration time
    const accessTokenExp = Math.floor(Date.now() / 1000) + 100; // Set expiration to 100 seconds from creation time
    const accessToken = jwt.sign(
      { ...payload, exp: accessTokenExp },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,

      // { expiresIn: '100s' }
    );

    // Generate refresh token with expiration time

    const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // Set expiration to 5 days from creation time
    const refreshToken = jwt.sign(
      { ...payload, exp: refreshTokenExp },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
       //{ expiresIn: '5d' } no requirement here already included in ./models/userRefreshToken
    );

    const userRefreshToken = await UserRefreshTokenModel.findOneAndDelete({ userId: user._id });

      // if want to blacklist rather than remove then use below code
    // if (userRefreshToken) {
    //   userRefreshToken.blacklisted = true;
    //   await userRefreshToken.save();
    // }

    // Save New Refresh Token
    await new UserRefreshTokenModel({ userId: user._id, token: refreshToken }).save();

    return Promise.resolve({ accessToken, refreshToken, accessTokenExp, refreshTokenExp });
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = generateTokens;