import { ResponseObject } from "../types/helpers";

const responseObject = ({
  success,
  message,
  data,
  errors,
  accessToken,
  refreshToken,
  pagination,
}: ResponseObject) => {
  return {
    success,
    message,
    data,
    errors,
    accessToken,
    refreshToken,
    pagination,
  };
};

export default responseObject;