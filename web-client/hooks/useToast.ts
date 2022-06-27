import { useToast as chakraUseToast, UseToastOptions } from "@chakra-ui/react";
const useToast = () => {
  const t = chakraUseToast();
  return {
    success: (opts: UseToastOptions) => t({ ...opts, status: "success" }),
    error: (opts: UseToastOptions) => t({ ...opts, status: "error" }),
    info: (opts: UseToastOptions) => t({ ...opts, status: "info" }),
    t,
  };
};
export default useToast;
