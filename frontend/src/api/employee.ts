import {
  IEmployeeCreationAttributes,
  IEmployeeDeleteAttributes,
  IEmployeeGetAttributes,
  IEmployeeUpdateAttributes,
} from "@shared/interfaces/IEmployee";
import api from "./base";

export class EmployeeNotFoundError extends Error {}

export const fetchEmployee = async (cafe?: string) => {
  try {
    const response = await api.get<IEmployeeGetAttributes[]>(`/employee`, { params: { cafe } });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchEmployeeById = async (id: string) => {
  try {
    const response = await api.get<IEmployeeGetAttributes>(`/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postEmployee = async (data: IEmployeeCreationAttributes) => {
  try {
    const response = await api.post<IEmployeeCreationAttributes>(`/employee`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const putEmployee = async (data: IEmployeeUpdateAttributes) => {
  try {
    const response = await api.put<IEmployeeCreationAttributes>(`/employee`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteEmployee = async (data: IEmployeeDeleteAttributes) => {
  try {
    const response = await api.delete<IEmployeeDeleteAttributes>(`/employee`, { data });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
