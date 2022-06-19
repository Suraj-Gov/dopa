import axios, { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { jsSongI } from "../../types/jioSaavn";

type handlers = {
  onQueryStart?: () => void;
  onSuccess?: (data: AxiosResponse<jsSongI, any>) => void;
};

const usePlaybackDetails = (
  id: string | null,
  key?: any[],
  handlers?: handlers
) =>
  useQuery(
    ["playback", id, ...(key ?? [])],
    async () => {
      handlers?.onQueryStart && handlers.onQueryStart();
      // setPlaybackTimestamp(0);
      return await axios.get<jsSongI>(`/song/${id}`);
    },
    {
      enabled: !!id,
      onSuccess: handlers?.onSuccess,
    }
  );

export default usePlaybackDetails;
