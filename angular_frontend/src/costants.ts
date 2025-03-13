
const iconURL = "\\assets\\icons"
const imagesURL = "\\assets\\images"
const BACKEND_URL_PREFIX = "http://localhost:8080"
const s3Prefix = BACKEND_URL_PREFIX + "/api/s3/"; //"https://s3.eu-south-1.amazonaws.com/lab-utumana/";
const prefixUrl = "http://localhost:4200"

const defaultProfilePictureUrl = "/assets/icons/profile.png";

const LATEST_UPLOADS_LIMIT = 20;
const MAX_NUMBER_OF_PHOTOS_PER_ACCOMMODATION = 10;

export default iconURL;
export { 
    iconURL, imagesURL, BACKEND_URL_PREFIX, s3Prefix, prefixUrl, 
    defaultProfilePictureUrl, 
    LATEST_UPLOADS_LIMIT,  MAX_NUMBER_OF_PHOTOS_PER_ACCOMMODATION 
};
