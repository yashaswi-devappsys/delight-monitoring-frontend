import type { FileUploadParams, HttpDelParam, HttpGetParam, HttpPostParam, HttpPutParam } from "../constants/model/network";
import rsAxiosInstance from "./AxiosConfig";

const httpGet = ({ path, queryParams = null }: HttpGetParam) => {

  return new Promise((resolve, reject) => {
    rsAxiosInstance
      .get(path, {
        headers: {
          "Content-Type": "application/json",
        },
        params: queryParams,
      })
      .then((res) => {

        return resolve(res);
      })
      .catch((e) => {
        console.error(e.message);
        // toast({ title: e.message, variant: 'error' });
        reject(e.message);
      }); //TODO : send formatted message
  });
};

const httpPut = ({ path, queryParams = null, body = null }: HttpPutParam) => {
  return new Promise((resolve, reject) => {
    rsAxiosInstance
      .put(path, body, {
        headers: {
          "Content-Type": "application/json",
        },
        params: queryParams,
      })
      .then((res) => {
        return resolve(res);
      })
      .catch((e) => {
        console.error(e);
        reject(e.message);
      });
  });
};

const httpPost = ({ path, queryParams = null, body = null }: HttpPostParam) => {

  return new Promise((resolve, reject) => {
    rsAxiosInstance
      .post(path, body, {
        headers: {
          "Content-Type": "application/json",
        },
        params: queryParams,
      })
      .then((res) => {
        return resolve(res);
      })
      .catch((e) => {
        console.error(e);
        reject(e.message);
      }); //TODO : send formatted message
  });
};

const httpDel = ({ path, queryParams = null }: HttpDelParam) => {
  return new Promise((resolve, reject) => {
    rsAxiosInstance
      .delete(path, {
        headers: {
          "Content-Type": "application/json",
        },
        params: queryParams,
      })
      .then((res) => {
        return resolve(res);
      })
      .catch((e) => {
        console.error(e.message);
        // toast({ title: e.message, variant: 'error' });
        reject(e.message);
      }); //TODO : send formatted message
  });
};

const httpPatch = ({ path, body = null, queryParams = null }: HttpPostParam) => {
  return new Promise((resolve, reject) => {
    rsAxiosInstance
      .patch(path, body, {
        headers: {
          "Content-Type": "application/json",
        },
        params: queryParams,
      })
      .then((res) => resolve(res))
      .catch((e) => {
        console.error(e);
        reject(e.message);
      });
  });
};

const httpUpload = ({
  path,
  queryParams = null,
  file,
  fieldName = "file",
  extraData = {},
}: FileUploadParams) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    if (file) {
      formData.append(fieldName, file);
    }

    // append additional fields
    for (const key in extraData) {
      formData.append(key, extraData[key]);
    }

    rsAxiosInstance
      .post(path, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: queryParams,
      })
      .then((res) => resolve(res))
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
};

const AxiosHelper = {
  httpGet,
  httpPost,
  httpPut,
  httpDel,
  httpPatch,
  httpUpload,

};

export default AxiosHelper;
