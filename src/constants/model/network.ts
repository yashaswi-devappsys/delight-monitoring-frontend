export interface HttpGetParam {
    path: string,
    queryParams?: any
}

export interface HttpPostParam {
    path: string,
    queryParams?: any,
    body?: any
}

export interface HttpPutParam {
    path: string,
    queryParams?: any,
    body?: any
}

export interface HttpDelParam {
    path: string,
    queryParams?: any
}

export interface FileUploadParams {
    path: string;
    queryParams?: any;
    file?: File | null;
    fieldName?: string; // default "file"
    extraData?: Record<string, any>;
}

export class ResponseType {
    status: boolean
    data: any
    message: string
    errors: any[];


    constructor({
        status,
        success,
        data = null,
        message = '',
        errors = [],

    }: {
        status?: boolean;
        success?: boolean;
        data?: any;
        message?: string;
        errors?: any[];
    }) {
        this.status = status ?? success ?? false
        this.data = data
        this.message = message
        this.errors = errors;

    }

    get isSuccess() {
        return this.status
    }
}
