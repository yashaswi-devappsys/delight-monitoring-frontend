import secureLocalStorageImport from "react-secure-storage";

type SecureStorageValue = string | number | boolean | object;

interface SecureStorageApi {
    setItem: (key: string, value: SecureStorageValue) => void;
    getItem: (key: string) => SecureStorageValue | null;
    removeItem: (key: string) => void;
    clear: () => void;
}

// react-secure-storage is published as CommonJS. Some Vite versions expose
// that CommonJS default as `{ default: storage }` at runtime.
const storageModule = secureLocalStorageImport as unknown as SecureStorageApi & {
    default?: SecureStorageApi;
};

const secureLocalStorage =
    typeof storageModule.getItem === "function"
        ? storageModule
        : storageModule.default;

if (!secureLocalStorage || typeof secureLocalStorage.getItem !== "function") {
    throw new Error("react-secure-storage failed to initialize");
}

const setItem = (key: string, value: SecureStorageValue) => {
    secureLocalStorage.setItem(key, value);
};

const getItem = (key: string) => {
    return secureLocalStorage.getItem(key);
};

const getList = (key: string) => {
    const tempData = secureLocalStorage.getItem(key);
    return tempData ?? [];
};

const removeItem = (key: string) => {
    secureLocalStorage.removeItem(key);
};

const clearAll = () => {
    secureLocalStorage.clear();
};

const SecureStorage = {
    setItem,
    getItem,
    getList,
    removeItem,
    clearAll,
};

export default SecureStorage;
