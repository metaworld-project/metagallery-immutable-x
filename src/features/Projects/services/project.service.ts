import { GetProjectsResponse } from "@imtbl/core-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../AppContext";

type UseListProjectResult = {
  isFetching: boolean;
  data: GetProjectsResponse | undefined;
  error: Error | null;
};
export const useListProjects = (): UseListProjectResult => {
  const [result, setResult] = useState<UseListProjectResult>({
    isFetching: false,
    data: undefined,
    error: null,
  });

  const { walletConnection, client } = useAppContext();

  const getProjects = useCallback(async () => {
    if (!walletConnection) {
      return;
    }

    try {
      setResult((prevState) => ({ ...prevState, isFetching: true }));
      const projects = await client.getProjects(walletConnection.l1Signer);
      setResult((prevState) => ({ ...prevState, isFetching: false, data: projects }));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not fetch projects");
      }
      setResult((prevState) => ({ ...prevState, isFetching: false, error: error as Error }));
      console.log(error);
    }
  }, [walletConnection, client]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return useMemo(() => result, [result]);
};
