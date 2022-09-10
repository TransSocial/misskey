import { Inject, Injectable } from '@nestjs/common';
import { getJsonSchema } from '@/services/chart/core.js';
import { driveChart } from '@/services/chart/index.js';
import { Endpoint } from '@/server/api/endpoint-base.js';

export const meta = {
	tags: ['charts', 'drive'],

	res: getJsonSchema(driveChart.schema),

	allowGet: true,
	cacheSec: 60 * 60,
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		span: { type: 'string', enum: ['day', 'hour'] },
		limit: { type: 'integer', minimum: 1, maximum: 500, default: 30 },
		offset: { type: 'integer', nullable: true, default: null },
	},
	required: ['span'],
} as const;

// eslint-disable-next-line import/no-default-export
@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> {
	constructor(
		@Inject('notesRepository')
    private notesRepository: typeof Notes,
	) {
		super(meta, paramDef, async (ps, user) => {
			return await driveChart.getChart(ps.span, ps.limit, ps.offset ? new Date(ps.offset) : null);
		});
	}
}
