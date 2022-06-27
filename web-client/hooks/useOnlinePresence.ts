import { setDoc, doc, getFirestore } from "firebase/firestore";
import { useCallback, useEffect, useRef } from "react";
import { firebaseApp } from "../utils/firebaseClient";

const db = getFirestore(firebaseApp);

const DEFAULT_POLLING_INTERVAL = 5_000;

const useOnlinePresence = (props: {
  uid?: string;
  currentSong: string | null;
  isPlaying: boolean;
}) => {
  const { isPlaying, uid, currentSong } = props;
  const timeoutRef = useRef<NodeJS.Timer | null>();

  const updatePlaybackStatus = useCallback(
    (uid: string, playbackId: string, interval: number) => {
      const id = setTimeout(async () => {
        try {
          await setDoc(
            doc(db, "users", uid),
            {
              last_seen: new Date(),
              playback_id: playbackId,
            },
            { merge: true }
          );
          // if success, have a normal interval
          updatePlaybackStatus(uid, playbackId, DEFAULT_POLLING_INTERVAL);
        } catch (error) {
          console.error(error, `couldn't upsert user`);
          // backoff delay in case of error
          updatePlaybackStatus(uid, playbackId, interval + interval * 0.5);
        }
      }, interval);
      timeoutRef.current = id;
    },
    []
  );

  useEffect(
    function longPollPlaybackStatus() {
      // do not update when not playing anything or has paused
      if (!uid || !currentSong || !isPlaying) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = null;
        return;
      }
      // this will cancel the current timeout (if any) on any change in playback
      // and then trigger a timeout again
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      updatePlaybackStatus(uid, currentSong, DEFAULT_POLLING_INTERVAL);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSong, isPlaying, uid]
  );
};

export default useOnlinePresence;
