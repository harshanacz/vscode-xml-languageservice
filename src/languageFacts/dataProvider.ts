import { IXMLDataProvider, ITagData, IAttributeData, IValueData, XMLDataV1 } from '../xmlLanguageTypes.js';

export class XMLDataProvider implements IXMLDataProvider {
	private _id: string;
	private _tags: ITagData[] = [];
	private _attributes: IAttributeData[] = [];
	private _valueSets: { [name: string]: IValueData[] } = {};

	constructor(id: string, customData: XMLDataV1) {
		this._id = id;
		this._tags = customData.tags || [];
		this._attributes = customData.globalAttributes || [];
		if (customData.valueSets) {
			customData.valueSets.forEach(vs => {
				this._valueSets[vs.name] = vs.values;
			});
		}
	}

	getId() {
		return this._id;
	}

	isApplicable(languageId: string) {
		return true;
	}

	provideTags() {
		return this._tags;
	}

	provideAttributes(tag: string) {
		const t = this._tags.find(t => t.name === tag);
		const tagAttrs = t ? (t.attributes || []) : [];
		return [...this._attributes, ...tagAttrs];
	}

	provideValues(tag: string, attribute: string) {
		const attrs = this.provideAttributes(tag);
		const attr = attrs.find(a => a.name === attribute);
		if (attr) {
			if (attr.values) {
				return attr.values;
			}
			if (attr.valueSet && this._valueSets[attr.valueSet]) {
				return this._valueSets[attr.valueSet];
			}
		}
		return [];
	}
}
