import { queryOptions } from "@tanstack/react-query";
import { fetchCafes } from "../../api/cafe";

export const cafesQueryOptions = (location: string) => {
  const queryKey = ["cafe"];
  if (location) {
    queryKey.push(location);
  }
  return queryOptions({
    queryKey,
    queryFn: () => fetchCafes(location),
  });
};
