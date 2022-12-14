import '../../styles/tailwind.css';

import React from 'react';
import {
    AbsoluteFill, Img, interpolate, measureSpring, spring, useCurrentFrame, useVideoConfig
} from 'remotion';

export type GithubResponse = {
  login: string;
  avatar_url: string;
  followers: number;
};
export const GithubDemo: React.FC<{
  data: GithubResponse | null;
}> = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
  });

  const springDur = measureSpring({ fps, config: { damping: 200 } });

  const titleTranslation = interpolate(progress, [0, 1], [700, 0]);
  const subtitleOpacity = interpolate(
    frame,
    [springDur + 15, springDur + 40],
    [0, 1]
  );

  return (
    <AbsoluteFill className="bg-red-500 justify-center items-center">
      <div className="flex flex-row items-center">
        <Img
          src={data?.avatar_url}
          style={{
            borderRadius: 150,
            height: 300,
            width: 300,
            transform: `scale(${progress})`,
          }}
        />
        <div style={{ width: 60 }} />
        <div>
          <h1 style={{ transform: `translateY(${titleTranslation}px)` }}>
            Hi {data?.login}!
          </h1>
          <p style={{ opacity: subtitleOpacity }}>
            You have {data?.followers} followers.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
