export interface ICafeCreationAttributes {
    name: string;
    description: string;
    location: string;
    logo?: string;
}
export interface ICafeUpdateAttributes extends Omit<ICafeCreationAttributes, "cafeEmployee"> {
    id: string;
}
export interface ICafeGetAttributes extends ICafeUpdateAttributes {
    employees: number;
}
export interface ICafeDeleteAttributes extends Pick<ICafeGetAttributes, "id"> {
}
