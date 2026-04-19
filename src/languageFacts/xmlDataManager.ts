import { IXMLDataProvider, ITagData, IAttributeData, IValueData, LanguageServiceOptions } from '../xmlLanguageTypes.js';
import { XMLDataProvider } from './dataProvider.js';
import { xmlData } from './data/xmlData.js';
import * as arrays from '../utils/arrays.js';

export class XMLDataManager {
	private dataProviders: IXMLDataProvider[] = [];

	constructor(options: LanguageServiceOptions) {
		this.setDataProviders(options.useDefaultDataProvider !== false, options.customDataProviders || []);
	}

	setDataProviders(builtIn: boolean, providers: IXMLDataProvider[]) {
		this.dataProviders = [];
		if (builtIn) {
			this.dataProviders.push(new XMLDataProvider('xml-default', xmlData));
		}
		this.dataProviders.push(...providers);
	}

	getDataProviders() {
		return this.dataProviders;
	}

	isVoidElement(e: string, voidElements: string[]) {
		return !!e && arrays.binarySearch(voidElements, e.toLowerCase(), (s1: string, s2: string) => s1.localeCompare(s2)) >= 0;
	}

	getVoidElements(languageId: string): string[];
	getVoidElements(dataProviders: IXMLDataProvider[]): string[];
	getVoidElements(languageOrProviders: string | IXMLDataProvider[]): string[] {
		const dataProviders = Array.isArray(languageOrProviders) ? languageOrProviders : this.getDataProviders().filter(p => p.isApplicable(languageOrProviders!));
		const voidTags: string[] = [];
		dataProviders.forEach((provider) => {
			provider.provideTags().filter(tag => tag.void).forEach(tag => voidTags.push(tag.name));
		});
		return voidTags.sort();
	}

	getTags(): ITagData[] {
		const tags: ITagData[] = [];
		this.dataProviders.forEach((provider) => {
			tags.push(...provider.provideTags());
		});
		return tags;
	}

	getAttributes(tag: string): IAttributeData[] {
		const attributes: IAttributeData[] = [];
		this.dataProviders.forEach((provider) => {
			attributes.push(...provider.provideAttributes(tag));
		});
		return attributes;
	}

	getValues(tag: string, attribute: string): IValueData[] {
		const values: IValueData[] = [];
		this.dataProviders.forEach((provider) => {
			values.push(...provider.provideValues(tag, attribute));
		});
		return values;
	}
}
