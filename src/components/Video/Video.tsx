/* eslint-disable react/display-name */
import React, { CSSProperties, useRef, useEffect, useState } from "react";
import { VideoJsPlayerOptions } from "video.js";
import useVideo from "@/hooks/useVideo";

interface VideoProps {
  sources: VideoJsPlayerOptions["sources"];
  styles?: CSSProperties;
  videoOptions?: Omit<VideoJsPlayerOptions, "sources">;
}

const Video = React.forwardRef<HTMLDivElement | null, VideoProps>(
  ({ sources, styles, videoOptions }, refs) => {
    const videoRef = useRef<HTMLDivElement | null>(null);
    const [target, setTarget] = useState<HTMLDivElement | null>(
      videoRef.current
    );
    const { player, playerReset } = useVideo({
      videoTarget: target,
      options: { sources, ...videoOptions },
    });

    useEffect(() => {
      if (player) playerReset();
    }, [sources]);

    useEffect(() => {
      if (videoRef.current) {
        setTarget(videoRef.current);
        playerReset();
      }
    }, [videoRef]);

    return (
      <div ref={refs}>
        <div ref={videoRef} style={styles} />
      </div>
    );
  }
);

export default Video;
