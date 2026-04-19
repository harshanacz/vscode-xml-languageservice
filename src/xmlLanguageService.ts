import { createScanner } from './parser/xmlScanner.js';
import { XMLParser } from './parser/xmlParser.js';
import { XMLDataManager } from './languageFacts/xmlDataManager.js';
import { XMLDataProvider } from './languageFacts/dataProvider.js';
import { xmlData } from './languageFacts/data/xmlData.js';
import {
	Scanner, XMLDocument, IXMLDataProvider, LanguageServiceOptions,
	TextDocument, Position, CompletionList, Hover, Range,
	DocumentHighlight, DocumentLink, SymbolInformation, TextEdit,
	FormattingOptions, WorkspaceEdit, SelectionRange, ColorInformation, ColorPresentation,
	DocumentSymbol, FoldingRange
} from './xmlLanguageTypes.js';

export * from './xmlLanguageTypes.js';

export interface LanguageService {
	setDataProviders(useDefaultDataProvider: boolean, customDataProviders: IXMLDataProvider[]): void;
	createScanner(input: string, initialOffset?: number): Scanner;
	parseXMLDocument(document: TextDocument): XMLDocument;
	doComplete(document: TextDocument, position: Position, xmlDocument: XMLDocument): CompletionList;
	doHover(document: TextDocument, position: Position, xmlDocument: XMLDocument): Hover | null;
	format(document: TextDocument, range: Range, options: FormattingOptions): TextEdit[];
	findDocumentSymbols(document: TextDocument, xmlDocument: XMLDocument): SymbolInformation[];
	findDocumentHighlights(document: TextDocument, position: Position, xmlDocument: XMLDocument): DocumentHighlight[];
	findDocumentLinks(document: TextDocument, documentContext: any): DocumentLink[];
	doRename(document: TextDocument, position: Position, newName: string, xmlDocument: XMLDocument): WorkspaceEdit | null;
	getFoldingRanges(document: TextDocument, context?: { rangeLimit?: number }): FoldingRange[];
	getSelectionRanges(document: TextDocument, positions: Position[]): SelectionRange[];
	findDocumentColors(document: TextDocument): ColorInformation[];
	getColorPresentations(document: TextDocument, xmlDocument: XMLDocument, color: any, range: Range): ColorPresentation[];
}

export function getLanguageService(options?: LanguageServiceOptions): LanguageService {
	const dataManager = new XMLDataManager(options || {});
	const parser = new XMLParser(dataManager);
	
	// Mock dependencies for now
	const xmlCompletion = { doComplete: (d: any, p: any, x: any) => ({ isIncomplete: false, items: [] }) };
	const xmlHover = { doHover: (d: any, p: any, x: any) => null };
	const xmlFormatter = { format: (d: any, r: any, o: any) => [] };
	
	return {
		setDataProviders: dataManager.setDataProviders.bind(dataManager),
		createScanner,
		parseXMLDocument: parser.parseDocument.bind(parser),
		doComplete: xmlCompletion.doComplete,
		doHover: xmlHover.doHover,
		format: xmlFormatter.format,
		findDocumentSymbols: (document, xmlDocument) => [],
		findDocumentHighlights: (document, position, xmlDocument) => [],
		findDocumentLinks: (document, documentContext) => [],
		doRename: (document, position, newName, xmlDocument) => null,
		getFoldingRanges: (document, context) => [],
		getSelectionRanges: (document, positions) => [],
		findDocumentColors: (document) => [],
		getColorPresentations: (document, xmlDocument, color, range) => []
	};
}

export function newXMLDataProvider(id: string, customData: any): IXMLDataProvider {
	return new XMLDataProvider(id, customData);
}

export function getDefaultXMLDataProvider(): IXMLDataProvider {
	return newXMLDataProvider('xml-default', xmlData);
}
