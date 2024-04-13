const Service = require("./index");
const ServiceInstance = new Service();

export { default as ensureLogin, loginAfterRedirect } from "./hzLogin.lib";


export default ServiceInstance;
