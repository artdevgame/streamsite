import fs from 'fs';
import os from 'os';
import path from 'path';

import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';

import { webpackOverride } from '../remotion/webpack-override';

import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ params, request }) => {
  // const { name } = params;

  const userData = {
    avatar_url: 'https://avatars.githubusercontent.com/u/353729?v=4',
    login: 'artdevgame',
    followers: 24,
  };

  try {
    //   if (!userData) {
    //     const gitHubResponse = await fetch(
    //       `https://api.github.com/users/${name}`
    //     );

    //     if (gitHubResponse.status === 403) {
    //       throw new Error(
    //         'GitHub API rate limit exceeded please try again later'
    //       );
    //     }

    //     if (gitHubResponse.status !== 200) {
    //       throw new Error(
    //         `Could not find GitHub user with name ${name}. \nMake sure you have the right name in the url!`
    //       );
    //     }

    //     const githubJson = await gitHubResponse.json();

    //     userData = {
    //       avatar_url: githubJson.avatar_url,
    //       login: githubJson.login,
    //       followers: githubJson.followers,
    //     };
    //   }

    const compositionId = 'GitHub';
    const inputProps = { data: userData };

    const bundleLocation = await bundle(
      path.resolve(__dirname, '../app/remotion/index.tsx'),
      () => undefined,
      { webpackOverride }
    );

    console.log({ bundleLocation });

    const compositions = await getCompositions(bundleLocation, { inputProps });
    const composition = compositions.find((c) => c.id === compositionId);

    if (!composition) {
      throw new Error(`No video called ${compositionId}`);
    }

    const tmpDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'remotion-')
    );

    const outputLocation = path.join(tmpDir, 'out.mp4');

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation,
      inputProps,
    });

    const fileStats = fs.statSync(outputLocation);
    const readstream = fs.createReadStream(
      outputLocation
    ) as unknown as ReadableStream;

    const response = new Response(readstream, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    });

    return response;
  } catch (err: unknown) {
    console.error(err);
    throw new Response((err as Error).message ?? 'Unknown Error', {
      status: 500,
    });
  }
};
