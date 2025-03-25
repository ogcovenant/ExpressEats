import { ResponseObject } from "../types/helpers";

const responseObject = ({
  success,
  message,
  data,
  errors,
  accessToken,
  pagination,
}: ResponseObject) => {
  return {
    success,
    message,
    data,
    errors,
    accessToken,
    pagination,
  };
};

export default responseObject;