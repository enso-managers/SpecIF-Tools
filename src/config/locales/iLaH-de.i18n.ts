/* 	Provide i18ns and messages in a certain language, in this case 'Deutsch' (de).
	The result can be obtained by reference of:
	- yourVarName.MsgText (in most cases, when there are only characters allowed for js variable names)
	- yourVarName.lookup('MsgName', 'param')
	- In the messages defined below, '~A' can be inserted at the location where a call parameter shall be placed.

	Search Icons: https://fontawesome.com/v4.7/icons/
*/
function LanguageTextsDe() {
    var self:any = {};
	self.lookup = function( lb:string, pA:string ):string { 
		// replace a variable '~A' with pA, if available:
		if (lb) {
			// toJsId(): first replace '.' '-' '(' ')' and white-space by '_'
			let res = self[lb.toJsId()] || lb;
            if (pA) return res.replace(/~A/, pA);
            return res;
		};
		return '';
	};

//	self.IcoUser = '<i class="bi-person"></i>';
	self.IcoSpecification = '<i class="bi-book"></i>';
	self.IcoRead = '<i class="bi-eye"></i>';
	self.IcoImport = '<i class="bi-box-arrow-in-right"></i>';
	self.IcoExport = '<i class="bi-box-arrow-right"></i>';
	self.IcoAdminister = '<i class="bi-wrench"></i>';
//	self.IcoUpdateSpecification =
	self.IcoEdit = '<i class="bi-pencil"></i>';
	self.IcoDelete = '<i class="bi-x-lg"></i>';
	self.IcoAdd = '<i class="bi-plus-lg"></i>';
	self.IcoClone = '<i class="bi-files"></i>';
	self.IcoSave = '<i class="bi-check-lg"></i>';
//	self.IcoReadSpecification = self.IcoRead;
	self.IcoPrevious = '<i class="bi-chevron-up"></i>';
	self.IcoNext = '<i class="bi-chevron-down"></i>';
	self.IcoFilter = '<i class="bi-search"></i>';
	self.IcoType = '<i class="bi-wrench"></i>';
//	self.IcoGo =
//	self.IcoFind = '<i class="bi-search"></i>';
	self.IcoComment = '<i class="bi-chat"></i>';
//	self.IcoURL = '<span class="glyphicon glyphicon-map-marker"></span>';
//	self.IcoLogout = '<span class="glyphicon glyphicon-log-out"></span>';
	self.IcoAbout = '<strong>&#169;</strong>'; // copyright sign
//	self.IcoAbout = '<i class="fa fa-copyright"></i>';
	self.IcoRelation = '<i class="bi-link-45deg" ></i>';
	self.IcoReport = '<i class="bi-bar-chart-line" ></i>';

// Buttons:
//	self.LblImportReqif = 'ReqIF Import';
//	self.LblImportCsv = 'CSV Import';
//	self.LblImportXls = 'XLS Import';
//	self.LblExportPdf = 'PDF Export';
	self.LblAll = "Alle";
	self.LblAllObjects = "Alle Ressourcen";
	self.LblOntology = "Ontologie";
	self.LblImport = 'Importieren';
	self.LblExport = 'Exportieren';
	self.LblExportReqif = 'ReqIF-Datei exportieren';
	self.LblExportSpecif = 'SpecIF-Datei exportieren';
	self.LblAdminister = 'Administrieren';
	self.LblCreate ="Anlegen";
	self.LblRead = 'Lesen';
	self.LblUpdate = 'Aktualisieren';
	self.LblUpdateProject = 'Projekt-Eigenschaften aktualisieren';
	self.LblUpdateSpec = 'Gliederungs-Eigenschaften aktualisieren';
	self.LblUpdateTypes = 'Typen und Rechte aktualisieren';
	self.LblUpdateObject = 'Diese Ressource aktualisieren';
	self.LblDelete = 'Löschen';
	self.LblDeleteProject = 'Dieses Projekt löschen';
	self.LblDeleteType = 'Diesen Typ löschen';
	self.LblDeleteObject = 'Diese Ressource löschen';
	self.LblDeleteAttribute = 'Dieses Attribut löschen';
	self.LblDeleteRelation = 'Relation (Aussage) löschen';
	self.LblDeleteRole = 'Rolle löschen';
	self.LblAdd = 'Anlegen';
	self.LblAddItem = '~A anlegen';
	self.LblAddProject = "Projekt anlegen";
	self.LblAddType = "Typ anlegen";
	self.LblAddDataType = 'Datentyp anlegen';
	self.LblAddObjType = 'Ressource-Typ anlegen';
	self.LblAddRelType = 'Relation-Typ anlegen';
	self.LblAddSpcType = 'Gliederungs-Typ anlegen';
	self.LblAddTypeComment = 'Typen für Kommentare anlegen';
	self.LblAddObject = "Ressource anlegen";
	self.LblAddRelation = "Relation (Aussage) anlegen";
	self.LblAddAttribute = "Attribut anlegen";
	self.LblAddUser = "Nutzer anlegen";
	self.LblAddComment = 'Kommentieren';
	self.LblAddCommentTo = "Einen Kommentar zu '~A' hinzufügen:";
	self.LblAddCommentToObject = 'Diese Ressource kommentieren';
	self.LblAddFolder = "Ordner anlegen";
	self.LblAddSpec = "Gliederung anlegen";
	self.LblClone = 'Klonen';
	self.LblCloneObject = 'Diese Ressource klonen';
	self.LblCloneType = 'Diesen Typ klonen';
	self.LblCloneSpec = 'Diese Gliederung klonen';
	self.LblUserName = 'Nutzername';
	self.LblPassword = 'Kennwort';
	self.LblTitle = 'Titel';
	self.LblProject = 'Projekt';
	self.LblName = 'Name';
	self.LblFirstName = 'Vorname';
	self.LblLastName = 'Nachname';
	self.LblOrganizations = 'Organisation';  // until multiple orgs per user are supported
	self.LblEmail = 'e-mail';
	self.LblFileName = 'Dateiname';
/*	self.LblRoleGeneralAdmin = 'GENERAL-ADMIN';
	self.LblRoleProjectAdmin = 'PROJECT-ADMIN';
	self.LblRoleUserAdmin = 'USER-ADMIN';
	self.LblRoleReader = "SpecIF:Reader";
//	self.LblRoleReqif = 'REQIF'; */
	self.LblGlobalActions = 'Aktionen';
	self.LblItemActions = 'Aktionen';
	self.LblIdentifier = 'Identifikator';
	self.LblProjectName = 'Projektname';
	self.LblDescription = 'Beschreibung';
	self.LblState = 'Status';
	self.LblPriority = 'Priorität';
	self.LblCategory = 'Kategorie';
	self.LblAttribute = 'Attribut';
	self.LblAttributes = 'Attribute';
	self.LblAttributeValueRange = "Wertebereich";
	self.LblAttributeValues = "Werte";
	self.LblAttributeValue = "Wert";
	self.LblTool = 'Autoren-Werkzeug';
	self.LblMyRole = 'Meine Rolle';
	self.LblRevision = 'Revision';
	self.LblCreatedAt = 'Erstellt am';
	self.LblCreatedBy = 'Erstellt von';
	self.LblCreatedThru = 'Erstellt durch';
	self.LblModifiedAt = 'Geändert am';
	self.LblModifiedBy = 'Geändert von';
	self.LblProjectDetails = 'Eigenschaften';
//	self.LblProjectUsers = self.IcoUser+'&#160;Nutzer dieses Projekts';
//	self.LblOtherUsers = 'Andere Nutzer';
//	self.LblUserProjects = self.IcoSpecification+'&#160;Projekte dieses Nutzers';
//	self.LblOtherProjects = 'Andere Projekte';
	self.LblType = 'Typ';
	self.LblTypes = 'Typen';
	self.LblDataTypes = 'Datentypen';
	self.LblDataType = 'Datentyp';
	self.LblDataTypeTitle = 'Datentyp-Name';
	self.LblSpecTypes = 'Typen';
	self.LblSpecType = 'Typ';
	self.LblResourceClass = 'Ressource-Klasse';
	self.LblStatementClass = 'Aussage-Klasse';
	self.LblResource = 'Ressource';
	//	self.LblRelGroupTypes = 'Aussagegruppen-Typen';
//	self.LblRelGroupType = 'Aussagegruppen-Typ';
	self.LblSpecificationTypes = 'Gliederungs-Typen';
	self.hierarchyType = 
	self.LblSpecificationType = 'Gliederungs-Typ';
//	self.LblRifTypes = 'Typen';
//	self.rifType = 
//	self.LblRifType = 'Typ';
	self.LblSpecTypeTitle = 'Name';
	self.LblAttributeTitle = 'Attribut-Name';
	self.LblSecondaryFiltersForObjects = self.IcoFilter+"&#160;Facetten-Filter für '~A'";
	self.LblPermissions = 'Rechte';
	self.LblRoles = 'Rollen';
	self.LblFormat = 'Format';
	self.LblOptions = 'Optionen';
	self.LblFileFormat = 'Dateiformat';
	self.modelElements = 'Modell-Elemente';
	self.withOtherProperties = 'mit weiteren Eigenschaften';
	self.showEmptyProperties = 'einschließlich leerer Eigenschaften';
	self.withStatements = 'mit Relationen (Aussagen)';
	self.elementsWithIcons = 'mit Symbolen';
	self.elementsWithOrdernumbers = 'mit Gliederungsnummern';
	self.LblStringMatch = 'Text<mark>such</mark>e';
	self.LblWordBeginnings = 'Nur Wortanfänge berücksichtigen';
	self.LblWholeWords = 'Nur ganze Worte berücksichtigen';
	self.LblCaseSensitive = 'Groß/Kleinschreibung beachten';
//	self.LblExcludeEnums = 'Nur Textfelder durchsuchen';
	self.LblNotAssigned = '(ohne zugewiesenen Wert)';
	self.LblPrevious = 'Voriges';
	self.LblNext = 'Nächstes';
	self.LblPreviousStep = 'Zurück';
	self.LblNextStep = 'Weiter';
//	self.LblGo = 'Los!';
	self.LblHitCount = 'Trefferzahl';
	self.LblRelateAs = 'Verknüpfen als';
	self.LblSource = 'Subjekt';
	self.LblTarget = 'Objekt';
	self.LblEligibleSources = "Zulässige Ressourcen als "+ self.LblSource;
	self.LblEligibleTargets = "Zulässige Ressourcen als "+ self.LblTarget;
	self.LblSaveRelationAsSource = 'Ressource als '+ self.LblSource+' verknüpfen';
	self.LblSaveRelationAsTarget = 'Ressource als '+ self.LblTarget+' verknüpfen';
	self.LblIcon = 'Symbol';
	self.LblCreation = 'Anzulegen';
	self.LblCreateLink1 = "&#x2776;&#160;Gewünschte Relation-Klasse";
	self.LblCreateLink2 = "&#x2777;&#160;Zu verknüpfende Ressource";
	self.LblReferences = "Referenzen";
	self.LblInherited = "Geerbt";
	self.LblMaxLength = "Max. Länge";
	self.LblMinValue = "Min. Wert";
	self.LblMaxValue = "Max. Wert";
	self.LblAccuracy = "Dezimalstellen";
	self.LblEnumValues = "Werte (kommagetr.)";
	self.LblSingleChoice = "Einfach-Auswahl";
	self.LblMultipleChoice = "Mehrfach-Auswahl";
	self.LblDirectLink = "Direktverweis";

//	self.BtnLogin = '<span class="glyphicon glyphicon-log-in"></span>&#160;Anmelden';
//	self.BtnLogout = '<span class="glyphicon glyphicon-log-out"></span>&#160;Abmelden';
	self.BtnProfile = 'Profil';
	self.BtnBack = self.LblPreviousStep;
	self.BtnCancel =
	self.BtnCancelImport = 'Abbrechen';
	self.BtnApply = 'Anwenden';
	self.BtnDelete = self.IcoDelete+'&#160;Löschen';
	self.BtnDeleteObject = self.IcoDelete+'&#160;Ressource mit Referenzen löschen';
	self.BtnDeleteObjectRef = self.IcoDelete+'&#160;Diesen Verweis löschen';
	self.BtnImport = self.IcoImport+'&#160;Import';
	self.BtnCreate = self.IcoImport +'&#160;Anlegen';
	self.BtnReplace = self.IcoImport +'&#160;Ersetzen';
	self.BtnAdopt = self.IcoImport +'&#160;Adoptieren'; //Aneignen
	self.BtnUpdate = self.IcoImport +'&#160;'+	self.LblUpdate;
	self.BtnUpdateObject = self.IcoSave + '&#160;' + self.LblUpdate;
//	self.BtnImportSpecif = self.IcoImport+'&#160;SpecIF';
//	self.BtnImportReqif = self.IcoImport+'&#160;ReqIF';
//	self.BtnImportXls = self.IcoImport+'&#160;xlsx';
//	self.BtnProjectFromTemplate = "Projekt mit ReqIF-Vorlage anlegen";
	self.BtnRead = self.IcoRead+'&#160;Lesen';
	self.BtnExport = self.IcoExport+'&#160;Export';
//	self.BtnExportSpecif = self.IcoExport+'&#160;SpecIF';
//	self.BtnExportReqif = self.IcoExport+'&#160;ReqIF';
	self.BtnAdd = self.IcoAdd+'&#160;Neu';
	self.BtnAddUser = self.IcoAdd+'&#160;Nutzer';
	self.BtnAddProject = self.IcoAdd+'&#160;'+	self.LblProject;
	self.BtnAddSpec = self.IcoAdd+'&#160;Gliederung';
	self.BtnAddFolder = self.IcoAdd+'&#160;Ordner';
	self.BtnAddAttribute = self.IcoAdd+'&#160;Attribut';
	self.BtnAddTypeComment = self.IcoAdd+'&#160;Klassen für Kommentare';
	self.BtnClone = self.IcoClone+'&#160;Klonen';
	self.BtnEdit = self.IcoEdit +'&#160;Bearbeiten';
	self.BtnSave = self.IcoSave+'&#160;Speichern';
	self.BtnSaveRole = self.IcoSave+'&#160;Rolle anlegen';
	self.BtnSaveAttr = self.IcoSave+'&#160;Attribut anlegen';
	self.BtnInsert = self.IcoAdd+'&#160;Einfügen';
	self.BtnInsertSuccessor = self.IcoAdd+'&#160;Einfügen hinter';
	self.BtnInsertChild = self.IcoAdd+'&#160;Einfügen unter';
	self.BtnSaveRelation = self.IcoSave+'&#160;Relation (Aussage) anlegen';
	self.BtnSaveItem = self.IcoSave+'&#160;~A anlegen';
	self.BtnDetails = 'Details';
	self.BtnAddRole = self.IcoAdd +'&#160;Rolle';
	self.BtnFileSelect = self.IcoAdd+'&#160;Datei auswählen ...';
//	self.BtnPrevious = self.IcoPrevious+'&#160;' + self.LblPrevious;
//	self.BtnNext = self.IcoNext+'&#160;' + self.LblNext;
//	self.BtnGo = self.IcoGo+'&#160;'+self.LblGo;
	self.BtnFilterReset = 	self.IcoFilter+'&#160;Neu';
	self.BtnSelectHierarchy = "Gliederung auswählen";

// Tabs:
/*	self.TabAll = '<span class="glyphicon glyphicon-list"></span>';
	self.TabUserList = '<span class="glyphicon glyphicon-list"></span>&#160;Nutzer';
	self.TabProjectList = '<span class="glyphicon glyphicon-list"></span>&#160;Projekte';
//	self.TabProjectDetails = self.IcoEdit+'&#160;Meta';
	self.TabUserDetails = self.IcoEdit +'&#160;Meta';
	self.TabProjectUsers = self.IcoUser+'&#160;Nutzer';
	self.TabUserProjects = self.IcoSpecification+'&#160;Projekte';
	self.TabPermissions = '<span class="glyphicon glyphicon-lock"></span>&#160;Rechte';
	self.TabTypes = self.IcoType+'&#160;'+	self.LblTypes;
	self.TabDataTypes = self.IcoType+'&#160;'+ self.LblDataTypes; */
/*	self.TabSpecTypes = self.IcoType+'&#160;'+ self.LblResourceClasses;
	self.TabObjectTypes = self.IcoType+'&#160;'+ self.LblResourceClasses;
	self.TabRelationTypes = self.IcoType+'&#160;'+ self.LblRelationTypes;
//	self.TabRelGroupTypes = self.IcoType+'&#160;'+ self.LblRelGroupTypes;
	self.TabSpecificationTypes = self.IcoType+'&#160;'+	self.LblSpecificationTypes;
//	self.TabRifTypes = self.IcoType+'&#160;'+ self.LblRifTypes;
	self.TabTable = '<span class="glyphicon glyphicon-th"></span>&#160;Tabelle'; */
	self.TabDocument = self.IcoSpecification+'&#160;Dokument';
//	self.TabFind = self.IcoFind + '&#160;Suche';
	self.TabFilter = self.IcoFilter+'&#160;Filter';
//	self.TabPage = '<span class="glyphicon glyphicon-file"></span>&#160;Seite';
//	self.TabRevisions = '<span class="glyphicon glyphicon-grain"></span>&#160;Revisionen';
//	self.TabTimeline = '<span class="glyphicon glyphicon-film"></span>&#160;Zeitleiste';
	self.TabRelations = self.IcoRelation +'&#160;Relationen';
//	self.TabSort = '<span class="glyphicon glyphicon-magnet"></span>&#160;Sortieren';
//	self.TabAttachments = '<span class="glyphicon glyphicon-paperclip"></span>&#160;Bilder und Dateien';
//	self.TabComments = self.IcoComment+'&#160;Kommentare';
	self.TabReports = self.IcoReport +'&#160;Berichte';

// Functions:
//	self.FnProjectCreate = self.IcoAdd+'&#160;Projekt';
//	self.FnProjectImport = self.IcoImport +'&#160;Projekt importieren';
//	self.FnImportReqif = self.IcoImport+'&#160;ReqIF importieren';
//	self.FnImportCsv = self.IcoImport+'&#160;CSV importieren';
//	self.FnImportXls = self.IcoImport+'&#160;XLS importieren';
//	self.FnProjectFromTemplate = self.IcoImport+'&#160;Neues Projekt von Vorlage erstellen';
//	self.FnRefresh = '<span class="glyphicon glyphicon-refresh"></span>&#160;Aktualisieren';
	self.FnOpen =
	self.FnRead = self.IcoRead;
	self.FnUpdate = self.IcoAdminister;
//	self.FnRemove =
	self.FnDelete = self.IcoDelete;

// Messages:
	self.MsgIntro = 'Sind Sie neu hier? Lesen Sie eine kurze <a href="' + CONFIG.QuickStartGuideDe + '" target="_blank" rel="noopener">Einführung</a>, wenn Sie mögen.';
	self.MsgConfirm = 'Bitte bestätigen:';
	self.MsgConfirmDeletion = "'~A' löschen?";
	self.MsgConfirmObjectDeletion = "Ressource '<b>~A</b>' löschen?";
	self.MsgConfirmUserDeletion = "Nutzer '<b>~A</b>' löschen?";
	self.MsgConfirmProjectDeletion = "Projekt '<b>~A</b>' löschen?";
	self.MsgConfirmSpecDeletion = "Gliederung '<b>~A</b>' mit allen Verweisen löschen?";
	self.MsgConfirmRoleDeletion = "Rolle '<b>~A</b>' löschen?";
	self.MsgConfirmFolderDeletion = "Ordner '<b>~A</b>' löschen?";
	self.MsgInitialLoading = 'Lade den Index für flottere Navigation ... ';
	self.MsgNoProjectLoaded = 'Kein Projekt geladen.';
	self.MsgNoProject = 'Kein Projekt gefunden.';
	self.MsgNoUser = 'Keinen Nutzer gefunden.';
	self.MsgNoObject = 'Keine Ressource gewählt.';
	self.MsgCreateResource = "Ressource anlegen";
	self.MsgCloneResource = "Ressource klonen";
	self.MsgUpdateResource = "Ressource bearbeiten";
	self.MsgDeleteResource = "Ressource löschen";
	self.MsgCreateStatement = "Relation (Aussage) anlegen";
	self.MsgOtherProject = "Verspätete Antwort; inzwischen wurde ein anderes Projekt gewählt.";
	self.MsgWaitPermissions = 'Rechte werden geladen - es ist gleich soweit.';
	self.MsgForRole = 'für Rolle ';
/*	self.MsgImportReqif = 'Zulässige Dateitypen sind *.reqifz, *.reqif, *.zip und *.xml. Inhalte müssen den Schemata für ReqIF 1.0+, RIF 1.1a oder RIF 1.2 entsprechen. Der Import dauert meist einige Sekunden und bei sehr großen Dateien mehrere Minuten.'; */
	self.MsgImportReqif = 'Zulässige Dateitypen sind *.reqif oder *.reqifz. Inhalte müssen den Schemata für ReqIF 1.0+ entsprechen. Der Import dauert meist einige Sekunden und bei sehr großen Dateien mehrere Minuten.';
	self.MsgImportSpecif = 'Zulässige Dateitypen sind *.specif, *.specif.zip und *.specifz. Inhalte müssen den Schemata für SpecIF 0.10.4+ entsprechen. Bei großen Dateien kann der Import einige Minuten dauern.';
	self.MsgImportBpmn = 'Zulässiger Dateityp *.bpmn. Inhalte müssen den Schemata für BPMN 2.0 XML entsprechen. Der Import kann bis zu einigen Minuten dauern.';
	self.MsgImportXls = 'Zulässige Dateitypen sind *.xls, *.xlsx, *.csv, *.ods and *.fods. Der Import kann bei sehr großen Dateien mehrere Minuten dauern.';
	self.MsgExport = 'Es wird eine Datei im gewählten Format erzeugt. Der Export dauert meist einige Sekunden und im Falle sehr großer Dateien mehrere Minuten; Ihr Web-Browser speichert die Datei gemäß Voreinstellungen.';
	self.MsgLoading = 'Lade soeben ...';
	self.MsgSearching = 'Suche weiter ...';
	self.MsgObjectsProcessed = '~A Ressourcen analysiert.';
	self.MsgObjectsFound = '~A Ressourcen gefunden.';
	self.MsgNoMatchingObjects = 'Keine Ressource gefunden.';
	self.MsgNoRelatedObjects = 'Zu dieser Ressource gibt es keine Relationen (Aussagen).';
	self.MsgNoComments = 'Zu dieser Ressource gibt es keine Kommentare.';
	self.MsgNoFiles = 'Keine Datei gefunden.';
	self.MsgAnalyzing = 'Führe Analyse durch ...';
	self.MsgNoReports = 'Keine Auswertungen für dieses Projekt.';
	self.MsgTypeNoObjectType = "Mindestens eine Ressource-Klasse anlegen, sonst können keine Ressourcen erzeugt werden.";
	self.MsgTypeNoAttribute = "Mindestens ein Attribut anlegen, sonst ist der Typ nicht brauchbar.";
	self.MsgNoObjectTypeForManualCreation = "Es können keine Ressourcen angelegt werden, weil entweder keine Rechte eingeräumt sind oder weil kein Ressource-Typ für manuelles Anlegen vorgesehen ist.";
	self.MsgFilterClogged = 'Filter ist undurchlässig - mindestens ein Kriterium ist nicht erfüllbar.';
	self.MsgCredentialsUnknown = 'Anmeldeinformation ist unbekannt.';
	self.MsgUserMgmtNeedsAdminRole = 'Bitten Sie einen Administrator die Nutzer und Rollen zu verwalten.';
	self.MsgProjectMgmtNeedsAdminRole = 'Bitten Sie einen Administrator die Projekteigenschaften, Rollen und Rechte zu verwalten.';
	self.MsgExportSuccessful = "'~A' wurde erfolgreich exportiert.";
	self.MsgImportSuccessful = "'~A' wurde erfolgreich importiert.";
	self.MsgImportDenied = "'~A' wurde nicht importiert: Das Projekt wird von einer anderen Organisation bearbeitet oder das Schema wird nicht eingehalten.";
	self.MsgImportFailed = "Der Import von '~A' wurde wegen eines Fehlers abgebrochen.";
	self.MsgImportAborted = 'Der Import wurde durch den Nutzer abgebrochen.';
	self.MsgChooseRoleName = 'Bitte benennen Sie die Rolle:';
	self.MsgIdConflict = "Existiert bereits: Konnte Element '~A' nicht anlegen.";
	self.MsgRoleNameConflict = "Existiert bereits: Konnte Rolle '~A' nicht anlegen.";
	self.MsgUserNameConflict = "Existiert bereits: Konnte Nutzer '~A' nicht anlegen.";
	self.MsgFileApiNotSupported = 'Dieser Web-Browser unterstützt nicht den Zugriff auf Dateien. Bitte wählen Sie einen aktuellen Browser.';
	self.MsgDoNotLoadAllObjects = 'Es ist nicht zu empfehlen alle Ressourcen in einem Aufruf zu laden.';
	self.MsgReading = "Lesen";
	self.MsgCreating = "Anlegen";
	self.MsgUploading = "übertragen";
	self.MsgImporting = "Importieren";
	self.MsgBrowserSaving = "Ihr Web-Browser speichert die Datei gemäß Voreinstellungen.";
	self.MsgSuccess = "Erfolgreich!";
	self.MsgSelectImg = "Wählen oder laden Sie ein Bild";
	self.MsgImgWidth = "Bildbreite [px]";
	self.MsgSelectResClass = 	self.LblResourceClass+" auswählen";
	self.MsgSelectStaClass = 	self.LblStatementClass+" auswählen";
	self.MsgSelectResource = "Eine " + self.LblResource + " auswählen";
	self.MsgNoEligibleRelTypes = "Keine Relation-Klassen für diesen Ressource-Typ definiert.";
	self.MsgClickToNavigate = "Eine Ressource doppelt klicken, um dorthin zu navigieren:";
	self.MsgClickToDeleteRel = "Eine Ressource doppelt klicken, um die betreffende Relation zu löschen:";
	self.MsgNoSpec = "Keine Gliederung gefunden."
	self.MsgTypesCommentCreated = 'Die Typen für Kommentare wurden angelegt.';
	self.MsgOutlineAdded = 'Gliederung wurde oben hinzu gefügt - bitte konsolidieren Sie die bestehende und die neue manuell.';
	self.MsgLoadingTypes = 'Lade Typen';
	self.MsgLoadingFiles = 'Lade Bilder und Dateien';
	self.MsgLoadingObjects = 'Lade Ressourcen';
	self.MsgLoadingRelations = 'Lade Relationen (Aussagen)';
	self.MsgLoadingHierarchies = 'Lade Gliederungen';
	self.MsgProjectCreated = 'Projekt erfolgreich angelegt';
	self.MsgProjectUpdated = 'Projekt erfolgreich aktualisiert';
	self.MsgNoneSpecified = 'leer';

// Error messages:
	self.Error = 'Fehler';
	self.Err403Forbidden = 'Kein Zugriffsrecht für Ihre Rolle.';
	self.Err403NoProjectFolder = 'Mindestens ein Projekt im gewählten Baum dürfen Sie nicht ändern.';
//	self.Err403NoProjectUpdate = 'Ihre Rolle erlaubt nicht das Aktualisieren des Projekts.';
	self.Err403NoProjectDelete = 'Ihre Rolle erlaubt nicht das Löschen des Projekts.';
	self.Err403NoUserDelete = 'Ihre Rolle erlaubt nicht das Löschen von Nutzern.';
	self.Err403NoRoleDelete = 'Ihre Berechtigungen erlauben nicht das Löschen von Rollen.';
	self.Err404NotFound = "Element nicht gefunden; es wurde vermutlich gelöscht.";
	self.ErrNoItem = "Element '~A' nicht gefunden.";
	self.ErrNoObject = "Ressource '~A' nicht gefunden; es wurde vermutlich gelöscht.";
	self.ErrNoSpec = "Dieses Projekt hat keine Gliederung; es muss mindestens eine angelegt werden.";
	self.ErrInvalidFile = 'Ungültige oder unzulässige Datei.';
	self.ErrInvalidFileType = "'~A' hat einen unzulässigen Dateityp.";
	self.ErrInvalidAttachment = "Unzulässiger Dateityp. Wählen Sie bitte unter ~A.";
	self.ErrInvalidFileReqif = "'~A' hat einen unzulässigen Dateityp. Wählen Sie '*.reqif' oder '*.reqifz'.";
	self.ErrInvalidFileSpecif = "'~A' hat einen unzulässigen Dateityp. Wählen Sie '*.specif.zip', '*.specifz' oder '*.specif'.";
	self.ErrInvalidFileBpmn = "'~A' hat einen unzulässigen Dateityp. Wählen Sie '*.bpmn'.";
	self.ErrInvalidFileTogaf = "'~A' hat einen unzulässigen Dateityp. Wählen Sie '*.xml'.";
	self.ErrInvalidFileXls = "'~A' hat einen unzulässigen Dateityp. Wählen Sie '*.xlsx', '*.xls', oder '*.csv'.";
//	self.ErrInvalidFileElic = "'~A' hat einen unzulässigen Dateityp. Wählen Sie '*.elic_signed.xml'.";
	self.ErrUpload = 'Fehler beim Dateitransfer zum Server.';
	self.ErrImport = "Fehler beim Import.";
	self.ErrImportTimeout = 'Zeitüberschreitung beim Import.';
	self.ErrCommunicationTimeout = 'Zeitüberschreitung bei Server-Anfrage.';
	self.ErrInvalidData = 'Ungültige oder schädliche Daten.';
	self.ErrInvalidContent = 'Ungültige Daten; sehr wahrscheinlich XHTML-Strukturfehler oder schädlicher Inhalt.';
	self.ErrInvalidRoleName = "'~A' ist ein ungültiger Rollenname.";
	self.ErrUpdateConflict = "Ihre Aktualisierung ist im Konflikt mit einer zwischenzeitlichen änderung eines anderen Nutzers.";
	self.ErrInconsistentPermissions = "Berechtigungen sind widersprüchlich, bitte wenden Sie sich an einen Administrator.";
	self.ErrObjectNotEligibleForRelation = "Diese Ressourcen können nicht mit der gewählten Relation (Aussage) verknüpft werden.";
	self.Err400TypeIsInUse = "Dieser Typ kann nicht gelöscht werden, weil er bereits verwendet wird."
	self.Err402InsufficientLicense = "Die hinterlegte Lizenz reicht nicht für diese Operation.";

//	self.monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'October', 'November', 'Dezember' ];
//	self.monthAbbrs = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dez' ];

// App icons:
//	self.IcoHome = '<span class="glyphicon glyphicon-home"></span>';
//	self.IcoSystemAdministration = self.IcoAdminister;
//	self.IcoUserAdministration = self.IcoUser;
//	self.IcoProjectAdministration = self.IcoType;
//	self.IcoProjectAdministration = '<span style="font-size:130%">&#9881;</span>';
//	self.IcoSpecifications = self.IcoSpecification;
//	self.IcoReader = self.IcoRead;
//	self.IcoImportReqif = self.IcoImport;
//	self.IcoImportCsv = self.IcoImport;
//	self.IcoImportXls = self.IcoImport;
//	self.IcoSupport = '<span class="glyphicon glyphicon-question-sign"></span>';

// App names:
//	self.LblHome = 'Willkommen!';
//	self.LblProjects = 'Projekte';
//	self.LblSystemAdministration = 'Konfiguration';
//	self.LblUserAdministration = 'Nutzer';
//	self.LblProjectAdministration = 'Typen & Rechte';   // for the browser tabs - no HTML!
//	self.LblSpecifications = 'Inhalte';
	self.LblReader = 'SpecIF Leser';
	self.LblReviewer = 'SpecIF Lieferanten-Abstimmung';
	self.LblEditor = 'SpecIF Modellintegrator und Editor';
	self.LblSheet2reqif = 'Sheet → ReqIF';
//	self.LblSupport = 'Unterstützung';
//	self.AppHome = self.IcoHome+'&#160;'+self.LblHome;
//	self.AppSystemAdministration = 	self.IcoSystemAdministration+'&#160;Interaktives Lastenheft: '+	self.LblSystemAdministration;
//	self.AppUserAdministration = self.IcoUserAdministration+'&#160;Interaktives Lastenheft: '+self.LblUserAdministration;
//	self.AppProjectAdministration = self.IcoProjectAdministration+'&#160;Interaktives Lastenheft: '+self.LblProjectAdministration;
//	self.AppSpecifications = self.IcoSpecifications+'&#160;Interaktives Lastenheft: '+	self.LblSpecifications;
//	self.AppReader = 	self.IcoReader+'&#160;'+	self.LblReader;
//	self.AppImport = 	self.IcoImport+'&#160;Import';
//	self.AppLocal = 	self.IcoSpecifications+'&#160;'+	self.LblEditor;
//	self.AppSupport = 	self.IcoSupport+'&#160;'+	self.LblSupport;
	return self;
};
