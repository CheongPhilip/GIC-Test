import { queryOptions } from "@tanstack/react-query";
import { fetchEmployee, fetchEmployeeById } from "../../api/employee";

export const employeesQueryOptions = (cafe: string) => {
  const queryKey = ["employee"];
  if (cafe) {
    queryKey.push(cafe);
  }
  return queryOptions({
    queryKey,
    queryFn: () => fetchEmployee(cafe),
  });
};

export const employeeQueryOptions = ({ id }: { id: string }) => {
  // Return default value if id is not valid
  const queryKey = ["employee"];
  queryKey.push(id);
  // Return query options if id is valid
  return queryOptions({
    queryKey,
    queryFn: () => fetchEmployeeById(id),
  });
};
