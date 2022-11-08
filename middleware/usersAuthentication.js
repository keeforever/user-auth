const { isValidJWT, attachedCookiesResponse } = require("../utils");
const CustomError = require("../errors");
const Token = require("../model/Token");

const usersAuthentication = async (req, res, next) => {
  const accessToken = req.signedCookies.accessToken;
  const refreshToken = req.signedCookies.refreshToken;

  if (accessToken) {
    try {
      const payload = isValidJWT(accessToken);
      req.user = payload;
      next();
      return;
    } catch (error) {
      throw new CustomError.UnauthorizedRequestError(
        "Unauthorized request !!!"
      );
    }
  }

  
  if (!refreshToken) {
    throw new CustomError.UnauthorizedRequestError("Unauthorized request !!!");
  }
  
  try {
    const payload = isValidJWT(refreshToken);
    
    const token = await Token.findOne({
      refreshToken: payload.refreshToken,
      user: payload.user.userID,
    });
    
    console.log({
      refreshToken: payload.refreshToken,
      user: payload.user.userID,
    })

    console.log(token)
    if (token.refreshToken !== payload.refreshToken) {
      throw new CustomError.UnauthorizedRequestError(
        "Unauthorized request !!!"
      );
    }
    attachedCookiesResponse({
      res,
      user: payload.user,
      refreshToken: payload.refreshToken,
    });
    req.user = payload.user
    next()
    return
  } catch (error) {
    throw new CustomError.UnauthorizedRequestError("Unauthorized request !!!");
  }
};

module.exports = usersAuthentication;