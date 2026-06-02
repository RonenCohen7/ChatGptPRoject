import axios from  "axios"
import { appConfig } from "./AppConfig"




export const http = axios.create({
    baseURL: appConfig.baseUrl,
    headers: {
        "Content-Type": "application/json"
    }
})
