import { useRef, useEffect } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";

interface VideoProps {
  videoTarget: HTMLElement | null;
  options?: VideoJsPlayerOptions;
  plugins?: string[];
}

const DEFAULT_OPTIONS: VideoJsPlayerOptions = {};

/**
 * video js 사용을 위한 커스텀 훅
 * @param  [options]
 *         video js options
 * @param {Array} [plugins]
 *         string array for video js plugins,
 * @param {Node} [videoTarget]
 *                video js DOM Element
 * @returns {Object} { player: videojs player }
 */
const useVideo = ({ options, videoTarget, plugins = [] }: VideoProps) => {
  const playerRef = useRef<VideoJsPlayer | null>(null);

  const initializeVideo = () => {
    if (videoTarget === null) return;

    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-fill");
    videoTarget.appendChild(videoElement);

    const player = (playerRef.current = videojs(
      videoElement,
      { ...DEFAULT_OPTIONS, ...options },
      () => {
        console.log("플레이어 인스턴스 생성..");
        plugins.forEach((plugin) => {
          // eslint-disable-next-line no-prototype-builtins
          if (player.hasOwnProperty(plugin)) {
            (player as any)[plugin]();
          } else {
            videojs.log.warn(`${plugin} plugin not found`);
          }
        });
      }
    ));
  };

  const playerCleanUp = (cb?: () => void) => {
    const player = playerRef.current;
    if (player && !player.isDisposed()) {
      player.dispose();
      playerRef.current = null;
      if (cb) cb();
    }
  };

  const playerReset = () => {
    playerCleanUp();
    initializeVideo();
  };

  useEffect(() => {
    // 초기 video.js initialize
    if (!playerRef.current) {
      initializeVideo();
    }
  }, [options, videoTarget]);

  useEffect(() => {
    // player clean up
    return () => {
      playerCleanUp();
    };
  }, [playerRef]);

  return {
    player: playerRef.current,
    playerReset,
  };
};

export default useVideo;
