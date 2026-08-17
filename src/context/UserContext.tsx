import React, { createContext, useContext, useEffect } from "react";
import { LSK_IS_LOGGED_IN, LSK_USER_DETAILS } from "../constants/local-storage-constants";
import SecureStorage from "../utils/SecureStorage";
import type { TUser } from "../constants/model/user";
import AxiosHelper from "../network/AxiosHelper";

interface UserContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    logout: () => void;
    userData: any
    setUserData: (user: TUser) => void;
    // NOTE : Additionally userType and user data can be kept here
}

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export const useUserContext = () => {
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return userContext;
};

export const UserProvider = ({ children }: any) => {
    const [isLoggedIn, _setIsLoggedIn] = React.useState(() => {
        const tempIsLoggedIn = SecureStorage.getItem(LSK_IS_LOGGED_IN);
        return +(tempIsLoggedIn ?? 0) === 1;
    });
    const [userData, _setUserData] = React.useState(() => {
        const tempUserData = SecureStorage.getItem(LSK_USER_DETAILS);
        if (typeof tempUserData !== "string") return {};

        try {
            return JSON.parse(tempUserData);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return {};
        }
    });

    const setIsLoggedIn = (value: boolean) => {
        // console.log("[UserContext] setIsLoggedIn called:", value);
        SecureStorage.setItem(LSK_IS_LOGGED_IN, +value)
        _setIsLoggedIn(value)
    }

    const setUserData = (value: any) => {
        // console.log("[UserContext] setUserData called:", value);
        SecureStorage.setItem(LSK_USER_DETAILS, JSON.stringify(value));

        _setUserData(value)
    }

    // const logout = () => {
    //     console.log("[UserContext] logout called");
    //     SecureStorage.clearAll();
    //     _setIsLoggedIn(false);
    // };

    const logout = async () => {
        try {
        //   console.log("[UserContext] logout called");
      
          // Call the actual logout API
          await AxiosHelper.httpPost({
            path: "auth/logout", // This will trigger interceptor to add refresh token
            body: null,
          });
      
        } catch (error) {
          console.error("Logout API failed:", error);
          // (Optional) Show toast or log error
        } finally {
          // Always clear local storage and update state
          SecureStorage.clearAll();
          _setIsLoggedIn(false);
        }
      };

    useEffect(() => {
        const tempIsLoggedIn = SecureStorage.getItem(LSK_IS_LOGGED_IN);
        _setIsLoggedIn(+(tempIsLoggedIn ?? 0) === 1);
    }, []);

    useEffect(() => {
        const tempUserData = SecureStorage.getItem(LSK_USER_DETAILS);
        // console.log("[UserContext] Loaded raw userData from storage:", tempUserData);
        if (typeof tempUserData === 'string') {
            try {
                const parsedUserData = JSON.parse(tempUserData);
                // console.log("[UserContext] Parsed userData:", parsedUserData);
                _setUserData(parsedUserData); // Set it to the state
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    const contextValue: UserContextType = {
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        logout,
    };

    return (
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    );
};
