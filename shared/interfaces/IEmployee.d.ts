import { EGender } from "../constants/enums";
export interface IEmployeeCreationAttributes {
    name: string;
    email_address: string;
    phone_number: string;
    gender: EGender;
    cafe_id?: string | null;
}
export interface IEmployeeUpdateAttributes extends IEmployeeCreationAttributes {
    id: string;
    gender: EGender;
}
export interface IEmployeeGetAttributes extends Omit<IEmployeeUpdateAttributes, "gender"> {
    cafe: string;
    days_worked: number;
}
export interface IEmployeeDeleteAttributes extends Pick<IEmployeeGetAttributes, "id"> {
}
