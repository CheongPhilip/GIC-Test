// import { EGender } from "../../utils/enums";

// export interface IEmployeeCreationAttributes {
//   name: string;
//   email_address: string;
//   phone_number: string;
//   gender: EGender;
//   cafeEmployee?: {
//     cafe_id: string;
//     start_date: Date;
//   } | null;
// }

// export interface IEmployeeUpdateAttributes extends Omit<IEmployeeCreationAttributes, "cafeEmployee"> {
//   id: string;
//   cafeEmployee?: {
//     cafe_id: string;
//     start_date: Date;
//   } | null;
// }

// export interface IEmployeeGetAttributes extends Omit<IEmployeeUpdateAttributes, "cafeEmployee" | "gender"> {
//   cafe: string;
// }

// export interface IEmployeeDeleteAttributes extends Pick<IEmployeeGetAttributes, "id"> {}
