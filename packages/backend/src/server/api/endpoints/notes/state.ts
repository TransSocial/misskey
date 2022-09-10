import { NoteFavorites, Notes, NoteThreadMutings, NoteWatchings } from '@/models/index.js';
import { Inject, Injectable } from '@nestjs/common';
import { Endpoint } from '@/server/api/endpoint-base.js';

export const meta = {
	tags: ['notes'],

	requireCredential: true,

	res: {
		type: 'object',
		optional: false, nullable: false,
		properties: {
			isFavorited: {
				type: 'boolean',
				optional: false, nullable: false,
			},
			isWatching: {
				type: 'boolean',
				optional: false, nullable: false,
			},
			isMutedThread: {
				type: 'boolean',
				optional: false, nullable: false,
			},
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		noteId: { type: 'string', format: 'misskey:id' },
	},
	required: ['noteId'],
} as const;

// eslint-disable-next-line import/no-default-export
@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> {
	constructor(
		@Inject('notesRepository')
    private notesRepository: typeof Notes,
	) {
		super(meta, paramDef, async (ps, user) => {
	const note = await Notes.findOneByOrFail({ id: ps.noteId });

	const [favorite, watching, threadMuting] = await Promise.all([
		NoteFavorites.count({
			where: {
				userId: user.id,
				noteId: note.id,
			},
			take: 1,
		}),
		NoteWatchings.count({
			where: {
				userId: user.id,
				noteId: note.id,
			},
			take: 1,
		}),
		NoteThreadMutings.count({
			where: {
				userId: user.id,
				threadId: note.threadId || note.id,
			},
			take: 1,
		}),
	]);

	return {
		isFavorited: favorite !== 0,
		isWatching: watching !== 0,
		isMutedThread: threadMuting !== 0,
	};
});
