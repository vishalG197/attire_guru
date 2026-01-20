import axios, { AxiosResponse } from "axios"
import { GET_PRODUCT } from "./actionType"
import { DispatchType } from "../Types";
import { Product } from "../Types";
import { API_ENDPOINTS } from "../../config/api";


const url = API_ENDPOINTS.PRODUCTS;




export const getProduct = async (queryObj: any) => {
    return await axios.get(`${url}`, queryObj);

};

export const getParticularProduct = async (endpoint: string, queryObj: any) => {
    return await axios.get(`${url}?category=${endpoint}`, queryObj)
}

export const getSingleProduct = async (id: any) => {
    return await axios.get(`${url}/${id}`)

}

export const editProduct = async (id: any, newobj: any) => {
    return await axios.patch(`${url}/${id}`, newobj)
}


export const deleteProduct = async (id: any) => {
    return await axios.delete(`${url}/${id}`)
}


export const addNewProduct = async (newData: any) => {
    return await axios.post(`${url}`, newData)
}

export const querySearch = async (query: string) => {
    return await axios.get(`${url}?q=${query}`)
}


export const reqLogin = async () => {
    return await axios.get(API_ENDPOINTS.USERS)
}

export const reqUsers = async () => {
    return await axios.get(API_ENDPOINTS.USERS)
}

export const reqOrders = async () => {
    return await axios.get(API_ENDPOINTS.ORDERS)
}

export const deleteUser = async (id: any) => {
    return await axios.delete(`${API_ENDPOINTS.USERS}/${id}`)
}

export const deleteOrder = async (id: any) => {
    return await axios.delete(`${API_ENDPOINTS.ORDERS}/${id}`)
}

export const updateOrderStatus = async (id: any, status: string) => {
    return await axios.patch(`${API_ENDPOINTS.ORDERS}/${id}`, { status });
}

export const getSingleUser = async (id: any) => {
    return await axios.get(`${API_ENDPOINTS.USERS}/${id}`);
}

export const updateUser = async (id: any, data: any) => {
    return await axios.patch(`${API_ENDPOINTS.USERS}/${id}`, data);
}

export const getSingleOrder = async (id: any) => {
    return await axios.get(`${API_ENDPOINTS.ORDERS}/${id}`);
}