import axios, { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { jsSongI } from "../../types/jioSaavn";

const usePlaybackDetails = (
  id: string | null,
  onQueryStart?: () => void,
  onSuccess?: (data: AxiosResponse<jsSongI, any>) => void
) =>
  useQuery(
    ["playback", id],
    async () => {
      onQueryStart && onQueryStart();
      // setPlaybackTimestamp(0);
      return await axios.get<jsSongI>(`/song/${id}`);
    },
    {
      enabled: !!id,
      onSuccess,
    }
  );

export default usePlaybackDetails;
