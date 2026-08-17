import type { InternalAxiosRequestConfig } from "axios";
import { useEffect, useState, type ReactNode } from "react";
import rsAxiosInstance from "./AxiosConfig";
import { useAppDispatch } from "../hooks/useRedux";
import { sessionExpired } from "../redux/slice/auth/authSlice";
import SecureStorage from "../utils/SecureStorage";
import { LSK_REFRESH_TOKEN, LSK_TOKEN } from "../constants/local-storage-constants";
import { EMAIL_NOT_VERIFIED, KEY_X_AUTH_TOKEN, KEY_X_REFRESH_TOKEN, MOBILE_NOT_VERIFIED } from "../constants/api-constants";
import { ResponseType } from "../constants/model/network";

const OPEN_URL_LIST = ["auth/login", "auth/register"];
const AUTHENTICATE = "auth/login";
const REFRESH_TOKEN = "auth/reissue-token";
const LOGOUT = "auth/logout";
const TEMP_TOKEN_URL_LIST = ["auth/register"];
const VALIDATE_OTP = "";

const AxiosInterceptor = ({ children }: { children: ReactNode }) => {
    const [isInterceptorReady, setIsInterceptorReady] = useState(false);
    const dispatch = useAppDispatch();

    const handleServerError = (error: any) => {
        let message = "";
        let responseData: any = null;
        if (
            error &&
            error.response &&
            error.response.data
        ) {
            responseData = error.response.data;
        }

        if (responseData?.message) {
            message = responseData.message;
        } else if (error.message) {
            message = error.message;
        } else {
            message = "Unknown Error";
        }

        // toast({ description: message });

        const apiError = Error(message) as Error & { response?: any; data?: any; errors?: any };
        apiError.response = error.response;
        apiError.data = responseData;
        apiError.errors = responseData?.errors;
        return apiError;
    };

    useEffect(() => {
        let isRefreshing: boolean; // Track whether a token refresh is in progress
        let refreshSubscribers: any[] = []; // Array to hold the pending API requests

        const reqInterceptor = rsAxiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig<any>) => {
                const token = SecureStorage.getItem(LSK_TOKEN);
                const refreshToken = SecureStorage.getItem(LSK_REFRESH_TOKEN);
                // console.log(`[Interceptor] Outgoing request to ${config.url}`);


                // open url list will be excluded


                if (config && config.url) {
                    if (!OPEN_URL_LIST.includes(config.url) && token) {
                        config.headers["Authorization"] = `Bearer ${token}`;
                    }

                    // if (config.url && !config.headers["Content-Type"]) {
                    //     config.headers["Content-Type"] = "application/json";
                    // }
                    if (config.data instanceof FormData) {
                        delete config.headers["Content-Type"];
                    } else if (!config.headers["Content-Type"]) {
                        config.headers["Content-Type"] = "application/json";
                    }
                }
                if (config.url === LOGOUT) {
                    config.headers["X-Refresh-Token"] = refreshToken;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const resInterceptor = rsAxiosInstance.interceptors.response.use(
            (response): any => {
                const { config, data } = response;


                if (!config || !data)
                    return Promise.reject(Error("Something went wrong"));

                if (!config.url) return Promise.reject(Error("Something went wrong"));

                if (data.status) {

                    switch (config.url) {
                        case AUTHENTICATE: {
                            if (data.data?.[KEY_X_AUTH_TOKEN]) {
                                SecureStorage.setItem(LSK_TOKEN, data.data[KEY_X_AUTH_TOKEN])
                            }
                            if (data.data?.[KEY_X_REFRESH_TOKEN]) {
                                SecureStorage.setItem(LSK_REFRESH_TOKEN, data.data[KEY_X_REFRESH_TOKEN])
                            }

                            //set logged in
                            // SecureStorage.setItem(LSK_IS_LOGGED_IN, true)

                            if (data.data) {
                                delete data.data[KEY_X_AUTH_TOKEN]
                                delete data.data[KEY_X_REFRESH_TOKEN]
                            }
                            break
                        }
                        case VALIDATE_OTP: {
                            SecureStorage.setItem(LSK_TOKEN, data.data[KEY_X_AUTH_TOKEN])
                            SecureStorage.setItem(LSK_REFRESH_TOKEN, data.data[KEY_X_REFRESH_TOKEN])
                            delete data.data[KEY_X_AUTH_TOKEN]
                            delete data.data[KEY_X_REFRESH_TOKEN]
                            break
                        }
                        case REFRESH_TOKEN: {
                            SecureStorage.setItem(LSK_TOKEN, data.data[KEY_X_AUTH_TOKEN])
                            SecureStorage.setItem(LSK_REFRESH_TOKEN, data.data[KEY_X_REFRESH_TOKEN])

                            delete data.data[KEY_X_AUTH_TOKEN]
                            break
                        }
                        default:
                            break;
                    }

                    if (TEMP_TOKEN_URL_LIST.includes(config.url)) {
                        // console.log("TEMP_TOKEN_URL_LIST", data.data);

                        SecureStorage.setItem(LSK_TOKEN, data.data[KEY_X_AUTH_TOKEN]);
                        SecureStorage.setItem(LSK_REFRESH_TOKEN, data.data[KEY_X_REFRESH_TOKEN])
                        delete data.data[KEY_X_AUTH_TOKEN]
                        delete data.data[KEY_X_REFRESH_TOKEN]
                    }

                }

                if (data.status === MOBILE_NOT_VERIFIED || data.status === EMAIL_NOT_VERIFIED) {
                    if (config.url === AUTHENTICATE) {
                        SecureStorage.setItem(LSK_TOKEN, data.data);
                    }
                }

                // In case of file api, return response body as it is
                // if (data instanceof ArrayBuffer) {
                //     return Promise.resolve(data)
                // }
                // if (data instanceof Blob) {
                //     return Promise.resolve(data)
                // }

                if (data instanceof ArrayBuffer || data instanceof Blob) {
                    return response; // Keep full response including headers
                }

                const res = new ResponseType(data);
                // console.log("ResponseType :  ", res);
                if (!res.isSuccess) {
                    // toast({ title: res.message }); // handled errors will be shown here
                } else {
                    // toast({ description: res.message }); // handled errors will be shown here

                }

                return Promise.resolve(res);
            },
            async (error) => {
                if (!error.response) {
                    return Promise.reject(handleServerError(error));
                }

                const originalRequest = error.config;

                const reqUrl = error.response.config.url;

                if (
                    error.response.status === 401 &&
                    !originalRequest._retry &&
                    reqUrl !== REFRESH_TOKEN &&
                    !OPEN_URL_LIST.includes(reqUrl)
                ) {
                    originalRequest._retry = true;

                    const retryOriginalRequest = new Promise((resolve) => {
                        refreshSubscribers.push(() =>
                            resolve(rsAxiosInstance(originalRequest))
                        );
                    });

                    if (!isRefreshing) {
                        isRefreshing = true;

                        try {
                            // const body = {
                            //     refreshToken: SecureStorage.getItem(LSK_REFRESH_TOKEN),
                            // };

                            const refreshToken = SecureStorage.getItem(LSK_REFRESH_TOKEN);

                            await rsAxiosInstance.post(REFRESH_TOKEN, null, {
                                headers: {
                                    "X-Refresh-Token": refreshToken?.toString(),
                                },
                            });


                            refreshSubscribers.forEach((subscriber) => subscriber());
                            refreshSubscribers = [];
                        } catch {
                            SecureStorage.clearAll();
                            dispatch(sessionExpired());
                        }

                        isRefreshing = false;
                    }

                    return retryOriginalRequest;
                }

                // Return any other error response
                return Promise.reject(handleServerError(error));
            }
        );

        setIsInterceptorReady(true);

        return () => {
            rsAxiosInstance.interceptors.request.eject(reqInterceptor);
            rsAxiosInstance.interceptors.response.eject(resInterceptor);
        };
    }, [dispatch]);

    return isInterceptorReady ? children : null;
};

export default AxiosInterceptor;
