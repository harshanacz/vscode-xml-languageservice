import { XMLDataV1 } from '../../xmlLanguageTypes.js';

export const xmlData: XMLDataV1 = {
	version: 1.1,
	tags: [
		{
			name: '?xml',
			description: 'XML Processing Instruction',
			attributes: [
				{ name: 'version', values: [{ name: '1.0' }, { name: '1.1' }] },
				{ name: 'encoding', values: [{ name: 'UTF-8' }, { name: 'ISO-8859-1' }, { name: 'US-ASCII' }] },
				{ name: 'standalone', values: [{ name: 'yes' }, { name: 'no' }] }
			],
			void: true
		},
		{
			name: 'root',
			description: 'A generic root element.',
			attributes: []
		},
		{
			name: 'element',
			description: 'A generic XML element.',
			attributes: []
		}
	],
	globalAttributes: [
		{ name: 'id', description: 'A unique identifier for the element.' }
	]
};
