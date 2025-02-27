
const iconURL = "\\assets\\icons"
const imagesURL = "\\assets\\images"
const BACKEND_URL_PREFIX = "http://localhost:8080"
const s3Prefix = BACKEND_URL_PREFIX + "/api/s3/"; //"https://s3.eu-south-1.amazonaws.com/lab-utumana/";
const prefixUrl = "http://localhost:4200"

const LATEST_UPLOADS_LIMIT = 20;

export default iconURL;
export { iconURL, imagesURL, prefixUrl, BACKEND_URL_PREFIX, LATEST_UPLOADS_LIMIT, s3Prefix };
