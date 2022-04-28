import axios from "axios";
import {BACKEND_URL} from "@/config";


export const API = axios.create({
    baseURL: BACKEND_URL + '/api/v1',
    headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
    },
})

