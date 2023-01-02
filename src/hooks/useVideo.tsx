import { useRef, useEffect, MutableRefObject } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";

interface VideoProps {
  options?: VideoJsPlayerOptions;
  plugins: string[];
}

const DEFAULT_OPTIONS: VideoJsPlayerOptions = {};

/**
 * video js 사용을 위한 커스텀 훅
 * @param  [options]
 *         video js options
 * @param {Array} [plugins]
 *         string array for video js plugins,
 * @returns {Object} { player: videojs player }
 */
const useVideo = ({ options, plugins = [] }: VideoProps) => {
  const playerRef = useRef<VideoJsPlayer | null>(null);

  useEffect(() => {
    // 초기 video.js initialize
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      const player = (playerRef.current = videojs(
        videoElement,
        { ...DEFAULT_OPTIONS, ...options },
        () => {
          plugins.forEach((plugin) => {
            if (player.hasOwnProperty(plugin)) {
              (player as any)[plugin]();
            } else {
              videojs.log.warn(`${plugin} plugin not found`);
            }
          });
        }
      ));
    }
  }, [options]);

  useEffect(() => {
    // player clean up
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return {
    player: playerRef.current,
  };
};

export default useVideo;
