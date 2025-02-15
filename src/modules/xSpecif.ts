/*!	Transformation Library for SpecIF data for import to and export from the internal data structure.
	Dependencies: jQuery 3.5+
	(C)copyright enso managers gmbh (http://enso-managers.de)
	Author: se@enso-managers.de, Berlin
	License and terms of use: Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
	We appreciate any correction, comment or contribution as Github issue (https://github.com/enso-managers/SpecIF-Tools/issues)
*/

class CSpecifItemNames {
	// SpecIF item names for all supported import versions 
	rClasses: string;
	sClasses: string;
	hClasses?: string;
	pClasses: string;
	sbjClasses: string;
	objClasses: string;
	rClass: string;
	sClass: string;
	hClass?: string;
	pClass: string;
	rs: string;
	sts: string;
	r: string;
	nds: string;
	frct: string;
	minI: string;
	maxI: string;
	constructor(ver: string) {
		switch (ver) {
			/* still some mapping needed for the versions 0.9.x ..
			 * - attribute --> property
			 * - source --> subject
			 * - ..
			case '0.9.2':
				this.rClasses = 'objectTypes';
				this.sClasses = 'relationTypes';
				this.hClasses = 'hierarchyTypes';
				this.pClasses = 'attributeTypes';
				this.sbjClasses = 'sourceTypes';
				this.objClasses = 'targetTypes';
				this.rClass = 'objectType';
				this.sClass = 'relationType';
				this.hClass = 'hierarchyType';
				this.pClass = 'attributeType';
				this.rs = 'objects';
				this.sts = 'relations';
				this.r = 'object';
				break; */
			case '0.10.2':
			case '0.10.3':
				this.rClasses = 'resourceTypes';
				this.sClasses = 'statementTypes';
				this.hClasses = 'hierarchyTypes';
				this.pClasses = 'propertyTypes';
				this.sbjClasses = 'subjectTypes';
				this.objClasses = 'objectTypes';
				this.rClass = 'resourceType';
				this.sClass = 'statementType';
				this.hClass = 'hierarchyType';
				this.pClass = 'propertyType';
				this.rs = 'resources';
				this.sts = 'statements';
				this.r = 'resource';
				break;
			case '0.10.4':
			case '0.10.5':
			case '0.10.6':
			case '0.11.2':
				this.hClasses = 'hierarchyClasses';
				this.hClass = 'class';
				// no break
			default:
				// for v0.10.8, v0.11.8 and v1.0+:
				this.rClasses = 'resourceClasses';
				this.sClasses = 'statementClasses';
				this.pClasses = 'propertyClasses';
				this.sbjClasses = 'subjectClasses';
				this.objClasses = 'objectClasses';
				this.rClass = 'class';
				this.sClass = 'class';
				this.pClass = 'class'
				this.rs = 'resources';
				this.sts = 'statements';
				this.r = 'resource';
		};

		if (typeof (ver) == 'string' && ver.startsWith('0.')) {
			// for all versions <1.0:
			this.frct = 'accuracy';
			this.minI = 'min';
			this.maxI = 'max'
		}
		else {
			// starting SpecIF v1.0:
			this.frct = 'fractionDigits';
			this.minI = 'minInclusive';
			this.maxI = 'maxInclusive'
		};

		let verL = ver.split('.').map(n => parseInt(n));
		if (verL[0] < 1 || verL[0] == 1 && verL[1] < 2) {
			// for all versions < 1.2:
			this.nds = 'hierarchies';
		}
		else {
			// for all versions > 1.1:
			this.nds = 'nodes';
		};
	}
}
class CSpecIF implements SpecIF {
	// Transform a SpecIF data-set of several versions to the internal representation of the SpecIF Viewer/Editor
	// and also transform it back to a SpecIF data-set of the most recent version.
	// @ts-ignore - id is set in toInt()
	id: SpecifId;
	// @ts-ignore - $schema is set in toInt()
	$schema: string;
//	context?: string;
	title?: SpecifMultiLanguageText;
	description?: SpecifMultiLanguageText;
	language?: string;
	generator?: string;
	generatorVersion?: string;
	rights?: SpecifRights;
	createdAt?: SpecifDateTime;
	createdBy?: SpecifCreatedBy;

	dataTypes: SpecifDataType[] = [];
	propertyClasses: SpecifPropertyClass[] = [];
	resourceClasses: SpecifResourceClass[] = [];
	statementClasses: SpecifStatementClass[] = [];
	files: SpecifFile[] = [];
	resources: SpecifResource[] = [];   		// list of resources as referenced by the nodes
	statements: SpecifStatement[] = [];
	nodes: SpecifNode[] = [];    	// listed specifications (aka hierarchies, outlines) of the project.

