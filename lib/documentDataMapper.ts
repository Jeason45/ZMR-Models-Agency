import { prisma } from "@/lib/prisma";

export interface FieldMappingConfig {
  source: 'agency' | 'contact' | 'auto' | 'manual' | 'calculated' | 'fixed';
  field?: string;
  autoFill: boolean;
  required?: boolean;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'currency';
  formula?: string;
  format?: string;
  defaultValue?: any;
  fallback?: string;
  label?: string;
  options?: string[];
  placeholder?: string;
  suffix?: string;
  sensitive?: boolean;
}

type FieldMapping = Record<string, FieldMappingConfig>;

export class DocumentDataMapper {
  /**
   * Crée un mapping par défaut basé sur les noms de variables
   */
  static createDefaultMapping(
    variables: string[],
    templateType: string,
    templateCategory: string
  ): FieldMapping {
    const mapping: FieldMapping = {};

    for (const variable of variables) {
      const varLower = variable.toLowerCase();

      // Champs agence
      if (
        varLower.includes('_agence') ||
        varLower === 'capital' ||
        varLower === 'siret_agence' ||
        varLower === 'forme_juridique' ||
        varLower === 'ville_rcs' ||
        varLower === 'numero_rcs' ||
        varLower === 'representant_nom' ||
        varLower === 'representant_qualite'
      ) {
        mapping[variable] = {
          source: 'agency',
          field: variable,
          autoFill: true,
          required: true,
          type: 'text',
          label: this.generateLabel(variable)
        };
      }
      // Champs client/contact
      else if (
        varLower.includes('_client') ||
        varLower === 'nom_client' ||
        varLower === 'email_client' ||
        varLower === 'telephone_client' ||
        varLower === 'adresse_client' ||
        varLower === 'code_postal_client' ||
        varLower === 'ville_client'
      ) {
        mapping[variable] = {
          source: 'contact',
          field: variable,
          autoFill: true,
          required: varLower.includes('nom_') || varLower.includes('email_'),
          type: 'text',
          label: this.generateLabel(variable)
        };
      }
      // Champs date
      else if (varLower.includes('date_')) {
        mapping[variable] = {
          source: 'auto',
          field: 'today',
          autoFill: true,
          type: 'date',
          format: 'DD MMMM YYYY',
          label: this.generateLabel(variable)
        };
      }
      // Numéros de document
      else if (varLower.includes('numero_')) {
        mapping[variable] = {
          source: 'auto',
          field: 'documentNumber',
          autoFill: true,
          type: 'text',
          label: this.generateLabel(variable)
        };
      }
      // Totaux et montants
      else if (
        varLower.includes('_total') ||
        varLower.includes('tva_montant') ||
        varLower.includes('sous_total') ||
        varLower.includes('montant_')
      ) {
        mapping[variable] = {
          source: 'calculated',
          autoFill: true,
          type: 'currency',
          format: 'currency',
          label: this.generateLabel(variable)
        };
      }
      // Pourcentages
      else if (varLower.includes('_pourcentage') || varLower === 'tva_pourcentage') {
        mapping[variable] = {
          source: 'fixed',
          autoFill: true,
          type: 'number',
          defaultValue: 20,
          suffix: '%',
          label: this.generateLabel(variable)
        };
      }
      // Champs manuels
      else {
        mapping[variable] = {
          source: 'manual',
          autoFill: false,
          required: false,
          type: this.guessFieldType(variable),
          label: this.generateLabel(variable)
        };
      }
    }

    return mapping;
  }

