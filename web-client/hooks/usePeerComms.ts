import { useToast } from "@chakra-ui/react";
import Peer, { DataConnection } from "peerjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { throttle } from "throttle-debounce";
import { playbackActions } from "../slices/playbackSlice";
import { playbackPayloadDataT } from "../types";

const PING_INTERVAL = 20;
const TRANSMISSION_INTERVAL = 60;
const PRESET_OFFSET_SEC = PING_INTERVAL / 1000 / 2;

const usePeerComms = (props: {
  uid?: string;
  rUid?: string;
  onPlaybackTimestampChange: (tz: number, isBoolean?: boolean) => void;
}) => {
  const { rUid, uid, onPlaybackTimestampChange } = props;

  const isPeerLibLoaded = useRef(false);
  const peerRef = useRef<Peer>();
  const remotePeerConnRef = useRef<DataConnection>();
  const remoteListenerConnRef = useRef<DataConnection>();

  const lastReqTz = useRef(Date.now());
  const rttMs = useRef(0);
  const pingIntervalRef = useRef<NodeJS.Timer>();

  const toast = useToast();
  const dispatch = useDispatch();

  const initializePeerConnection = useCallback(async () => {
    if (isPeerLibLoaded.current || !uid) {
      return;
    }
    const PeerJS = (await import("peerjs")).default;
    isPeerLibLoaded.current = true;
    peerRef.current = new PeerJS(uid, {
      host:
        process.env.NODE_ENV === "production"
          ? "dopa-server.fly.dev"
          : "localhost",
      port: 3005,
      path: "/peer",
    });
    peerRef.current.on("open", (_id) => {
      toast({
        title: "Open for listeners!",
        variant: "subtle",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const syncWithPayload = useCallback(
    (payload: playbackPayloadDataT) => {
      dispatch(playbackActions.remoteSync(payload));
      const remoteTz = payload.tzSec + rttMs.current / 10;
      onPlaybackTimestampChange(remoteTz, true);
    },
    [dispatch, onPlaybackTimestampChange]
  );

  const receivePayload = useCallback(() => {
    const r = remotePeerConnRef.current;
    r?.on("data", (d) => {
      if (d === "pong") {
        const now = Date.now();
        // half of rtt is the ping required from remote to listener
        const diff = (now - lastReqTz.current) / 2;
        rttMs.current = diff + 0.016;
        return;
      }
      const payload = d as playbackPayloadDataT;
      syncWithPayload(payload);
    });
  }, [syncWithPayload]);

  const ackPings = useCallback(() => {
    const conn = remoteListenerConnRef.current;

    conn?.on("data", (d) => {
      if (d === "ping") {
        conn.send("pong");
      }
    });
  }, []);

  const receiveConnections = useCallback(async () => {
    peerRef.current?.on("connection", (conn) => {
      remoteListenerConnRef.current = conn;
      toast({
        title: "You got a listener!",
        variant: "subtle",
        duration: 2_000,
      });
      conn.on("open", ackPings);
    });
  }, [ackPings, toast]);

  const connectToRUid = useCallback(async () => {
    if (!rUid) {
      return;
    }
    remotePeerConnRef.current = peerRef.current?.connect(rUid);
    const r = remotePeerConnRef.current;

    const startPings = () => {
      r?.send("ping");
      const now = Date.now();
      lastReqTz.current = now;
    };

    r?.on("open", () => {
      startPings();
      pingIntervalRef.current = setInterval(startPings, PING_INTERVAL);
      receivePayload();
    });
  }, [rUid, receivePayload]);

  const sendToRUid = useMemo(
    () =>
      throttle(TRANSMISSION_INTERVAL, (payload: playbackPayloadDataT) => {
        if (rUid) return;
        console.log(Date.now(), payload.tzSec);
        remoteListenerConnRef.current?.send(payload);
      }),
    [rUid]
  );

  useEffect(() => {
    initializePeerConnection().then(receiveConnections).then(connectToRUid);
    return () => {
      if (pingIntervalRef.current) clearInterval();
    };
  }, [rUid, initializePeerConnection, connectToRUid, receiveConnections]);

  return {
    sendToRUid,
    rttMs: rttMs.current,
  };
};

export default usePeerComms;
