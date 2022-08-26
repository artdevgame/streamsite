import type { ActionFunction, MetaFunction } from '@remix-run/node';

import { Form, useActionData, useTransition } from '@remix-run/react';

type ActionData = {
	username?: string;
	error?: string;
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const username = formData.get('githubUsername');

	const checkUsernameRequest = await fetch(
		'https://api.github.com/users/' + username
	);

	const validUsername = (await checkUsernameRequest.status) === 200;

	if (checkUsernameRequest.status === 403) {
		return {
			error: 'Github API rate limit exceeded.',
		};
	}

	if (!validUsername) {
		return {
			error: 'Not a valid GitHub username',
		};
	}

	return {
		username,
	};
};

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
	return {
		title: 'Yolo',
		description: 'Yolo',
	};
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
	// const actionData = useActionData<ActionData>();
	const transition = useTransition();

	const actionData = { username: 'artdevgame' };

	return (
		<div>
			<main className="p-8">
				<div>
					<div>
						<h3 className="mb-4">
							Render a custom video with your GitHub Profile
						</h3>
						<Form method="post">
							<input
								type="text"
								name="githubUsername"
								placeholder="Your GitHub Username"
								className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2 w-2/6 sm:text-sm border-gray-300 rounded-md"
							/>
							<button
								type="submit"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Create video
							</button>
							{actionData?.error ? <p>{actionData.error}</p> : null}
						</Form>
						{
							<p>
								{transition.state === 'submitting'
									? 'Checking username...'
									: transition.state === 'loading'
									? 'Generating your video ...'
									: null}
							</p>
						}
					</div>
				</div>
				<div className="mt-4">
					{actionData?.username ? (
						<video
							width={1920 / 2}
							height={1080 / 2}
							src={`/api/video/${actionData?.username}`}
							autoPlay
							muted
							controls
						/>
					) : null}
				</div>
			</main>
		</div>
	);
}