  /**
   * Génère un label lisible à partir d'un nom de variable
   */
  static generateLabel(variable: string): string {
    return variable
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  /**
   * Devine le type de champ basé sur le nom de variable
   */
  static guessFieldType(variable: string): FieldMappingConfig['type'] {
    const varLower = variable.toLowerCase();

    if (varLower.includes('description') || varLower.includes('objet') || varLower.includes('conditions')) {
      return 'textarea';
    }
    if (varLower.includes('prix') || varLower.includes('tarif') || varLower.includes('montant')) {
      return 'currency';
    }
    if (varLower.includes('quantite') || varLower.includes('nombre')) {
      return 'number';
    }
    if (varLower.includes('date')) {
      return 'date';
    }

    return 'text';
  }

  /**
   * Récupère les paramètres de l'agence
   */
  static async getAgencySettings() {
    const agency = await prisma.agencySettings.findFirst();
    return agency;
  }

  /**
   * Récupère un champ de l'agence
   */
  static async getAgencyField(
    agency: any,
    config: FieldMappingConfig
  ): Promise<string> {
    if (!agency || !config.field) return config.defaultValue || '';

    // Le champ existe directement dans la table agency_settings
    const value = agency[config.field];
    if (value !== undefined && value !== null) {
      return String(value);
    }

    // Fallback
    if (config.fallback && agency[config.fallback]) {
      return String(agency[config.fallback]);
    }

    return config.defaultValue || '';
  }

  /**
   * Récupère un champ du contact
   */
  static async getContactField(
    contact: any,
    config: FieldMappingConfig
  ): Promise<string> {
    if (!contact || !config.field) return config.defaultValue || '';

    // Mapping des noms de champs template → contact
    const fieldMappings: Record<string, { primary: string; fallback?: string }> = {
      'nom_client': { primary: 'name' },
      'email_client': { primary: 'email' },
      'telephone_client': { primary: 'phone' },
      'adresse_client': { primary: 'adresse_client' },
      'code_postal_client': { primary: 'code_postal' },
      'ville_client': { primary: 'ville' },
      'siret': { primary: 'siret' }
    };

    const mapping = fieldMappings[config.field];

    console.log('[getContactField]', {
      field: config.field,
      mapping,
      contactFields: Object.keys(contact)
    });

    if (mapping) {
      // Essayer le champ principal
      let value = contact[mapping.primary];
      console.log('[getContactField] Primary value:', mapping.primary, '=', value);

      // Si vide, essayer le fallback
      if ((!value || value === '') && mapping.fallback) {
        value = contact[mapping.fallback];
        console.log('[getContactField] Fallback value:', mapping.fallback, '=', value);
      }

      if (value !== undefined && value !== null && value !== '') {
        console.log('[getContactField] Returning:', value);
        return String(value);
      }
    } else {
      // Utiliser le nom de champ tel quel
      const value = contact[config.field];
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
    }

    // Fallback depuis la config
    if (config.fallback && contact[config.fallback]) {
      return String(contact[config.fallback]);
    }

    console.log('[getContactField] Returning default:', config.defaultValue || '');
    return config.defaultValue || '';
  }

  /**
   * Génère une valeur automatique
   */
  static async generateAutoValue(
    config: FieldMappingConfig,
    documentType: string
  ): Promise<string> {
    if (config.field === 'today') {
      return this.formatDate(new Date(), config.format || 'DD MMMM YYYY');
    }

    if (config.field === 'documentNumber') {
      return await this.generateDocumentNumber(documentType);
    }

    return config.defaultValue || '';
  }

  /**
   * Formate une date
   */
  static formatDate(date: Date, format: string): string {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];

    const days = [
      'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const weekday = days[date.getDay()];

    let result = format;
    result = result.replace('DD', String(day).padStart(2, '0'));
    result = result.replace('D', String(day));
    result = result.replace('MMMM', month);
    result = result.replace('YYYY', String(year));
    result = result.replace('dddd', weekday);

    return result;
  }

  /**
   * Génère un numéro de document unique
   */
  static async generateDocumentNumber(documentType: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = documentType === 'FACTURE' ? 'FACT' :
                   documentType === 'DEVIS' ? 'DEV' :
                   documentType === 'CONTRAT' ? 'CONT' : 'DOC';

    // Trouver le dernier numéro
    const lastDoc = await prisma.document.findFirst({
      where: {
        documentNumber: {
          startsWith: `${prefix}-${year}-`
        }
      },
      orderBy: {
        documentNumber: 'desc'
      }
    });

    let lastNumber = 0;
    if (lastDoc && lastDoc.documentNumber) {
      const match = lastDoc.documentNumber.match(/\-(\d+)$/);
      if (match) {
        lastNumber = parseInt(match[1], 10);
      }
    }

    const nextNumber = lastNumber + 1;
    return `${prefix}-${year}-${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Remplit automatiquement les champs du document
   */
  static async populateFields(
    templateId: string,
    contactId?: string
  ): Promise<{
    data: Record<string, any>;
    mapping: FieldMapping;
    metadata: {
      autoFieldsGenerated: number;
      manualFieldsRequired: number;
      agencyLoaded: boolean;
      contactLoaded: boolean;
    };
  }> {
    // Charger le template
    const template = await prisma.documentTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      throw new Error('Template not found');
    }

    // Charger le mapping ou créer un mapping par défaut
    let mapping: FieldMapping;
    if (template.fieldMapping && typeof template.fieldMapping === 'object') {
      mapping = template.fieldMapping as unknown as FieldMapping;
    } else {
      const variables = (template.variables as string[]) || [];
      mapping = this.createDefaultMapping(variables, template.type, template.category);
    }

    // Charger les données sources
    const agency = await this.getAgencySettings();
    const contact = contactId ? await prisma.contact.findUnique({
      where: { id: contactId }
    }) : null;

    // Remplir les champs
    const data: Record<string, any> = {};
    let autoFieldsGenerated = 0;
    let manualFieldsRequired = 0;

    for (const [fieldName, config] of Object.entries(mapping)) {
      console.log(`[populateFields] Processing field: ${fieldName}`, { source: config.source, autoFill: config.autoFill });

      if (!config.autoFill) {
        data[fieldName] = config.defaultValue || '';
        if (config.required) {
          manualFieldsRequired++;
        }
        continue;
      }

      switch (config.source) {
        case 'agency':
          data[fieldName] = await this.getAgencyField(agency, config);
          autoFieldsGenerated++;
          break;

        case 'contact':
          console.log(`[populateFields] Calling getContactField for ${fieldName}`);
          data[fieldName] = await this.getContactField(contact, config);
          console.log(`[populateFields] Result for ${fieldName}:`, data[fieldName]);
          autoFieldsGenerated++;
          break;

        case 'auto':
          data[fieldName] = await this.generateAutoValue(config, template.type);
          autoFieldsGenerated++;
          break;

        case 'fixed':
          data[fieldName] = config.defaultValue || '';
          autoFieldsGenerated++;
          break;

        case 'calculated':
          // Les champs calculés sont remplis côté client
          data[fieldName] = '';
          break;

        default:
          data[fieldName] = config.defaultValue || '';
      }
    }

    return {
      data,
      mapping,
      metadata: {
        autoFieldsGenerated,
        manualFieldsRequired,
        agencyLoaded: !!agency,
        contactLoaded: !!contact
      }
    };
  }
}
