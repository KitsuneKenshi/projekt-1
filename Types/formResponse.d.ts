export default interface FormResponse {
    statusCode: 200 | 201 | 400 | 401 | 403 | 404 | 500;
    statusMessage: string;
    data?: any;
}