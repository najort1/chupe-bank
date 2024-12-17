import axios from "axios";

export const doRequest = async (url, method, data, headers = { 'Content-Type': 'application/json' }) => {
    try {
        const response = await axios({
            method: method,
            url: url,
            data: data,
            headers: headers,
            validateStatus: function (status) {
                return status <= 500;
            }
        });
        return response;
    } catch (error) {
        return error;
    }
}