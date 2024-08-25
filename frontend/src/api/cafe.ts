import { ICafeCreationAttributes, ICafeDeleteAttributes, ICafeGetAttributes, ICafeUpdateAttributes } from "@shared/interfaces/ICafe";
import api from "./base";

export class CafeNotFoundError extends Error {}

export const fetchCafes = async (location?: string) => {
  try {
    const response = await api.get<ICafeGetAttributes[]>(`/cafe`, { params: { location } });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postCafe = async (data: ICafeCreationAttributes) => {
  try {
    const response = await api.post<ICafeCreationAttributes>(`/cafe`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const putCafe = async (data: ICafeUpdateAttributes) => {
  try {
    const response = await api.put<ICafeCreationAttributes>(`/cafe`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCafe = async (data: ICafeDeleteAttributes) => {
  try {
    const response = await api.delete<ICafeDeleteAttributes>(`/cafe`, { data });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
