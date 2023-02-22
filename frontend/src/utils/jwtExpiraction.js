import jwt_decode from "jwt-decode";


export const isJwtExpired = () => {
    let token = localStorage.getItem('token');
    let decodedToken = jwt_decode(token);
    let currentDate = new Date();
  
    // JWT exp is in seconds
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
       return true;
    } else {
       return false;
    }
}