	constructor() {
	}
	isValid(spD?: any): boolean {
		if (!spD) spD = this;
		if (spD.$schema || ['0.10.2', '0.10.3', '0.10.4', '0.10.5', '0.10.6', '0.10.8', '0.11.2', '0.11.8'].includes(spD.specifVersion))
			return typeof (spD.id) == 'string' && spD.id.length > 0;
		// else
	//	console.warn("Version " + spD.specifVersion + " is not supported.");
		return false;
	}
	private isOntology(specifData: any) {
		return (
			specifData.id.includes("Ontology")
			&& Array.isArray(specifData.title) && specifData.title[0] && specifData.title[0]['text']
			&& specifData.title[0]['text'].includes("Ontology")
		);
	};
	set(spD: any, opts: any): Promise<CSpecIF> {
		return new Promise(
			(resolve, reject) => {
				let msg: resultMsg;
				if (this.isValid(spD)) {
					msg = this.toInt(spD, opts);
					// an error found during import has been logged in this.toInt()
					if (msg.status == 0) {
						if (opts && opts.noCheck) {
							resolve(this)
						}
						else {
							// check *after* transformation:
							this.check(this, opts)
								.then(
									() => { resolve(this) },
									reject
								)
						};
					}
					else
						reject(msg);
				}
				else {
					msg = new resultMsg(999, "SpecIF id is not defined or version is not supported.").warn();
					reject(msg);
                }
			}
		)
	} 
	get(opts?: any): Promise<SpecIF> {
	//	if (opts && opts.v10)
	//		return this.toExt_v10(opts);
		return this.toExt(opts);
	}
	private check(spD: SpecIF, opts: any): Promise<SpecIF> {
		// Check the SpecIF data for schema compliance and consistency;
		return new Promise(
			(resolve, reject) => {

				let checker: any;

				if (this.isValid(spD)) {
					// 1. Get the "official" routine for checking schema and constraints
					//    - where already loaded checking routines are replaced by the newly loaded ones
					//    - use $.ajax() with options since it is more flexible than $.getScript
					//    - the first (relative) URL is for debugging within a local clone of Github
					//    - both of the other (absolute) URLs are for a production environment
					if (spD['$schema'] && !spD['$schema'].includes('v1.0')) {
						// for data sets according to schema v1.1 and later;
						// get the constraint checker locally, if started locally in the debug phase:
						import((window.location.href.startsWith('http') || window.location.href.endsWith('.specif.html')) ?
							'https://specif.de/v' + LIB.versionOf(spD) + '/CCheck.mjs'
							: '../../../SpecIF-Schema/check/CCheck.mjs'
						)
						.then(modChk => {
							// 2. Get the specified schema file:
							getSchema();
							// 3. Instantiate checker:
							checker = new modChk.CCheck();
						})
					//	.catch(handleError);
							.catch((err) => { console.error(err);  reject(new resultMsg(903, 'Schema- and constraint-check nof found.')) });
					}
					else {
						throw "Programming Error: Inexpected check of SpecIF data set < v1.1";
				/*		// for data sets up until schema v1.0;
						// not any more needed, because the import data is checked *after* transformation to v1.1:
						$.ajax({
							dataType: "script",
							cache: true,
							url: 'https://specif.de/v1.0/CCheck.min.js' // older versions are covered by v1.0/check.js
						})
						.done(() => {
							// 2. Get the specified schema file:
							getSchema();
							// 3. Instantiate checker:
							// @ts-ignore - 'CCheck' has just been loaded dynamically:
							checker = new CCheck();
						})
						.fail(handleError); */
					} 
				}
				else {
					reject(new resultMsg( 999, 'No SpecIF data provided for checking' ));
				};
				return;

				function handleResult(xhr: XMLHttpRequest) {
					// @ts-ignore - checkSchema() and checkConstraints() are defined in check.js loaded at runtime
					if (typeof (checker.checkSchema) == 'function' && typeof (checker.checkConstraints) == 'function') {
//						console.debug('schema', xhr);
						// 1. check data against schema:
						let sma = JSON.parse(LIB.ab2str(xhr.response));
						// Override meta-schema until we get to work "https://json-schema.org/draft/2019-09/schema#";
						// the schema check itself does not need the features of the newer one,
						// but a future check of values xs:duration in the constraint-check does:
						sma['$schema'] = "http://json-schema.org/draft-04/schema#";

						// @ts-ignore - checkSchema() is defined in check.js loaded at runtime
						let rc: resultMsg = checker.checkSchema(spD, { schema: sma });
						if (rc.status == 0) {
							// 2. Check further constraints:
							// @ts-ignore - checkConstraints() is defined in check.js loaded at runtime
							rc = checker.checkConstraints(spD, opts);
							if (rc.status == 0) {
								resolve(spD);
								return;
							}
						};
						console.info("The invalid SpecIF data set: ",spD);
						reject(rc);
					}
					else
						throw Error( 'Standard routines checkSchema and/or checkConstraints are not available.' );
				}
			/*	function handleError(xhr: resultMsg) {
					switch (xhr.status) {
						case 404:
							// @ts-ignore - 'specifVersion' is defined for versions <1.0
							let v = spD.specifVersion ? 'version ' + spD.specifVersion : 'with Schema ' + spD['$schema'];
							xhr = new resultMsg ( 903, 'SpecIF ' + v + ' is not supported by this program!' );
						// no break
						default:
							reject(xhr);
					};
				} */
				function getSchema() {
					LIB.httpGet({
						// Get the schema locally, if started locally in the debug phase:
						url: ( window.location.href.startsWith('http') || window.location.href.endsWith('.specif.html') ?
							// @ts-ignore - 'specifVersion' is defined for versions <1.0
							(spD['$schema'] || 'https://specif.de/v' + spD.specifVersion + '/schema')
							: '../../../SpecIF-Schema/schema/schema.json'
						),
						responseType: 'arraybuffer',
						withCredentials: false,
						done: handleResult,
						fail: () => { reject(new resultMsg(903, 'Schema not found')) }
					})
				}
			}
		);
	}
	private toInt(spD: any, opts: any):resultMsg {
	//	if (!this.isValid(spD)) return;

		// Transform SpecIF to internal data;
		// no data of app.projects is modified.
//		console.debug('set',simpleClone(spD));

		// In case of an Ontology, do *not* normalize the terms,
		// also in case of
		if (this.isOntology(spD) || spD.id == "P-DDP-Schema-V20" )
			opts.normalizeTerms = false;

		let self = this,
			names = new CSpecifItemNames(LIB.versionOf(spD));

		console.info("References are imported *without* revision to ascertain that updates of the referenced element do not break the link. "
					+"(References without revision always relate to the latest revision of the referenced element.)");

		// Differences when using forAll() instead of [..].map():
		// - tolerates missing input list (not all are mandatory for SpecIF)
		// - suppresses undefined list items in the result, so in effect forAll() is a combination of .map() and .filter().
		try {
			this.dataTypes = LIB.forAll( spD.dataTypes, dT2int );
			this.propertyClasses = LIB.forAll( spD.propertyClasses, pC2int );
			this.resourceClasses = LIB.forAll( spD[names.rClasses], rC2int );
			this.statementClasses = LIB.forAll(spD[names.sClasses], sC2int);
			// for data-sets <v0.10.8
		//	if (names.hClasses && Array.isArray(spD[names.hClasses]))
			if (names.hClasses)
				this.resourceClasses = this.resourceClasses.concat( LIB.forAll( spD[names.hClasses], hC2int ));
			this.files = LIB.forAll(spD.files, f2int);
			this.resources = LIB.forAll( spD[names.rs], r2int );
			this.statements = LIB.forAll(spD[names.sts], s2int );
			this.nodes = LIB.forAll( spD[names.nds], h2int );

			// Transform data with schema <v1.1.
			// dataType.type: 'xs:enumeration' and 'xhtml' --> 'xs:string';
			// do it here at the end so that the original type is available for the whole transformation:
			this.dataTypes = LIB.forAll( this.dataTypes,
				(dT:SpecifDataType) => {
					switch( dT.type ) {
						// @ts-ignore - can appear in SpecIF <v1.1:
						case 'xs:enumeration':
						// @ts-ignore - can appear in SpecIF <v1.1:
						case "xhtml":
							dT.type = XsDataType.String;
						// If this has become now a redundant dataType, 
						// it will be removed later through 'deduplicate()'.
					};
					return dT;
                }
			);
		}
		catch (e) {
			let txt = "Error when importing the project '" + LIB.displayValueOf(spD.title, {targetLanguage:spD.language||browser.language}) + "': " + e;
			console.error(txt);
		//	message.show(new resultMsg( 999, txt ), { severity: 'danger' });
			return new resultMsg(904, txt); // undefined 
		};

		// header information provided only in case of project creation, but not in case of project update:
		if (spD.rights) this.rights = { title: spD.rights.title, url: spD.rights.url };
		if (spD.generator) this.generator = spD.generator;
		if (spD.generatorVersion) this.generatorVersion = spD.generatorVersion;
		if (spD.createdBy) {
			this.createdBy = spD.createdBy;
			if (spD.createdBy.email && spD.createdBy.email.value)
				// @ts-ignore - that's why we ask ...
				this.createdBy.email = spD.createdBy.email.value;
		};
		if (spD.createdAt) this.createdAt = LIB.addTimezoneIfMissing(spD.createdAt);
		if (spD.description) this.description = makeMultiLanguageText(spD.description);
		if (spD.title) this.title = makeMultiLanguageText(spD.title);
		this.id = spD.id;
		this.$schema = 'https://specif.de/v' + CONFIG.specifVersion + '/schema.json';
	/*	// Namespace for JSON-LD:
		this.context = spD['@Context'] || "http://purl.org/dc/terms/"; */
		return new resultMsg(0, 'SpecIF data has been successfully imported!');

//		console.debug('specif.toInt',simpleClone(this));

		// common for all items:
		function i2int(iE:any) {
			var oE: any = {
				id: iE.id? iE.id.toSpecifId() : undefined, // is required, but we don't want to crash before the schema is checked.
				changedAt: LIB.addTimezoneIfMissing(iE.changedAt || '1970-01-01T00:00:00Z')
			};
			if (iE.description) oE.description = makeMultiLanguageText(iE.description);
			// revision is a number up until v0.10.6 and a string thereafter:
			if (iE.revision) oE.revision = typeof (iE.revision) == 'number' ? iE.revision.toString() : iE.revision;
			if (iE.replaces) oE.replaces = iE.replaces;
			if (iE.changedBy) oE.changedBy = iE.changedBy;
	//		console.debug('item 2int',iE,oE);
			return oE
		}
		// a data type:
		function dT2int(iE:any): SpecifDataType {
			var oE: any = i2int(iE);
			oE.title = makeTitle('propertyClass',iE.title);

			// up until v1.0, there was a special dataType 'xs:enumeration' just for strings,
			// starting v1.1 every dataType except 'xs:boolean' can have enumerated values
			oE.type = iE.type == "xs:enumeration" ? XsDataType.String : iE.type;

			switch (iE.type) {
				case XsDataType.Double:
					oE.fractionDigits = iE[names.frct];
					oE.minInclusive = iE[names.minI];
					oE.maxInclusive = iE[names.maxI];
					break;
				case XsDataType.Integer:
					oE.minInclusive = iE[names.minI];
					oE.maxInclusive = iE[names.maxI];
					break;
				case "xhtml":
					// oE.type "xhtml" will be replaced later on to "xs:string".
					// If this becomes a redundant dataType,
					// it will be removed later through 'deduplicate()'.
					// no break
				case XsDataType.String:
					if (typeof (iE.maxLength) == 'number')
						oE.maxLength = iE.maxLength;
					break;
				case XsDataType.ComplexType:
					// Starting with v1.2 a complex dataType has a sequence of elements:
					oE.sequence = iE.sequence;
			};

			// Look for enumerated values;
			// Transform local property values to ontology terms;

			// Starting with v1.1 every dataType except xs:boolean may have enumerated values:
			if (iE.enumeration)
				oE.enumeration = (iE.type == XsDataType.String && opts.normalizeTerms?
					iE.enumeration.map( makeEnumValue )
					: iE.enumeration
				);

			// Up until v1.0 there is a dedicated dataType "xs:enumeration" with a property 'values':
			if (iE.values)
				oE.enumeration = iE.values.map( (v: any): SpecifEnumeratedValue => {
					// 'v.title' until v0.10.6, 'v.value' thereafter;
					// 'v.value' can be a string or a multilanguage text.
					/*	return {
							id: v.id,
							value: Array.isArray(v.value) ?
								v.value
								: [{ text: v.value || v.title || '' }] // v.value or v.title is a string; works also for v.value==''
						}  */
					let lv = Array.isArray(v.value) ?
						v.value
						: [{ text: v.value || v.title || '' }]; // v.value or v.title is a string; works also for v.value==''
					return {
						id: v.id,
						value: opts.normalizeTerms ? lv.map( normalizeLanguageText ) : lv
					}
				});

//			console.debug('dataType 2int',iE);
			return oE;

			function makeEnumValue(eV: SpecifEnumeratedValue): SpecifEnumeratedValue {
				let oV = {
					id: eV.id,
					// @ts-ignore - in case of a string, eV.value is an array (SpecifMultiLanguageText)
					value: eV.value.map( normalizeLanguageText )
				};
				return oV;
			}
		}
		// a property class:
		function pC2int(iE: any): SpecifPropertyClass {
			var oE: any = i2int(iE);
			oE.title = makeTitle('propertyClass', iE.title);  // an input file may have titles which are not from the SpecIF vocabulary.

			// For the time being, suppress any revision to make sure that a dataType update doesn't destroy the reference.
			// ToDo: Reconsider once we have a backend with multiple revisions ...
			oE.dataType = LIB.makeKey(iE.dataType.id || iE.dataType);

			// startig with v1.2 only propertyClasses will have the 'multiple' attribute:
			let dT: SpecifDataType = LIB.itemByKey(spD.dataTypes, oE.dataType);
			if (dT) {
				if (typeof (iE.multiple) == 'boolean') oE.multiple = iE.multiple
				// @ts-ignore - dT.multiple does exist with <v1.2
				else if (dT.multiple) oE.multiple = true;
			}
			else
				throw "The dataType " + oE.dataType.id + " for propertyClass " + oE.id + " has not been found.";

			if (iE.required) oE.required = true;

			// The default values:
			dT = LIB.itemByKey(self.dataTypes, oE.dataType);  // here we need the transformed dataType
			if (iE.value || iE.values) {
				let vL = makeValues(iE, dT);
				if (vL.length > 0)
					oE.values = vL;
			};

			if (dT.type == XsDataType.String) {
				if (app.ontology.propertyClassIsFormatted(oE.title))
					oE.format = SpecifTextFormat.Xhtml
				else
					oE.format = typeof (iE.format) == 'string' && iE.format == SpecifTextFormat.Xhtml ?
						SpecifTextFormat.Xhtml
						: SpecifTextFormat.Plain;
			};

			if (iE.unit) oE.unit = iE.unit;

//			console.debug('propClass 2int',iE,oE);
			return oE;
		}
		// common for all instance classes:
		function aC2int(iE:any) {
			var oE: any = i2int(iE);

			if (iE['extends']) oE['extends'] = iE['extends'].id? iE['extends'] : LIB.makeKey(iE['extends']);	// 'extends' is a reserved word starting with ES5
			if (iE.creation) oE.instantiation = iE.creation;	// deprecated, for compatibility
			if (iE.instantiation) oE.instantiation = iE.instantiation;
			if (oE.instantiation) {
				let idx = oE.instantiation.indexOf('manual');	// deprecated
				if (idx > -1) oE.instantiation.splice(idx, 1, 'user')
			};
			// Up until v0.10.5, the pClasses themselves are listed, starting v0.10.6 references are listed:
			if (Array.isArray(iE[names.pClasses]) && iE[names.pClasses].length > 0) {
				if (typeof (iE[names.pClasses][0]) == 'object' && iE[names.pClasses][0].dataType == undefined) {
					// It is a propertyClass reference according to v1.1:
					// For the time being, suppress any revision to make sure that a class update doesn't destroy the reference.
					// ToDo: Reconsider once we have a backend with multiple revisions ...
					oE.propertyClasses = iE.propertyClasses.map((pC: SpecifKey) => { return LIB.makeKey(pC.id) });
				}
				else if (typeof (iE[names.pClasses][0]) == 'string') {
					// it is a propertyClass reference according to v1.0 (and some versions before that);
					// make a list of pClasses according to v1.1:
					// For the time being, suppress any revision to make sure that a class update doesn't destroy the reference.
					// ToDo: Reconsider once we have a backend with multiple revisions ...
					oE.propertyClasses = iE[names.pClasses].map((el: any): SpecifKey => { return LIB.makeKey(el.id || el) });
				}
				else {
					// it is a full-fledged propertyClass in one of the oldest SpecIF versions:
					oE.propertyClasses = [];
					iE[names.pClasses].forEach((e: any): void => {
						// Store the pClasses at the top level;
						// redundant pClasses will be deduplicated, later:
						let pC = pC2int(e);
						self.propertyClasses.push(pC);
						// Add to a list with pClass references, here:
						// For the time being, suppress any revision to make sure that a class update doesn't destroy the reference.
						// ToDo: Reconsider once we have a backend with multiple revisions ...
						oE.propertyClasses.push(LIB.makeKey(pC.id));
					})
				};
			}
			else
				oE.propertyClasses = [];
//			console.debug('anyClass 2int',iE,oE);
			return oE
		}
		// a resource class:
		function rC2int(iE: SpecifResourceClass): SpecifResourceClass|undefined {
			var oE: any = aC2int(iE);
			oE.title = makeTitle('resourceClass', iE.title);

			let ic = app.ontology.getIcon('resourceClass', oE.title);
			if (ic || iE.icon) oE.icon = ic || iE.icon;

			// If "iE.isHeading" is defined, use it:
			if (typeof (iE.isHeading) == 'boolean') {
				oE.isHeading = iE.isHeading;
			}
			else if (app.ontology.headings.includes(iE.title)) {
				// take care of older data without "isHeading":
				oE.isHeading = true;
		/*	This is wrong: Perhaps the value of a property of class dcterms:type could specify a special heading such as BOM,
		 *	but not the title of a property as implemented below:
		 *	}
			else {
				// look for a property class being configured in CONFIG.headings:
				let pC;
				for (var a = oE.propertyClasses.length - 1; a > -1; a--) {
					pC = LIB.itemByKey(self.propertyClasses, oE.propertyClasses[a]);
					if (pC && app.ontology.headings.includes(pC.title)) {
						oE.isHeading = true;
						break;
					};
				}; */
			};
//			console.debug('resourceClass 2int',iE,oE);
			if (oE.propertyClasses.length <0 )
				console.warn('The resourceClass with id="' + iE.id + '" does not specify any propertyClasses.');
			return oE;
		}
		// a statementClass:
		function sC2int(iE:any): SpecifStatementClass {
			var oE: SpecifStatementClass = aC2int(iE);
			oE.title = makeTitle('statementClass', iE.title);

			let ic = app.ontology.getIcon('statementClass', oE.title);
			if (ic || iE.icon) oE.icon = ic || iE.icon;

			if (iE.isUndirected) oE.isUndirected = iE.isUndirected;
			// For the time being, suppress any revision to make sure that a class update doesn't destroy the reference.
			// ToDo: Reconsider once we have a backend with multiple revisions ...
			if (iE[names.sbjClasses])
				oE.subjectClasses = iE[names.sbjClasses].map( (el: any): SpecifKey => { return LIB.makeKey(el.id || el) });
			if (iE[names.objClasses])
				oE.objectClasses = iE[names.objClasses].map( (el: any): SpecifKey => { return LIB.makeKey(el.id || el) });
//			console.debug('statementClass 2int',iE,oE);
			return oE
		}
		// a hierarchyClass:
		function hC2int(iE:any) {
			// hierarchyClasses (used up until v0.10.6) are stored as resourceClasses,
			// later on, the hierarchy-roots will be stored as resources referenced by a node:
			var oE = aC2int(iE);
			oE.title = makeTitle('resourceClass', iE.title);
			oE.isHeading = true;
//			console.debug('hierarchyClass 2int',iE,oE);
			return oE
		}
		// a property:
		function p2int(iE: any): SpecifProperty|undefined {
			if (Array.isArray(iE.values) && iE.values.length > 0 || iE.value) {
				// @ts-ignore - 'values'will be added later:
				var oE: SpecifProperty = {
						// no id
						// For the time being, suppress any revision to make sure that a class update doesn't destroy the reference.
						// ToDo: Reconsider once we have a backend with multiple revisions ...
						class: LIB.makeKey(iE[names.pClass].id || iE[names.pClass])
					},
					dT = LIB.dataTypeOf(oE["class"], self);  // we need the transformed dataType
//					console.debug('p2int', iE, dT);

				oE.values = makeValues(iE, dT);

				// In rare cases it may happen that a property list has just undefined values or empty strings;
				// we just want properties with at least one valid value:
				if (oE.values.length > 0)
					return oE;
			};
			// return undefined --> the property will be skipped as a whole.
		}
		// common for all resources or statements:
		function a2int(iE:any): SpecifInstance {
			// For the time being, suppress any revision to make sure that a class update doesn't destroy the reference.
			// ToDo: Reconsider once we have a backend with multiple revisions ...
			let eCkey = iE.subject ? LIB.makeKey(iE[names.sClass].id || iE[names.sClass])
				  // @ts-ignore - in this case 'names.hClass' is defined
				: (iE.nodes ? LIB.makeKey(iE[names.hClass].id || iE[names.hClass])
					: LIB.makeKey(iE[names.rClass].id || iE[names.rClass]));

			var	oE: any = {
					id: iE.id,
					class: eCkey,
				//	changedAt: iE.changedAt
					changedAt: LIB.addTimezoneIfMissing(iE.changedAt)
				};
			if (iE.alternativeIds)
				oE.alternativeIds = iE.alternativeIds.map(
					(a:any) => { return LIB.makeKey(a) }
				);
			if (iE.changedBy) oE.changedBy = iE.changedBy;

			// revision is a number up until v0.10.6 and a string thereafter:
			if (iE.revision) oE.revision = typeof (iE.revision) == 'number' ? iE.revision.toString() : iE.revision;
			if (iE.replaces) oE.replaces = iE.replaces;

			// resources must have a title, but statements may come without:
			if (iE.properties && iE.properties.length > 0)
				oE.properties = LIB.forAll(iE.properties, (e: any): SpecifProperty|undefined => { return p2int(e) });

	 		// Are there resources with description, but without description property?
			// See tutorial 2 "Related Terms": https://github.com/GfSE/SpecIF/blob/master/tutorials/v1.0/02_Related-Terms.md
			// In this case, add a title and description property each as required by SpecIF v1.1 (no more native title and description):
			[
				{ name: 'description', nativePrp: iE.description, tiL: CONFIG.descProperties, cl: CONFIG.propClassDesc },
				{ name: 'title', nativePrp: iE.title, tiL: CONFIG.titleProperties, cl: CONFIG.propClassTitle }
			].forEach(
				(pD) => {
					if (pD.nativePrp && propertyMissing(pD.tiL, oE)) {
						// Add title resp. description property to the element:
						LIB.addProperty(oE, {
							class: { id: suitablePropertyClassId(pD, eCkey) },
							values: [makeMultiLanguageText(pD.nativePrp) ]
						});
						console.info("Added a "+pD.name+" property to element with id '" + oE.id + "'");
					};
                }
			);

//			console.debug('a2int',iE,simpleClone(oE));
			return oE

			function propertyMissing(L: string[], el: any): boolean {
				// Has the resource el a property whose class has a title listed in L?
				if (Array.isArray(el.properties))
					for (var p of el.properties) {
						if (L.includes(LIB.classTitleOf(p['class'], self.propertyClasses)))
							// SpecIF assumes that any title/description property *replaces* the resource's native property.
							// There is no consideration of the content.
							// It is expected that title/descriptions with multiple languages have been reduced, before.
							return false; // title resp. description property is available
					};
				return true; // no array or no title/description property
			}
			function suitablePropertyClassId(pDef:any, eCk: any): string {
				// Return the id of a suitable propertyClass - if there is none, create it:
				// - pDef holds definitions for the propertyClass in focus
				// - pDef.tiL is a list of suitable propertyClass titles
				// - eCk is the key of an resource resp statement class
				// --> to decide whether the class has a propertyClass with a title listed in pDef.tiL.

				// the element's class:
				let eC = LIB.itemByKey((iE.subject ? self.statementClasses : self.resourceClasses), eCk);

				// 1. The propertyClass is defined for the element, but the property isn't instantiated:
				for (var pCk of eC.propertyClasses) {
					let pC = LIB.itemByKey(self.propertyClasses, pCk);
					if (pC && pDef.tiL.includes(pC.title))
						return pC.id
				};

				// No suitable propertyClass is listed in eC.propertyClasses, so create what's needed:

				// 2. The suitable propertyClass is defined in general (and used by elements of other classes), so add definition and instantiation;
				//    so a title listed in pDef.tiL is present in self.propertyClasses:
				for (var ti of pDef.tiL) {
					let pC = LIB.itemBy(self.propertyClasses, 'title', ti);
					if (pC) {
						// add propertyClass to element class:
						LIB.addPCReference(eC, { id: pC.id });
						return pC.id
					}
				};

				// No suitable propertyClass is listed in self.propertyClasses, so create what's needed:

				// 3. Add a new (standard) propertyClass with any required classes:
				let pCid = LIB.addClassesTo( pDef.cl, self).id;

				// 4. Add propertyClass to element class:
				LIB.addPCReference(eC, { id: pCid });
				return pCid
			}
		}
		// a resource:
		function r2int(iE: any): SpecifResource {
			var oE: SpecifResource = a2int(iE) as SpecifResource;
//			console.debug('resource 2int',iE,simpleClone(oE));
			return oE
		}
		// a statement:
		function s2int(iE:any): IIncompleteStatement {
			var oE = a2int(iE) as IIncompleteStatement;
			// SpecIF allows subjects and objects with id alone or with  a key (id+revision):
			// keep original and normalize to id+revision for display:
			oE.subject = LIB.makeKey(iE.subject.id || iE.subject );
			oE.object = LIB.makeKey(iE.object.id || iE.object );

			// special feature to import statements to complete,
			// used for example by the XLS import:
		/*	// @ts-ignore - subjectToLink is implementation-specific for a-posteriori completion of statements
			if (iE.subjectToLink) oE.subjectToLink = iE.subjectToLink;  */
			if (iE.resourceToLink) oE.resourceToLink = iE.resourceToLink;
//			console.debug('statement 2int',iE,oE);
			return oE
		}
		// a hierarchy:
		function h2int(iE: any): INodeWithPosition {
			// the properties are stored with a resource, while the hierarchy is stored as a node with reference to that resource:
			var oE: INodeWithPosition;
			if (names.hClasses) {
				// up until v0.10.6, transform hierarchy root to a regular resource:
				var iR = a2int(iE) as SpecifResource;
				// For the time being, suppress any revision to make sure that a class update doesn't destroy the reference.
				// ToDo: Reconsider once we have a backend with multiple revisions ...
				// @ts-ignore - if execution gets here, 'names.hClass' is defined:
				iR['class'] = LIB.makeKey(iE[names.hClass].id || iE[names.hClass]);
				self.resources.push(iR);

				// ... and add a link to the hierarchy:
				oE = {
					id: CONFIG.prefixN + iR.id,
					resource: LIB.keyOf( iR ),
				//	changedAt: iE.changedAt || spD.changedAt || new Date().toISOString()
					changedAt: LIB.addTimezoneIfMissing(iE.changedAt || spD.changedAt) || new Date().toISOString()
				};
				if (iE.revision) oE.revision = typeof (iE.revision) == 'number' ? iE.revision.toString() : iE.revision;
				if (iE.changedBy) oE.changedBy = iE.changedBy;
			}
			else {
				// starting v0.10.8:
				oE = i2int(iE);
				oE.resource = LIB.makeKey(iE.resource.id || iE.resource);
				// only for internal use - not needed for external imports:
				if (iE.predecessor)
					oE.predecessor = LIB.makeKey(iE.predecessor.id || iE.predecessor);
			};

			// SpecIF allows resource references with id alone or with a key (id+revision):
			oE.nodes = LIB.forAll(iE.nodes, n2int);
//			console.debug('hierarchy 2int',iE,oE);
			return oE;

			// a hierarchy node:
			function n2int(iE:any): SpecifNode {
				var oE: SpecifNode = {
						id: iE.id,
						// For the time being, suppress any revision to make sure that a resource update doesn't destroy the reference.
						// ToDo: Reconsider once we have a backend with multiple revisions ...
						resource: LIB.makeKey(iE[names.r].id || iE[names.r]),
					//	changedAt: iE.changedAt || spD.changedAt || new Date().toISOString()
						changedAt: LIB.addTimezoneIfMissing(iE.changedAt || spD.changedAt) || new Date().toISOString()
					};
				if (iE.revision) oE.revision = typeof (iE.revision) == 'number' ? iE.revision.toString() : iE.revision;
				if (iE.changedBy) oE.changedBy = iE.changedBy;
				if (iE.nodes) oE.nodes = LIB.forAll(iE.nodes, n2int);
				return oE;
			}
		}
		// a file:
		function f2int(iE:any): SpecifFile {
			var oE = i2int(iE);
			// The title is usually 'path/filename.ext';
			// but sometimes a Windows path is given ('\') -> transform it to web-style ('/'):
			oE.title = (iE.title ? iE.title : iE.id).replace(/\\/g, '/');
			if (iE.revision) oE.revision = typeof (iE.revision) == 'number' ? iE.revision.toString() : iE.revision;
			// store the blob and it's type:
			if (iE.blob) {
				oE.type = iE.blob.type || iE.type || LIB.attachment2mediaType(oE.title);
				oE.blob = iE.blob;
			}
			else if (iE.dataURL) {
				oE.type = iE.type || LIB.attachment2mediaType(oE.title);
				oE.dataURL = iE.dataURL;
			}
			else
				oE.type = iE.type;
			return oE;
		}
		// utilities:
		function makeTitle(ctg: string, ti: any): string {
			// In <v1.1, titles can be simple strings or multi-language text objects;
			// in >v1.0, native titles can only be strings (in fact SpecifText).
			// So, in case of multi-language text, choose the default language:
			let str = LIB.cleanValue(typeof (ti) == 'string' ? ti : ti[0].text);

			// by default just keep it:
			return (opts.normalizeTerms? app.ontology.normalize(ctg, str) : str);
		}
		function normalizeLanguageText(v: SpecifLanguageText): SpecifLanguageText {
			let o: SpecifLanguageText = {
				// ToDo:consider all terms of the ontology which are object to a "hasEnumValue" statement, rather than 'all'
				text: app.ontology.normalize('all', v.text)
			};
		//	if (v.format) o.format = v.format;
			if (v.language) o.language = v.language;
			return o;
		}
		function makeValues(prp: any, dT: SpecifDataType): SpecifValues {
			// ToDo: Transform local property values to ontology terms;
			// consider all terms of the ontology which are object to a "hasEnumValue" statement:
		/*	let pC: SpecifPropertyClass = LIB.itemByKey(spD.propertyClasses, prp['class']),
				dT: SpecifDataType = LIB.itemByKey(spD.dataTypes, pC.dataType);
				// @ts-ignore - value will be assigned further down
				fmt: SpecifTextFormat; */

			if (Array.isArray(prp.values)) {
				// It is SpecIF v1.1 or later;
				// for all items in the value list of property prp:
				return prp.values
				.map(
					makeValue
				)
				.filter(
					(p: any) => !!p
				);

				function makeValue(val: SpecifValue): SpecifValue | undefined {
					if (val) {
						if (dT.enumeration) {
							// @ts-ignore
							return val.id ? val : { id: val };  // for versions 1.2 and later, val is an object with property 'id'
						};

						switch (dT.type) {
							// we are using the transformed dataTypes, but the base dataTypes are still original;
							case XsDataType.String:
								// Values of type xs:string are permitted by the schema, but not by the constraints.
								// To make the import more robust, string values are accepted and transformed to a multiLanguageText:
								if (typeof (val) == 'string') {
									if (val.length < 1) return // undefined
									console.warn("With SpecIF v1.1 and later, a property of type '" + XsDataType.String + "' should be a multi-language text.");
									val = LIB.makeMultiLanguageValue(LIB.uriBack2slash(LIB.cleanValue(val)));
								};

								/*	fmt = fmt
										|| app.ontology.getTermValue("propertyClass", pC.title, "SpecIF:TextFormat")
										|| CONFIG.excludedFromFormatting.includes(pC.title) ? "plain" : val[0].format
										|| "plain";   --> doesn't work for some reason, result is always 'plain'.
									if (!fmt)
										fmt = app.ontology.propertyClassIsFormatted(pC.title);
									if (!fmt)
										// @ts-ignore
										fmt = CONFIG.excludedFromFormatting.includes(pC.title) ? SpecifTextFormat.Plain : val[0].format;
									if (!fmt)
										fmt = SpecifTextFormat.Plain; */

								// For SpecIF >v1.0, it is always a multilanguageText according to the constraints:
								if (LIB.multiLanguageValueHasContent(val))
									// @ts-ignore
									return val.map(
										(singleLang: SpecifLanguageText) => {
											// - Sometimes a Windows path is given ('\') -> transform it to web-style ('/');
											// - don't import the format for values - it is defined in the propertyClass: 
											/*		singleLang.text = LIB.uriBack2slash(LIB.cleanValue(singleLang.text));
											//		singleLang.format = fmt;
													return singleLang; */
											let sl: any = { text: LIB.uriBack2slash(LIB.cleanValue(singleLang.text)) };
										/*		ti: string;

											// Is the property formatted? - look up the ontology:
											if (prp.title)
												// prp is a propertyClass and val a default value:
												ti = LIB.displayValueOf(prp.title, { targetLanguage: 'default' });
											else {
												// prp is a property and val a property value:
												let pC: SpecifPropertyClass = LIB.itemByKey(spD.propertyClasses, prp['class']);
												ti = LIB.displayValueOf(pC.title, { targetLanguage: 'default' });
											};
											if (app.ontology.propertyClassIsFormatted(ti)) sl.format = SpecifTextFormat.Xhtml;
										*/

											if (singleLang.language) sl.language = singleLang.language;
											return sl;
										}
									)
										.filter(
											(sl: SpecifLanguageText) => !!sl.text
										)
								else
									return; // undefined
							case XsDataType.DateTime:
								if (typeof (val) == 'string')
									return makeISODate(LIB.cleanValue(val))
								else
									throw Error("Value of property " + prp.id + " with class " + prp['class'].id + " must be a string.");
							case XsDataType.Boolean:
								if (CONFIG.valuesTrue.includes(LIB.cleanValue(val)))
									return "true";
								if (CONFIG.valuesFalse.includes(LIB.cleanValue(val)))
									return "false";
								console.warn('Unknown boolean value ' + LIB.cleanValue(val) + ' skipped.');
								break;
							case XsDataType.ComplexType:
								// @ts-ignore - sequence is defined in this case as checked by the schema
								if (Array.isArray(val) && dT.sequence.length == val.length)
									return val.map(
										// no need to transform or repair any older value:
										LIB.cleanValue
									);
								else
									throw Error("Importing the value of a complexType: Number of values is not equal to the dataType's sequence length.");
							default:
								// According to the schema, all property values are represented by a string
								// and internally they are stored as string as well to avoid inaccuracies
								// by multiple transformations:
								return LIB.cleanValue(val);
						}
					}
					//	return;  // undefined --> no element in the returned array
				}
			};
			if (LIB.isString(prp.value) || LIB.isMultiLanguageValue(prp.value)) {
				// it is SpecIF < v1.1:
				switch (dT.type) {
					// assuming that dT is the transformed dataType
					case XsDataType.String:
					// @ts-ignore - "xhtml" can appear in SpecIF <v1.1 and will be replaced at the end of transformation:
					case "xhtml":
				/*	// @ts-ignore - "xs:enumeration" can appear in SpecIF <v1.1 and will be replaced at the end of transformation:
					case "xs:enumeration":  has already been replaced by "xs:string", in fact */
						// in SpecIF <v1.1 enumerations are implictly of base-type xs:string:
						if (dT.enumeration) {
							// in SpecIF <1.1 multiple enumeration ids were in a comma-separated string;
							// starting v1.1 they are separate list items,
							// starting v1.2 they are a list of objects with a property 'id':
							let vL: string[] = LIB.cleanValue(prp.value).split(',');
							return vL.map((v: string) => { return { id: v.trim() } });
						};

						let vL = Array.isArray(prp.value) ?
							// multiple languages:
							prp.value.map(
								(val: any) => {
									// sometimes a Windows path is given ('\') -> transform it to web-style ('/'):
									val.text = LIB.uriBack2slash(LIB.cleanValue(val.text));
									return val;
								}
							)
							// single language:
							// sometimes a Windows path is given ('\') -> transform it to web-style ('/'):
							: LIB.uriBack2slash(LIB.cleanValue(prp.value));
						// @ts-ignore - dT.type is in fact a string:
						return [makeMultiLanguageText(vL /*, dT.type*/)];
					// break - all branches end with return;
					case XsDataType.DateTime:
						return [makeISODate(LIB.cleanValue(prp.value))];
					//	return [LIB.addTimezoneIfMissing(LIB.cleanValue(prp.value))];
					case XsDataType.Boolean:
						if (CONFIG.valuesTrue.includes(LIB.cleanValue(prp.value)))
							return ["true"];
						if (CONFIG.valuesFalse.includes(LIB.cleanValue(prp.value)))
							return ["false"];
						console.warn('Unknown boolean value ' + LIB.cleanValue(prp.value) + ' skipped.');
						return [];
					default:
						// According to the schema, all property values are represented by a string
						// and internally they are stored as string as well to avoid inaccuracies
						// by multiple transformations:
						return [LIB.cleanValue(prp.value)];
				}
			}
			else
				throw "Invalid property with class " + prp[names.pClass] + ".";

			function makeISODate(str:string) {
				// repair faulty time-zone from ADOIT (add missing colon between hours and minutes);
				// this is only necessary for some SpecIF files created with an older Archimate importer:
				return LIB.addTimezoneIfMissing(
					str.replace(
						/(\d\+|\d-)(\d\d)(\d\d)$/,
						// @ts-ignore - match is never read, but cannot be omitted
						(match, $1, $2, $3) => {
							return $1 + $2 + ':' + $3;
						})
					)
			}
		}
		function makeMultiLanguageText(iE: any /*, baseType?:string */): SpecifMultiLanguageText {
			return (typeof (iE) == 'string' ?
			//	[{ text: LIB.cleanValue(iE), format: baseType == "xhtml" ? "xhtml" : "plain" }]
				[{ text: LIB.cleanValue(iE) }]
				: LIB.cleanValue(iE) )
        }
	}
	private toExt(opts?: any): Promise<SpecIF> {
		// transform self.cache to SpecIF following defined options;
		// a clone is delivered.
		// if opts.targetLanguage has no value, all available languages are kept.

		//		console.debug('toExt', this, opts );
		// transform internal data to SpecIF:
		return new Promise(
			(resolve, reject) => {
				let self = this,
					pend = 0;
				let spD: SpecIF = Object.assign(
					app.ontology.makeTemplate(),
					{
						id: this.id,
						title: LIB.selectTargetLanguage(this.title, opts)
					}
				);

				/*	// Add a resource as hierarchyRoot, if needed.
					// - If none of the nodes are a root, a common root is added for all.
					// - If at least one hierarchy has a root, all others get their own root.
					// It is assumed,
					// - that in general SpecIF data do not have a hierarchy root with meta-data.
					// - that ReqIF specifications (=hierarchyRoots) are transformed to regular resources on input.
					// - the ReqIF import transformation adds a property titled 'dcterms:type' with value CONFIG.hierarchyRoot to each hierarchy root.
	
						function aHierarchyHasNoRoot(dta: SpecIF): boolean {
							for (var h of dta.nodes) {
								let r = LIB.itemByKey(dta.resources, h.resource);
								if (!r) {
									throw Error("Hierarchy '"+h.id+"' is corrupt");
								};
								let ty = LIB.valueByTitle(r, CONFIG.propClassType, dta),
									rC = LIB.itemByKey(dta.resourceClasses, r['class']);
								console.debug('aHierarchyHasNoRoot',h,ty,rC);
								// The type of the hierarchy root can be specified by a property titled CONFIG.propClassType
								// or by the title of the resourceClass:
								if ((!ty || ty != CONFIG.hierarchyRoot )
									&& (rC.title != CONFIG.hierarchyRoot))
									return true;
							};
							return false;
						}
						console.debug('has root:', spD.nodes, aHierarchyHasNoRoot(this));
	
						let spD = this;
						if (opts && opts.createHierarchyRootIfMissing && aHierarchyHasNoRoot(spD)) {
			
							console.info("Added a hierarchyRoot");
							let oC = app.ontology.generateSpecifClasses({ terms: [CONFIG.resClassFolder], adoptOntologyDataTypes: true, delta: true });
							['dataTypes', 'propertyClasses', 'resourceClasses'].forEach(
								// @ts-ignore - indexing is fine
								(li) => { spD[li] = oC[li] }
							);
	
							var res: SpecifResource = {
								id: CONFIG.prefixR + simpleHash(spD.id),
								class: LIB.makeKey("RC-Folder"),
								properties: [{
									class: { id: "PC-Name" },
									values: [LIB.makeMultiLanguageValue(spD.title)]
								}, {
									class: { id: "PC-Type"},
									values: [LIB.makeMultiLanguageValue(CONFIG.resClassOutline)]
								}],
								changedAt: spD.createdAt || new Date().toISOString()
							};
							// Add a description property only if it has a value:
							if (spD.description)
								LIB.addProperty(res, {
									class: { id: "PC-Description"},
									values: [spD.description]
								});
							spD.resources.push(r2ext(res));
							// create a new root instance:
							spD.nodes = [{
								id: CONFIG.prefixH + res.id,
								resource: LIB.keyOf(res),
								// .. and add the previous nodes as children:
								nodes: spD.nodes,
								changedAt: res.changedAt
							}];
						};  */

				// Add a resource as hierarchyRoot, if needed.
				// - all top nodes get a hierarchy root, unless they *are* a hierarchy root 
				// It is assumed,
				// - that in general SpecIF data do not have a hierarchy root with meta-data.
				// - that ReqIF specifications (=hierarchyRoots) are transformed to regular resources on input.
				// - the ReqIF import transformation adds a property titled 'dcterms:type' with value CONFIG.hierarchyRoot to each hierarchy root.
				function nodeIsNoRoot(r: SpecifResource): boolean {
					let valL = LIB.valuesByTitle(r, [CONFIG.propClassType], self);
					return valL.length < 1 || LIB.languageTextOf(valL[0], { targetLanguage: "default" }) != CONFIG.hierarchyRoot
				}
				if (opts && opts.createHierarchyRootIfMissing) {
					for (var i = this.nodes.length - 1; i > -1; i--) {
						let r = LIB.itemByKey(this.resources, this.nodes[i].resource);
						if (nodeIsNoRoot(r)) {
							// A hierarchy has no root element (as needed for ReqIF);
							// add any needed classes, so that one or more hierarchy roots can be added later in h2ext:
							let oC = app.ontology.generateSpecifClasses({ terms: [CONFIG.resClassFolder] /*, adoptOntologyDataTypes: true */, referencesWithoutRevision: true, delta: true });
							['dataTypes', 'propertyClasses', 'resourceClasses'].forEach(
								// @ts-ignore - indexing is fine
								(li) => { LIB.cacheL(spD[li], oC[li]) }
							);
							break;  // once is sufficient
						}
					}
				};

				// if opts.targetLanguage is defined, create a multilanguageText with the selected language, only:
				if (LIB.multiLanguageValueHasContent(this.description))
					spD.description = LIB.selectTargetLanguage(this.description, opts);

				if (this.language)
					spD.language = this.language;

				if (this.rights && this.rights.title && this.rights.url)
					spD.rights = this.rights;

				if (app.me && app.me.email) {
					spD.createdBy = {
						familyName: app.me.lastName,
						givenName: app.me.firstName,
						email: app.me.email
					};
					if (app.me.organization)
						spD.createdBy.org = { organizationName: app.me.organization };
				}
				else {
					if (this.createdBy && this.createdBy.email) {
						spD.createdBy = {
							familyName: this.createdBy.familyName,
							givenName: this.createdBy.givenName,
							email: this.createdBy.email
						};
						if (this.createdBy.org && this.createdBy.org.organizationName)
							spD.createdBy.org = this.createdBy.org;
					};
					// else: don't add createdBy without data
				};

				// Now start to assemble the SpecIF output:
				LIB.cacheL(spD.dataTypes, LIB.forAll(this.dataTypes, dT2ext));
				LIB.cacheL(spD.propertyClasses, LIB.forAll(this.propertyClasses, pC2ext));
				LIB.cacheL(spD.resourceClasses, LIB.forAll(this.resourceClasses, rC2ext));
				LIB.cacheL(spD.statementClasses, LIB.forAll(this.statementClasses, sC2ext));
				for (var f of this.files) {
					pend++;
					f2ext(f)
						.then(
							(oF: SpecifFile) => {
								// @ts-ignore - files is defined by makeTemplate
								spD.files.push(oF);
								if (--pend < 1) finalize();
							},
							reject
						);
				};
				LIB.cacheL(spD.resources, LIB.forAll((this.resources), r2ext));
				LIB.cacheL(spD.statements, LIB.forAll(this.statements, s2ext));
				LIB.cacheL(spD.nodes, LIB.forAll(this.nodes, h2ext));

				if (pend < 1) finalize();  // no files, so finalize right away
				return;

				function finalize() {
					// ToDo: schema and consistency check (if we want to detect any programming errors)
					//					console.debug('specif.toExt exit',spD);
					resolve(spD);
				}

				// common for all items:
				function i2ext(iE: any) {
					var oE: any = {
						id: iE.id,
						changedAt: iE.changedAt
					};
					// most items must have a title, but resources and statements come without:
					if (iE.title) oE.title = LIB.titleOf(iE, opts);
					// if opts.targetLanguage is defined, create a multilanguageText with the selected language, only:
					if (LIB.multiLanguageValueHasContent(iE.description)) oE.description = LIB.makeMultiLanguageValue(LIB.languageTextOf(iE.description, opts));
					if (iE.revision) oE.revision = iE.revision;
					if (iE.replaces) oE.replaces = iE.replaces;
					if (iE.changedBy && iE.changedBy != CONFIG.userNameAnonymous) oE.changedBy = iE.changedBy;
					return oE;
				}
				// a data type:
				function dT2ext(iE: SpecifDataType) {
					var oE: SpecifDataType = i2ext(iE);
					oE.type = iE.type;
					switch (iE.type) {
						case XsDataType.Double:
							if (iE.fractionDigits) oE.fractionDigits = iE.fractionDigits;
						case XsDataType.Integer:
							if (typeof (iE.minInclusive) == 'number') oE.minInclusive = iE.minInclusive;
							if (typeof (iE.maxInclusive) == 'number') oE.maxInclusive = iE.maxInclusive;
							break;
						case XsDataType.String:
							if (iE.maxLength) oE.maxLength = iE.maxLength;
							break;
						case XsDataType.ComplexType:
							// Starting with v1.2 a complex dataType has a sequence of elements:
							oE.sequence = iE.sequence;
					};
					// Look for enumerated values;
					// every dataType except xs:boolean may have enumerated values:
					if (iE.enumeration) {
						if (iE.type == XsDataType.String && opts.targetLanguage)
							// reduce to the language specified:
							oE.enumeration = iE.enumeration.map(
								(v: any) => {
									let txt = LIB.languageTextOf(v.value, opts);
									if (opts.lookupValues) txt = app.ontology.localize(txt, opts);
									return { id: v.id, value: LIB.makeMultiLanguageValue(txt) }
								}
							)
						else
							oE.enumeration = iE.enumeration;
					};

					return oE
				}
				// a property class:
				function pC2ext(iE: SpecifPropertyClass) {
					var oE: SpecifPropertyClass = i2ext(iE);
					if (iE.values) oE.values = iE.values;  // default values
					oE.dataType = iE.dataType;

					if (iE.multiple) oE.multiple = true;
					if (iE.format) oE.format = iE.format;
					if (iE.required) oE.required = true;

					// ToDo: select language, if opts.targetLanguage is defined
					if (iE.values) oE.values = iE.values;
					if (iE.unit) oE.unit = iE.unit;

					return oE
				}
				// common for all instance classes:
				function aC2ext(iE: any) {
					var oE = i2ext(iE);
					if (iE.icon) oE.icon = iE.icon;
					if (iE.instantiation) oE.instantiation = iE.instantiation;
					// @ts-ignore - index is ok:
					if (iE['extends']) oE['extends'] = iE['extends'];
					if (iE.propertyClasses && iE.propertyClasses.length > 0) oE.propertyClasses = iE.propertyClasses;
					return oE
				}
				// a resource class:
				function rC2ext(iE: SpecifResourceClass) {
					var oE: SpecifResourceClass = aC2ext(iE) as SpecifResourceClass;
					// Include "isHeading" in SpecIF only if true:
					if (iE.isHeading) oE.isHeading = true;
					// resourceClasses must have a list of propertyClasses with at least one element:
					if (Array.isArray(oE.propertyClasses) && oE.propertyClasses.length > 0 || LIB.isKey(oE['extends']))
						return oE;
					// else (shouldn't arrive here, at all):
					console.error('Skipping resourceClass with id="' + iE.id + '" on export, because it does not specify any propertyClasses.');
					// return undefined ... and the element will not be listed in the list of resourceClasses
				}
				// a statement class:
				function sC2ext(iE: SpecifStatementClass) {
					var oE: SpecifStatementClass = aC2ext(iE) as SpecifStatementClass;
					if (iE.isUndirected) oE.isUndirected = iE.isUndirected;
					if (iE.subjectClasses && iE.subjectClasses.length > 0) oE.subjectClasses = iE.subjectClasses;
					if (iE.objectClasses && iE.objectClasses.length > 0) oE.objectClasses = iE.objectClasses;
					return oE
				}
				// a property:
				function p2ext(iE: SpecifProperty) {
					if (opts.showEmptyProperties || Array.isArray(iE.values) && iE.values.length > 0) {
						// Skip certain properties;
						// - if a hidden property is defined with value, it is suppressed only if it has this value
						// - if the value is undefined, the property is suppressed in all cases
						let pC: SpecifPropertyClass = LIB.itemByKey(spD.propertyClasses, iE['class']);
						if (Array.isArray(opts.skipProperties)) {
							for (var sP of opts.skipProperties) {
								if (sP.title == pC.title && (sP.value == undefined || sP.value == LIB.displayValueOf(iE.values[0], opts))) return;
							};
						};

						var oE: SpecifProperty = {
							class: iE['class'],
							values: []
						};

						// According to the schema, all property values are represented by a string
						// and we want to store them as string to avoid inaccuracies by multiple transformations.
						let dT: SpecifDataType = LIB.itemByKey(spD.dataTypes, pC.dataType);
						if (dT.type == XsDataType.String && !dT.enumeration) {
							// Special treatment of string values:
							if (opts.targetLanguage) {
								// Reduce all values to the selected language; is used for
								// - generation of human readable documents
								// - formats not supporting multiple languages (such as ReqIF):
								let txt;
								// Cycle through all values:
								for (var v of iE.values) {
									txt = LIB.languageTextOf(v, opts);
									if (RE.vocabularyTerm.test(txt)) {
										if (opts.lookupValues) txt = app.ontology.localize(txt, opts);
									}
									else {
										if (pC.format == SpecifTextFormat.Xhtml) {
											// Transform to HTML, if possible;
											// especially for publication, for example using WORD format:
											txt = txt
												.replace(/^\s+/, "")  // remove any leading whiteSpace
												.makeHTML(opts)
												.replace(/<br ?\/>\n/g, "<br/>");
											// replace filetypes of linked images:
											if (opts.allDiagramsAsImage)
												txt = refDiagramsAsImg(txt);
										}
										else {
											// if it is e.g. a title, remove all formatting:
											txt = txt
												.replace(/^\s+/, "")   // remove any leading whiteSpace
												.stripHTML();
										};
									};
									oE.values.push(LIB.makeMultiLanguageValue(txt));
								};
								return oE;
							};
							// else, keep all languages and replace filetypes of linked images;
							// this is the case when creating specif.html, where opts.allDiagramsAsImage without opts.targetLanguage is set:
							if (opts.allDiagramsAsImage) {
								let lL;
								// Cycle through all values:
								for (var v of iE.values) {
									lL = [];
									// Cycle through all languages of a value v:
									for (var l of v as SpecifMultiLanguageText)
										lL.push(l.language ? { text: refDiagramsAsImg(l.text), language: l.language } : { text: refDiagramsAsImg(l.text) });
									oE.values.push(lL);
								};
								return oE;
							}
						};
						// else, keep the complete data structure:
						oE.values = iE.values;
						//					console.debug('p2ext',iE,LIB.languageTextOf( iE.value, opts ),oE.value);
						return oE;
					};
					// skip empty properties:
					return;

					function refDiagramsAsImg(val: string): string {
						// Replace all links to application files like BPMN by links to SVG images:
						let replaced = false;
						// @ts-ignore - $0 is never read, but must be specified anyways
						val = val.replace(RE.tagObject, ($0: string, $1: string, $2: string) => {
							//								console.debug('#a', $0, $1, $2);
							if ($1) $1 = $1.replace(RE.attrType, ($4: string, $5: string) => {
								//								console.debug('#b', $4, $5);
								// ToDo: Further application file formats ... once in use.
								// Use CONFIG.applTypes ... once appropriate.
								if (["application/bpmn+xml"].includes($5)) {
									replaced = true;
									return 'type="image/svg+xml"'
								}
								else
									return $4;
							});
							// @ts-ignore - $6 is never read, but must be specified anyways
							if (replaced) $1 = $1.replace(RE.attrData, ($6: string, $7: string) => {
								//								console.debug('#c', $6, $7);
								return 'data="' + $7.fileName() + '.svg"'
							});
							return '<object ' + $1 + $2;
						});
						return val;
					}
				}
				// common for all instances:
				function a2ext(iE: any) {
					var oE = i2ext(iE);
					//					console.debug('a2ext',iE,opts);
					// resources and nodes usually have individual titles, and so we will not lookup:
					// @ts-ignore - index is ok:
					oE['class'] = iE['class'];
					if (iE.alternativeIds) oE.alternativeIds = iE.alternativeIds;

					//	let pL = opts.showEmptyProperties ? normalizeProperties(iE, spD) : iE.properties;
					let pL = iE.properties;
					if (pL && pL.length > 0) oE.properties = LIB.forAll(pL, p2ext);
					return oE;
				}
				// a resource:
				function r2ext(iE: SpecifResource) {
					var oE: SpecifResource = a2ext(iE);
					// a resource title shall never be looked up (translated);
					// for example in case of the vocabulary the terms would disappear:

					//					console.debug('resource2ext',iE,oE);
					return oE;
				}
				// a statement:
				function s2ext(iE: SpecifStatement) {
					/*	// Skip statements with an open end;
						// At the end it will be checked, wether all referenced resources resp. statements are listed:
						if (!iE.subject || iE.subject.id == CONFIG.placeholder
							|| !iE.object || iE.object.id == CONFIG.placeholder
						) return;  */

					// The statements usually do use a vocabulary item (and not have an individual title),
					// so we lookup, if so desired, e.g. when exporting to ePub:
					var oE: SpecifStatement = a2ext(iE);

					oE.subject = iE.subject;
					oE.object = iE.object;

					return oE;
				}
				// a hierarchy node:
				function n2ext(iN: SpecifNode) {
					//					console.debug( 'n2ext', iN );
					// just take the non-redundant properties (omit 'title', for example):
					let oN: SpecifNode = {
						id: iN.id,
						//	resource: iN.resource,
						resource: { id: iN.resource.id },  // always reference the latest resource revision
						changedAt: iN.changedAt
					};

					if (iN.nodes && iN.nodes.length > 0)
						oN.nodes = LIB.forAll(iN.nodes, n2ext);
					if (iN.revision)
						oN.revision = iN.revision;
					return oN
				}
				function h2ext(iN: SpecifNode) {
					// Add a hierarchy root, if it is needed and it not present:
					let r = LIB.itemByKey(self.resources, iN.resource);
					if (opts && opts.createHierarchyRootIfMissing && nodeIsNoRoot(r)) {
						console.info("Adding hierarchy root to hierarchy with id '" + iN.id + "'");
						// 1. Add the referenced resource;
						// the ids of hierarchy root and resource must be constructed similary as the reqif2specif transformation:
						let rId = LIB.replacePrefix(CONFIG.prefixHR, iN.id);
						spD.resources.push({
							id: rId,
							class: LIB.makeKey("RC-Folder"),
							properties: [{
								class: LIB.makeKey("PC-Name"),
								values: [[{ text: "Root for " + iN.id }]]
							}, {
								class: LIB.makeKey("PC-Type"),
								values: [[{ text: CONFIG.hierarchyRoot }]]
							}],
							changedAt: new Date().toISOString()
						})
						// 2. Add the hierarchy root:
						return {
							id: CONFIG.prefixN + rId,
							resource: LIB.makeKey(rId),
							nodes: [n2ext(iN)],
							changedAt: new Date().toISOString()
						}
					};
					// else don't add anything:
					return n2ext(iN)
				}
				// a file:
				function f2ext(iE: SpecifFile): Promise<SpecifFile> {
					return new Promise(
						(resolve, reject) => {
							//							console.debug('f2ext',iE,opts)

							if (!opts || !opts.allDiagramsAsImage || CONFIG.imgTypes.includes(iE.type)) {
								resolve(iE);
							}
							else {
								// Transform to an image:
								// Remember to also replace any referencing links in property values!
								switch (iE.type) {
								/*	Now transformation is done during import ...
									case 'application/bpmn+xml':
										// Read and render BPMN as SVG:
										LIB.blob2text(iE, (txt: string) => {
											bpmn2svg(txt).then(
												(result) => {
													let nFileName = iE.title.fileName() + '.svg';
													resolve({
														//	blob: new Blob([result.svg], { type: "image/svg+xml; charset=utf-8" }),
														blob: new Blob([result.svg], { type: "image/svg+xml" }),
														id: 'F-' + simpleHash(nFileName),
														title: nFileName,
														type: 'image/svg+xml',
														changedAt: iE.changedAt
													} as SpecifFile)
												},
												reject
											)
										});
										break; */
									default:
										console.warn("Cannot transform file '" + iE.title + "' of type '" + iE.type + "' to an image.");
										resolve({
											id: 'F-' + simpleHash(iE.title),
											title: iE.title,
											changedAt: iE.changedAt
										} as SpecifFile)
								}
							}
						}
					)
				}
			}
		)
	}
/*	private toExt_v11(opts?: any): Promise<SpecIF> {
		// transform self.cache to SpecIF following defined options;
		// a clone is delivered.
		// if opts.targetLanguage has no value, all available languages are kept.

//		console.debug('toExt', this, opts );
		// transform internal data to SpecIF:
		return new Promise(
			(resolve, reject) => {
				let self = this,
					pend = 0;
				let	spD: SpecIF = Object.assign(
						app.ontology.makeTemplate(),
						{
							id: this.id,
							title: LIB.selectTargetLanguage(this.title, opts)
						}
					);

				// Add a resource as hierarchyRoot, if needed.
				// - all top nodes get a hierarchy root, unless they *are* a hierarchy root 
				// It is assumed,
				// - that in general SpecIF data do not have a hierarchy root with meta-data.
				// - that ReqIF specifications (=hierarchyRoots) are transformed to regular resources on input.
				// - the ReqIF import transformation adds a property titled 'dcterms:type' with value CONFIG.hierarchyRoot to each hierarchy root.
				function nodeIsNoRoot(r:SpecifResource):boolean {
					let valL = LIB.valuesByTitle(r, [CONFIG.propClassType], self);
					return valL.length < 1 || LIB.languageTextOf(valL[0], { targetLanguage: "default" }) != CONFIG.hierarchyRoot
                }
				if (opts && opts.createHierarchyRootIfMissing) {
					for (var i = this.nodes.length - 1; i > -1; i--) {
						let r = LIB.itemByKey(this.resources, this.nodes[i].resource);
						if (nodeIsNoRoot(r)) {
							// A hierarchy has no root element (as needed for ReqIF);
							// add any needed classes, so that one or more hierarchy roots can be added later in h2ext:
							let oC = app.ontology.generateSpecifClasses({ 
								terms: [CONFIG.resClassFolder], 
							//	adoptOntologyDataTypes: true, 
								referencesWithoutRevision: true, 
								delta: true
							});
							['dataTypes', 'propertyClasses', 'resourceClasses'].forEach(
								// @ts-ignore - indexing is fine
								(li) => { LIB.cacheL(spD[li], oC[li]) }
							);
							break;  // once is sufficient
						}
                    }
				};

				// if opts.targetLanguage is defined, create a multilanguageText with the selected language, only:
				if (LIB.multiLanguageValueHasContent(this.description))
					spD.description = LIB.selectTargetLanguage(this.description, opts);

				if (this.language)
					spD.language = this.language;

				if (this.rights && this.rights.title && this.rights.url)
					spD.rights = this.rights;

				if (app.me && app.me.email) {
					spD.createdBy = {
						familyName: app.me.lastName,
						givenName: app.me.firstName,
						email: app.me.email
					};
					if (app.me.organization)
						spD.createdBy.org = { organizationName: app.me.organization };
				}
				else {
					if (this.createdBy && this.createdBy.email ) {
						spD.createdBy = {
							familyName: this.createdBy.familyName,
							givenName: this.createdBy.givenName,
							email: this.createdBy.email
						};
						if (this.createdBy.org && this.createdBy.org.organizationName)
							spD.createdBy.org = this.createdBy.org;
					};
					// else: don't add createdBy without data
				};

				// Now start to assemble the SpecIF output:
				LIB.cacheL(spD.dataTypes, LIB.forAll(this.dataTypes, dT2ext));
				LIB.cacheL(spD.propertyClasses, LIB.forAll(this.propertyClasses, pC2ext));
				LIB.cacheL(spD.resourceClasses, LIB.forAll(this.resourceClasses, rC2ext));
				LIB.cacheL(spD.statementClasses, LIB.forAll(this.statementClasses, sC2ext));
				for( var f of this.files ) {
					pend++;
					f2ext(f)
					.then(
						(oF: SpecifFile) =>{
							spD.files.push(oF);
							if (--pend < 1) finalize();
						},
						reject
					);
				};
				LIB.cacheL(spD.resources, LIB.forAll((this.resources), r2ext));
				LIB.cacheL(spD.statements, LIB.forAll(this.statements, s2ext));
				// @ts-ignore - hierarchy is correct vor v1.1
				LIB.cacheL(spD.hierarchies, LIB.forAll(this.nodes, h2ext));

				if (pend < 1) finalize();  // no files, so finalize right away
				return;

				function finalize() {
					// ToDo: schema and consistency check (if we want to detect any programming errors)
//					console.debug('specif.toExt exit',spD);
					resolve(spD);
				}

				// common for all items:
				function i2ext(iE:any) {
					var oE:any = {
						id: iE.id,
						changedAt: iE.changedAt
					};
					// most items must have a title, but resources and statements come without:
					if (iE.title) oE.title = LIB.titleOf(iE, opts);
					// if opts.targetLanguage is defined, create a multilanguageText with the selected language, only:
					if (LIB.multiLanguageValueHasContent(iE.description)) oE.description = LIB.makeMultiLanguageValue(LIB.languageTextOf(iE.description, opts));
					if (iE.revision) oE.revision = iE.revision;
					if (iE.replaces) oE.replaces = iE.replaces;
					if (iE.changedBy && iE.changedBy != CONFIG.userNameAnonymous) oE.changedBy = iE.changedBy;
					return oE;
				}
				// a data type:
				function dT2ext(iE: SpecifDataType) {
					
					// If it is a complex dataType, skip it:
					if(iE.type == XsDataType.ComplexType ) {
						console.info("Complex dataType '"+iE.id+"' skipped, because it is not supported with SpecIF version < 1.2 ");
						return // undefined
					};

					var oE: SpecifDataType = i2ext(iE);
					oE.type = iE.type;
					switch (iE.type) {
						case XsDataType.Double:
							if (iE.fractionDigits) oE.fractionDigits = iE.fractionDigits;
						case XsDataType.Integer:
							if (typeof (iE.minInclusive) == 'number') oE.minInclusive = iE.minInclusive;
							if (typeof (iE.maxInclusive) == 'number') oE.maxInclusive = iE.maxInclusive;
							break;
						case XsDataType.String:
							if (iE.maxLength) oE.maxLength = iE.maxLength;
					};
					// Look for enumerated values;
					// every dataType except xs:boolean may have enumerated values:
					if (iE.enumeration) {
						if (iE.type == XsDataType.String && opts.targetLanguage)
							// reduce to the language specified:
							oE.enumeration = iE.enumeration.map(
								(v: any) => {
									let txt = LIB.languageTextOf(v.value, opts);
									if (opts.lookupValues) txt = app.ontology.localize(txt, opts);
									return { id: v.id, value: LIB.makeMultiLanguageValue(txt) }
								}
							)
						else
							oE.enumeration = iE.enumeration;
					};

					return oE
				}
				// a property class:
				function pC2ext(iE: SpecifPropertyClass) {
					// Skip propertyClass, if it references a non-existing dataType;
					// for example, complexTypes are omitted, because they aren't supported with SpecIF version <1.2:
					// ToDo

					var oE: SpecifPropertyClass = i2ext(iE);
					if (iE.values) oE.values = iE.values;  // default values
					oE.dataType = iE.dataType;

					if (iE.multiple) oE.multiple = true;

					// ToDo: select language, if opts.targetLanguage is defined
					if (iE.values) oE.values = iE.values;
					if (iE.format) oE.format = iE.format;
					if (iE.unit) oE.unit = iE.unit;

					return oE
				}
				// common for all instance classes:
				function aC2ext(iE:any) {
					var oE = i2ext(iE);
					if (iE.icon) oE.icon = iE.icon;
					if (iE.instantiation) oE.instantiation = iE.instantiation;
					// @ts-ignore - index is ok:
					if (iE['extends']) oE['extends'] = iE['extends'];
					if (iE.propertyClasses && iE.propertyClasses.length > 0) oE.propertyClasses = iE.propertyClasses;
					return oE
				}
				// a resource class:
				function rC2ext(iE: SpecifResourceClass) {
					var oE: SpecifResourceClass = aC2ext(iE) as SpecifResourceClass;
					// Include "isHeading" in SpecIF only if true:
					if (iE.isHeading) oE.isHeading = true;
					// resourceClasses must have a list of propertyClasses with at least one element:
					if (Array.isArray(oE.propertyClasses) && oE.propertyClasses.length > 0 || LIB.isKey(oE['extends']))
						return oE;
					// else (shouldn't arrive here, at all):
					console.error('Skipping resourceClass with id="'+iE.id+'" on export, because it does not specify any propertyClasses.');
					// return undefined ... and the element will not be listed in the list of resourceClasses
				}
				// a statement class:
				function sC2ext(iE: SpecifStatementClass) {
					var oE: SpecifStatementClass = aC2ext(iE) as SpecifStatementClass;
					if (iE.isUndirected) oE.isUndirected = iE.isUndirected;
					if (iE.subjectClasses && iE.subjectClasses.length > 0) oE.subjectClasses = iE.subjectClasses;
					if (iE.objectClasses && iE.objectClasses.length > 0) oE.objectClasses = iE.objectClasses;
					return oE
				}
				// a property:
				function p2ext(iE: SpecifProperty) {
					// Skip property, if it references a non-existing propertyClass;
					// for example, complexTypes are omitted, because they aren't supported with SpecIF version <1.2:
					// ToDo

					if (opts.showEmptyProperties || Array.isArray(iE.values) && iE.values.length>0) {
						// Skip certain properties;
						// - if a hidden property is defined with value, it is suppressed only if it has this value
						// - if the value is undefined, the property is suppressed in all cases
						let pC: SpecifPropertyClass = LIB.itemByKey(spD.propertyClasses, iE['class']);
						if (Array.isArray(opts.skipProperties)) {
							for (var sP of opts.skipProperties) {
								if (sP.title == pC.title && (sP.value == undefined || sP.value == LIB.displayValueOf(iE.values[0], opts))) return;
							};
						};

						var oE: SpecifProperty = {
							class: iE['class'],
							values: []
						};

						// According to the schema, all property values are represented by a string
						// and we want to store them as string to avoid inaccuracies by multiple transformations.
						let dT: SpecifDataType = LIB.itemByKey(spD.dataTypes, pC.dataType);
						if (dT.type == XsDataType.String && !dT.enumeration) {
							// Special treatment of string values:
							if (opts.targetLanguage) {
								// Reduce all values to the selected language; is used for
								// - generation of human readable documents
								// - formats not supporting multiple languages (such as ReqIF):
								let txt;
								// Cycle through all values:
								for (var v of iE.values) {
									txt = LIB.languageTextOf(v, opts);
									if (RE.vocabularyTerm.test(txt)) {
										if (opts.lookupValues) txt = app.ontology.localize(txt, opts);
									}
									else {
										if (pC.format == SpecifTextFormat.Xhtml) {
											// Transform to HTML, if possible;
											// especially for publication, for example using WORD format:
											txt = txt
												.replace(/^\s+/, "")  // remove any leading whiteSpace
												.makeHTML(opts)
												.replace(/<br ?\/>\n/g, "<br/>");
											// replace filetypes of linked images:
											if (opts.allDiagramsAsImage)
												txt = refDiagramsAsImg(txt);
										}
										else {
											// if it is e.g. a title, remove all formatting:
											txt = txt
												.replace(/^\s+/, "")   // remove any leading whiteSpace
												.stripHTML();
										};
									};
									oE.values.push(LIB.makeMultiLanguageValue(txt));
								};
								return oE;
							};
							// else, keep all languages and replace filetypes of linked images;
							// this is the case when creating specif.html, where opts.allDiagramsAsImage without opts.targetLanguage is set:
							if (opts.allDiagramsAsImage) {
								let lL;
								// Cycle through all values:
								for (var v of iE.values) {
									lL = [];
									// Cycle through all languages of a value v:
									for (var l of v as SpecifMultiLanguageText)
										lL.push(l.language ? { text: refDiagramsAsImg(l.text), language: l.language } : { text: refDiagramsAsImg(l.text) });
									oE.values.push(lL);
								};
								return oE;
							}
						};
						// else
						if (Array.isArray(dT.enumeration)) {
							oE.values = iE.values.map(v => v.id);  // for <v1.2, the pointers to enumerated values are not enclosed in an object with label id
						};
						// else, keep the complete data structure:
						oE.values = iE.values;
						//					console.debug('p2ext',iE,LIB.languageTextOf( iE.value, opts ),oE.value);
						return oE;
					};
					// skip empty properties:
					return;

					function refDiagramsAsImg(val: string): string {
						// Replace all links to application files like BPMN by links to SVG images:
						let replaced = false;
						// @ts-ignore - $0 is never read, but must be specified anyways
						val = val.replace(RE.tagObject, ($0: string, $1: string, $2: string) => {
//								console.debug('#a', $0, $1, $2);
							if ($1) $1 = $1.replace(RE.attrType, ($4:string, $5:string) => {
//								console.debug('#b', $4, $5);
								// ToDo: Further application file formats ... once in use.
								// Use CONFIG.applTypes ... once appropriate.
								if (["application/bpmn+xml"].includes($5)) {
									replaced = true;
									return 'type="image/svg+xml"'
								}
								else
									return $4;
							});
							// @ts-ignore - $6 is never read, but must be specified anyways
							if (replaced) $1 = $1.replace(RE.attrData, ($6: string, $7: string) => {
//								console.debug('#c', $6, $7);
								return 'data="' + $7.fileName() + '.svg"'
							});
							return '<object ' + $1 + $2;
						});
						return val;
                    }
				}
				// common for all instances:
				function a2ext(iE:any) {
					var oE = i2ext(iE);
//					console.debug('a2ext',iE,opts);
					// resources and hierarchies usually have individual titles, and so we will not lookup:
					// @ts-ignore - index is ok:
					oE['class'] = iE['class'];
					if (iE.alternativeIds) oE.alternativeIds = iE.alternativeIds;

				//	let pL = opts.showEmptyProperties ? normalizeProperties(iE, spD) : iE.properties;
					let pL = iE.properties;
					if (pL && pL.length > 0) oE.properties = LIB.forAll(pL, p2ext);
					return oE;
				}
				// a resource:
				function r2ext(iE: SpecifResource) {
					var oE: SpecifResource = a2ext(iE);
					// a resource title shall never be looked up (translated);
					// for example in case of the vocabulary the terms would disappear:

//					console.debug('resource2ext',iE,oE);
					return oE;
				}
				// a statement:
				function s2ext(iE: SpecifStatement) {
					// Skip statements with an open end;
					// At the end it will be checked, wether all referenced resources resp. statements are listed:
				//	if (!iE.subject || iE.subject.id == CONFIG.placeholder
				//		|| !iE.object || iE.object.id == CONFIG.placeholder
				//	) return;

					// The statements usually do use a vocabulary item (and not have an individual title),
					// so we lookup, if so desired, e.g. when exporting to ePub:
					var oE: SpecifStatement = a2ext(iE);

					oE.subject = iE.subject;
					oE.object = iE.object;

					return oE;
				}
				// a hierarchy node:
				function n2ext(iN: SpecifNode) {
//					console.debug( 'n2ext', iN );
					// just take the non-redundant properties (omit 'title', for example):
					let oN: SpecifNode = {
						id: iN.id,
					//	resource: iN.resource,
						resource: { id: iN.resource.id },  // always reference the latest resource revision
						changedAt: iN.changedAt
					};
					
					if (iN.nodes && iN.nodes.length > 0)
						oN.nodes = LIB.forAll(iN.nodes, n2ext);
					if (iN.revision)
						oN.revision = iN.revision;
					return oN
				}
				function h2ext(iN: SpecifNode) {
					// Add a hierarchy root, if it is needed and it not present:
					let r = LIB.itemByKey(self.resources, iN.resource);
					if (opts && opts.createHierarchyRootIfMissing && nodeIsNoRoot(r) ) {
						console.info("Adding hierarchy root to hierarchy with id '"+iN.id+"'");
						// 1. Add the referenced resource;
						// the ids of hierarchy root and resource must be constructed similary as the reqif2specif transformation:
						let rId = LIB.replacePrefix(CONFIG.prefixHR, iN.id);
						spD.resources.push({
							id: rId,
							class: LIB.makeKey("RC-Folder"),
							properties: [{
								class: LIB.makeKey("PC-Name"),
								values: [[{ text: "Root for "+iN.id }]]
							}, {
								class: LIB.makeKey("PC-Type"),
								values: [[{ text: CONFIG.hierarchyRoot }]]
							}],
							changedAt: new Date().toISOString()
                        })
						// 2. Add the hierarchy root:
						return {
							id: CONFIG.prefixN + rId,
							resource: LIB.makeKey(rId),
							nodes: [n2ext(iN)],
							changedAt: new Date().toISOString()
                        }
					};
					// else don't add anything:
					return n2ext(iN)
				}
				// a file:
				function f2ext(iE: SpecifFile): Promise<SpecifFile> {
					return new Promise(
						(resolve, reject) => {
//							console.debug('f2ext',iE,opts)

							if (!opts || !opts.allDiagramsAsImage || CONFIG.imgTypes.includes(iE.type) ) {
							//	var oE: SpecifFile = {
							//		id: iE.id,
							//		title: iE.title,
							//		type: iE.type,
							//		changedAt: iE.changedAt
							//	};
							//	if (iE.revision) oE.revision = iE.revision;
							//	if (iE.changedBy) oE.changedBy = iE.changedBy;
							//	if (iE.blob) oE.blob = iE.blob;
							//	if (iE.dataURL) oE.dataURL = iE.dataURL;
							//	resolve(oE);
								resolve(iE);
							}
							else {
								// Transform to an image:
								// Remember to also replace any referencing links in property values!
								switch (iE.type) {
									case 'application/bpmn+xml':
										// Read and render BPMN as SVG:
										LIB.blob2text(iE, (txt: string) => {
											bpmn2svg(txt).then(
												(result) => {
													let nFileName = iE.title.fileName() + '.svg';
													resolve({
														//	blob: new Blob([result.svg], { type: "image/svg+xml; charset=utf-8" }),
														blob: new Blob([result.svg], { type: "image/svg+xml" }),
														id: 'F-' + simpleHash(nFileName),
														title: nFileName,
														type: 'image/svg+xml',
														changedAt: iE.changedAt
													} as SpecifFile )
												},
												reject
											)
										});
										break;
									default:
										console.warn("Cannot transform file '" + iE.title + "' of type '" + iE.type + "' to an image.");
										resolve({
											id: 'F-' + simpleHash(iE.title),
											title: iE.title,
											changedAt: iE.changedAt
										} as SpecifFile)
								}
							}
						}
					)
				}
			}
		)
	}
	private toExt_v10(opts?: any): Promise<SpecIF> {
		// transform self.cache to SpecIF v1.0 following defined options;
		// a clone is delivered.
		// if opts.targetLanguage has no value, all available languages are kept.

//		console.debug('toExt_v10', this, opts );
		// v1.0 uses less multilanguageText, so v1.1+ multilanguageText must be reduced in many places:
		const myLang = { targetLanguage: opts.targetLanguage || this.language || 'en' };
		// transform internal data to SpecIF:
		return new Promise(
			(resolve, reject) => {
				var pend = 0,
					// @ts-ignore - the missing attributes will come below:
					spD: SpecIF = {
						id: this.id,
						title: LIB.languageTextOf(this.title, myLang),
						$schema: 'https://specif.de/v1.0/schema.json',
						generator: app.title,
						generatorVersion: CONFIG.appVersion,
						createdAt: new Date().toISOString()
					};

				if (LIB.multiLanguageValueHasContent(this.description)) spD.description = LIB.languageTextOf(this.description, myLang);
				if (this.language) spD.language = this.language;

				if (this.rights && this.rights.title && this.rights.url)
					spD.rights = this.rights;
				else
					spD.rights = {
						title: "Creative Commons 4.0 CC BY-SA",
						url: "https://creativecommons.org/licenses/by-sa/4.0/"
					};

				if (app.me && app.me.email) {
					spD.createdBy = {
						familyName: app.me.lastName,
						givenName: app.me.firstName,
						// @ts-ignore - correct with v1.0
						email: { value: app.me.email, type: "text/html" }
					};
					if (app.me.organization)
						spD.createdBy.org = { organizationName: app.me.organization };
				}
				else {
					if (this.createdBy && this.createdBy.email) {
						spD.createdBy = {
							familyName: this.createdBy.familyName,
							givenName: this.createdBy.givenName,
							// @ts-ignore - correct with v1.0
							email: { value: this.createdBy.email, type: "text/html" }
						};
						if (this.createdBy.org && this.createdBy.org.organizationName)
							spD.createdBy.org = this.createdBy.org;
					};
					// else: don't add createdBy without data
				};

				// Now start to assemble the SpecIF output:
				spD.dataTypes = LIB.forAll(this.dataTypes, dT2ext);
				spD.propertyClasses = LIB.forAll(this.propertyClasses, pC2ext);
				spD.resourceClasses = LIB.forAll(this.resourceClasses, rC2ext);
				spD.statementClasses = LIB.forAll(this.statementClasses, sC2ext);
				spD.files = [];
				for (var f of this.files) {
					pend++;
					f2ext(f)
						.then(
							(oF: SpecifFile) => {
								spD.files.push(oF);
								if (--pend < 1) finalize();
							},
							reject
						);
				};
				spD.resources = LIB.forAll((this.resources), r2ext);
				spD.statements = LIB.forAll(this.statements, s2ext);
				// @ts-ignore - hierarchy is correct vor v1.0
				spD.hierarchies = LIB.forAll(this.nodes, n2ext);

				if (pend < 1) finalize();  // no files, so finalize right away
				return;

				function finalize() {
					// ToDo: schema and consistency check (if we want to detect any programming errors)
//					console.debug('specif.toExt_v10 exit', spD);
					resolve(spD);
				}

				// common for all items:
				function i2ext(iE: any) {
					var oE: any = {
						id: iE.id,
						changedAt: iE.changedAt
					};
					// most items must have a title, but resources and statements come without:
					if (iE.title) oE.title = LIB.titleOf(iE, opts);
					if (LIB.multiLanguageValueHasContent(iE.description)) oE.description = LIB.languageTextOf(iE.description, myLang);
					if (iE.revision) oE.revision = iE.revision;
					if (iE.replaces) oE.replaces = iE.replaces;
					if (iE.changedBy) oE.changedBy = iE.changedBy;
					return oE;
				}
				// a data type:
				function dT2ext(iE: SpecifDataType) {

					// If it is a complex dataType, skip it:
					if (iE.type == XsDataType.ComplexType) {
						console.info("Complex dataType '" + iE.id + "' skipped, because it is not supported with SpecIF version < 1.2 ");
						return // undefined
					};

					var oE: SpecifDataType = i2ext(iE);
					switch (iE.type) {
						case XsDataType.Double:
							if (iE.fractionDigits) oE.fractionDigits = iE.fractionDigits;
						case XsDataType.Integer:
							if (typeof (iE.minInclusive) == 'number') oE.minInclusive = iE.minInclusive;
							if (typeof (iE.maxInclusive) == 'number') oE.maxInclusive = iE.maxInclusive;
							break;
						case XsDataType.String:
							if (iE.maxLength) oE.maxLength = iE.maxLength;
					};
					// Look for enumerated values:
					// - every dataType except xs:boolean may have enumerated values
					// - in v1.0 there are only enumerated values of type xs:string, so any other type is lost
					if (iE.enumeration) {
						// reduce to the language specified:
						// @ts-ignore - values does exist with v1.0
						oE.values = LIB.forAll(
							iE.enumeration,
							(v: any) => {
								return { id: v.id, value: LIB.languageTextOf(v.value, myLang) }
							//	return { id: v.id, value: (opts.lookupValues ? app.ontology.localize(LIB.languageTextOf(v.value, myLang)): LIB.languageTextOf(v.value, myLang)) }
							}
						);
						// @ts-ignore - OK with v1.0
						oE.type = 'xs:enumeration';
					}
					else
						oE.type = iE.type;

					return oE;
				}
				// a property class:
				function pC2ext(iE: SpecifPropertyClass) {

					// Skip propertyClass, if it references a non-existing dataType;
					// for example, complexTypes are omitted, because they aren't supported with SpecIF version <1.2:
					// ToDo

					var oE: SpecifPropertyClass = i2ext(iE);
					if (iE.values) oE.values = iE.values;  // default values
					oE.dataType = iE.dataType;

					if (iE.multiple) oE.multiple = true;

					if (iE.values) {
						// @ts-ignore - 'value' in case of SpecIF v1.0:
						oE.value = iE.values[0];  // others get lost
						if (iE.values.length > 1)
							console.warn('Upon exporting to v1.0, only the first default value of '+iE.id+' can be included in the result.');
					};
					if (iE.format) oE.format = iE.format;
					if (iE.unit) oE.unit = iE.unit;

					return oE
				}
				// common for all instance classes:
				function aC2ext(iE: any) {
					var oE = i2ext(iE);
					if (iE.icon) oE.icon = iE.icon;
					if (iE.instantiation) oE.instantiation = iE.instantiation;
					// @ts-ignore - index is ok:
					if (iE['extends']) oE['extends'] = iE['extends'];
					if (iE.propertyClasses && iE.propertyClasses.length > 0) oE.propertyClasses = iE.propertyClasses;
					return oE
				}
				// a resource class:
				function rC2ext(iE: SpecifResourceClass) {
					var oE: SpecifResourceClass = aC2ext(iE) as SpecifResourceClass;
					// Include "isHeading" in SpecIF only if true:
					if (iE.isHeading) oE.isHeading = true;
					return oE
				}
				// a statement class:
				function sC2ext(iE: SpecifStatementClass) {
					var oE: SpecifStatementClass = aC2ext(iE) as SpecifStatementClass;
					if (iE.isUndirected) oE.isUndirected = iE.isUndirected;
					if (iE.subjectClasses && iE.subjectClasses.length > 0) oE.subjectClasses = iE.subjectClasses;
					if (iE.objectClasses && iE.objectClasses.length > 0) oE.objectClasses = iE.objectClasses;
					return oE
				}
				// a property:
				function p2ext(iE: SpecifProperty) {
					// Skip property, if it references a non-existing propertyClass;
					// for example, complexTypes are omitted, because they aren't supported with SpecIF version <1.2:
					// ToDo

					// skip empty properties:
					if (!iE.values || iE.values.length < 1) return;

					// Skip certain properties;
					// - if a hidden property is defined with value, it is suppressed only if it has this value
					// - if the value is undefined, the property is suppressed in all cases
					let pC: SpecifPropertyClass = LIB.itemByKey(spD.propertyClasses, iE['class']);
					if (Array.isArray(opts.skipProperties))
						for (var sP of opts.skipProperties) {
							if (sP.title == pC.title && (sP.value == undefined || sP.value == LIB.displayValueOf(iE.values[0], opts))) return;
						};

					// @ts-ignore - no 'values' in case of v1.0
					var oE: SpecifProperty = {
						class: iE['class']
					};

					// According to the schema, all property values are represented by a string
					// and we want to store them as string to avoid inaccuracies by multiple transformations.
					let dT: SpecifDataType = LIB.itemByKey(spD.dataTypes, pC.dataType);

					// Multiple enum values are accepted in SpecIF 1.0:
					// @ts-ignore - 'xs:enumeration' is ok for v1.0
					if (dT.type == 'xs:enumeration') {
						// @ts-ignore - 'value' is ok for v1.0
						oE.value = "";
						for (var v of iE.values) {
							// @ts-ignore - 'value' is ok for v1.0
							oE.value += (oE.value.length>0? ", ":"") + v.id
						};
						return oE
					};

					if (iE.values.length > 1)
						console.warn('When transforming to SpecIF v1.0, only the first value of a property of class ' + iE['class'].id + ' has been taken.');

				//	if ([XsDataType.String,'xhtml'].includes(dT.type)) {
					if (dT.type == XsDataType.String) {
						// Special treatment of string values:
						let v = iE.values[0] as SpecifMultiLanguageText;
						if (opts.targetLanguage) {
							// Reduce all values to the selected language; is used for
							// - generation of human readable documents
							// - formats not supporting multiple languages:

							// Take the first value, as v1.0 supports only one value:
							let txt = LIB.languageTextOf(v, opts)
										.replace(/^\s+/, "");   // remove any leading whiteSpace

							if (!RE.vocabularyTerm.test(txt)) {
							//	if (!CONFIG.excludedFromFormatting.includes(pC.title)) {
							//	if (app.ontology.propertyClassIsFormatted(pC.title)) {

								// Assuming that pC.format has been set correctly during import:
								if ( pC.format == SpecifTextFormat.Xhtml) {
									// Transform to HTML, if possible;
									// especially for publication, for example using WORD format:
									txt = txt
										.makeHTML(opts)
										.replace(/<br ?\/>\n/g, "<br/>");
									// replace filetypes of linked images:
									if (opts.allDiagramsAsImage)
										txt = refDiagramsAsImg(txt);
								}
								else {
									// if it is e.g. a title, remove all formatting:
									txt = txt
										.stripHTML();
								}
							};
							// @ts-ignore - OK for v1.0
							oE.value = opts.lookupValues ? app.ontology.localize(txt, opts) : txt;

						//	if (LIB.isHTML(txt))
						//		// @ts-ignore - OK for v1.0
						//		dT.type = 'xhtml'
						//	else
						//		// Cycle through all languageValues and check for format attribute:
						//		for (var l of v) {
						//			// @ts-ignore - OK for v1.0
						//			if (l.format == 'xhtml') dT.type = 'xhtml';
						//			break;
						//		};
						}
						else {
							// Keep all languages and possibly replace filetypes of linked images:
							// @ts-ignore - OK for v1.0
							oE.value = [];
							// Cycle through all languages of a value v:
							// - Keep text and language
							// - Ignore format, as it is not acceptable for v1.0 here 
							// - the language attribute is required in v1.0, whereas in v1.1 only if multiple languages are present
							for (var l of v)
								// @ts-ignore - OK for v1.0
								oE.value.push(l.language ? { text: refDiagramsAsImg(l.text), language: l.language } : { text: refDiagramsAsImg(l.text) });
							//	oE.value.push(l.language ? { text: refDiagramsAsImg(l.text), language: l.language || '?' } : { text: refDiagramsAsImg(l.text) });
						};
						return oE;
					};
					// else, take the first value, as v1.0 supports only one value:

					// @ts-ignore - OK for v1.0
					oE.value = iE.values[0];
//					console.debug('p2ext',iE,LIB.languageTextOf( iE.value, opts ),oE.value);
					return oE;

					function refDiagramsAsImg(val: string): string {
						if (!opts || !opts.allDiagramsAsImage) return val;

						// Replace all links to application files like BPMN by links to SVG images:
						let replaced = false;
						// @ts-ignore - $0 is never read, but must be specified anyways
						val = val.replace(RE.tagObject, ($0: string, $1: string, $2: string) => {
//							console.debug('#a', $0, $1, $2);
							if ($1) $1 = $1.replace(RE.attrType, ($4: string, $5: string) => {
//								console.debug('#b', $4, $5);
								// ToDo: Further application file formats ... once in use.
								// ToDo: Use CONFIG.applTypes ... if appropriate.
								if (["application/bpmn+xml"].includes($5)) {
									replaced = true;
									return 'type="image/svg+xml"'
								}
								else
									return $4;
							});
							// @ts-ignore - $6 is never read, but must be specified anyways
							if (replaced) $1 = $1.replace(RE.attrData, ($6: string, $7: string) => {
//								console.debug('#c', $6, $7);
								return 'data="' + $7.fileName() + '.svg"'
							});
							return '<object ' + $1 + $2;
						});
						return val;
					}
				}
				// common for all instances:
				function a2ext(iE: any) {
					var oE = i2ext(iE);
//					console.debug('a2ext',iE,opts);
					// resources and hierarchies usually have individual titles, and so we will not lookup:
					// @ts-ignore - index is ok:
					oE['class'] = iE['class'];
					if (iE.alternativeIds) oE.alternativeIds = iE.alternativeIds;

					//	let pL = opts.showEmptyProperties ? normalizeProperties(iE, spD) : iE.properties;
					let pL = iE.properties;
					if (pL && pL.length > 0) oE.properties = LIB.forAll(pL, p2ext);
					return oE;
				}
				// a resource:
				function r2ext(iE: SpecifResource) {
					var oE: SpecifResource = a2ext(iE);
					// a resource title shall never be looked up (translated);
					// for example in case of the vocabulary the terms would disappear:

					// @ts-ignore - 'title' is required in case of v1.0
					oE.title = '';
//					console.debug('resource2ext',iE,oE);
					return oE;
				}
				// a statement:
				function s2ext(iE: SpecifStatement) {
					//	// Skip statements with an open end;
					//	// At the end it will be checked, wether all referenced resources resp. statements are listed:
					//	if (!iE.subject || iE.subject.id == CONFIG.placeholder
					//		|| !iE.object || iE.object.id == CONFIG.placeholder
					//	) return;

					// The statements usually do use a vocabulary item (and not have an individual title),
					// so we lookup, if so desired, e.g. when exporting to ePub:
					var oE: SpecifStatement = a2ext(iE);

					oE.subject = iE.subject;
					oE.object = iE.object;

					return oE;
				}
				// a hierarchy node:
				function n2ext(iN: SpecifNode) {
					//					console.debug( 'n2ext', iN );
					// just take the non-redundant properties (omit 'title', for example):
					let oN: SpecifNode = {
						id: iN.id,
					//	resource: iN.resource,
						resource: { id: iN.resource.id },  // always reference the latest resource revision
						changedAt: iN.changedAt
					};

					if (iN.nodes && iN.nodes.length > 0)
						oN.nodes = LIB.forAll(iN.nodes, n2ext);
					if (iN.revision)
						oN.revision = iN.revision;
					return oN
				}
				// a file:
				function f2ext(iE: SpecifFile): Promise<SpecifFile> {
					return new Promise(
						(resolve, reject) => {
							//							console.debug('f2ext',iE,opts)

							if (!opts || !opts.allDiagramsAsImage || CONFIG.imgTypes.includes(iE.type)) {
								//	var oE: SpecifFile = {
								//		id: iE.id,
								//		title: iE.title,
								//		type: iE.type,
								//		changedAt: iE.changedAt
								//	};
								//	if (iE.revision) oE.revision = iE.revision;
								//	if (iE.changedBy) oE.changedBy = iE.changedBy;
								//	if (iE.blob) oE.blob = iE.blob;
								//	if (iE.dataURL) oE.dataURL = iE.dataURL;
								//	resolve(oE);
								resolve(iE);
							}
							else {
								// Transform to an image:
								// Remember to also replace any referencing links in property values!
								switch (iE.type) {
									case 'application/bpmn+xml':
										// Read and render BPMN as SVG:
										LIB.blob2text(iE, (txt: string) => {
											bpmn2svg(txt).then(
												(result) => {
													let nFileName = iE.title.fileName() + '.svg';
													resolve({
														//	blob: new Blob([result.svg], { type: "image/svg+xml; charset=utf-8" }),
														blob: new Blob([result.svg], { type: "image/svg+xml" }),
														id: 'F-' + simpleHash(nFileName),
														title: nFileName,
														type: 'image/svg+xml',
														changedAt: iE.changedAt
													} as SpecifFile)
												},
												reject
											)
										});
										break;
									default:
										//	console.warn("Cannot transform file '" + iE.title + "' of type '" + iE.type + "' to an image.");
										//	resolve();
										reject(new resultMsg( 999, "Cannot transform file '" + iE.title + "' of type '" + iE.type + "' to an image." ))
								}
							}
						}
					)
				}
			}
		)
	} */
}
