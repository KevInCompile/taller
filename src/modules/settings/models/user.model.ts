export interface User {
    id:              string;
    email:           string;
    password:        string;
    createdAt:       Date;
    updatedAt:       Date;
    avatar:          string;
    firstName:       string;
    habeas_data:     boolean;
    lastName:        string;
    sessionFacebook: boolean;
    sessionGoogle:   boolean;
    dateOfBirth:     Date;
    phoneNumber:     string;
}
