/**
 * Document Data Mapper
 * Service intelligent pour l'auto-remplissage des champs de documents
 */

import { prisma } from './prisma';
import { formatDateFrench, formatCurrencyEuro } from './documentGenerator';

export interface FieldMappingConfig {
  source: 'agency' | 'contact' | 'talent' | 'auto' | 'manual' | 'calculated' | 'fixed';
  field?: string;
  autoFill: boolean;
  required?: boolean;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'select';
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

export interface DocumentDataMapperResult {
  data: Record<string, any>;
  mapping: Record<string, FieldMappingConfig>;
  metadata: {
    agencyLoaded: boolean;
    contactLoaded: boolean;
    talentLoaded: boolean;
    autoFieldsGenerated: number;
    manualFieldsRequired: number;
  };
}

export class DocumentDataMapper {
  /**
   * Remplit automatiquement les champs d'un document selon le mapping du template
   */
  async populateFields(
    templateId: string,
    contactId?: string,
    talentId?: string
  ): Promise<DocumentDataMapperResult> {
    // Charger le template
    const template = await prisma.documentTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const mapping = (template.fieldMapping as Record<string, FieldMappingConfig>) || {};
    const data: Record<string, any> = {};

    // Charger les sources de données
    const agency = await this.getAgencySettings();
    const contact = contactId
      ? await prisma.contact.findUnique({ where: { id: contactId } })
      : null;
    const talent = talentId
      ? await prisma.talent.findUnique({ where: { id: talentId } })
      : null;

    let autoFieldsGenerated = 0;
    let manualFieldsRequired = 0;

    // Remplir chaque champ selon son mapping
    for (const [fieldName, config] of Object.entries(mapping)) {
      if (!config.autoFill) {
        // Champ manuel : initialiser avec valeur par défaut
        data[fieldName] = config.defaultValue !== undefined ? config.defaultValue : '';
        if (config.required) manualFieldsRequired++;
        continue;
      }

      // Champ auto-rempli
      autoFieldsGenerated++;

      switch (config.source) {
        case 'agency':
          data[fieldName] = await this.getAgencyField(agency, config);
          break;

        case 'contact':
          data[fieldName] = await this.getContactField(contact, config);
          break;

        case 'talent':
          data[fieldName] = await this.getTalentField(talent, config);
          break;

        case 'auto':
          data[fieldName] = await this.generateAutoValue(config, template.type);
          break;

        case 'fixed':
          data[fieldName] = config.defaultValue;
          break;

        case 'calculated':
          // Sera calculé côté client après saisie manuelle
          data[fieldName] = '';
          break;

        default:
          data[fieldName] = '';
      }
    }

    return {
      data,
      mapping,
      metadata: {
        agencyLoaded: !!agency,
        contactLoaded: !!contact,
        talentLoaded: !!talent,
        autoFieldsGenerated,
        manualFieldsRequired,
      },
    };
  }

  /**
   * Récupère les paramètres de l'agence (singleton)
   */
  private async getAgencySettings() {
    const settings = await prisma.agencySettings.findFirst();
    return settings;
  }

  /**
   * Map les noms de variables vers les vrais champs Prisma AgencySettings
   */
  private mapAgencyField(fieldName: string): string {
    const fieldMap: Record<string, string> = {
      'validite_devis_defaut': 'validite_devis_defaut',
      'delai_paiement_defaut': 'delai_paiement_defaut',
    };
    return fieldMap[fieldName] || fieldName;
  }

  /**
   * Extrait un champ de l'agence selon la config
   */
  private async getAgencyField(
    agency: any,
    config: FieldMappingConfig
  ): Promise<string> {
    if (!agency || !config.field) return '';

    const mappedField = this.mapAgencyField(config.field);
    const value = agency[mappedField];
    return this.formatValue(value, config);
  }

  /**
   * Map les noms de variables vers les vrais champs Prisma Contact
   */
  private mapContactField(fieldName: string): string {
    const fieldMap: Record<string, string> = {
      'nom_client': 'name',
      'email_client': 'email',
      'telephone_client': 'phone',
      'adresse_client': 'adresse_client',
      'ville_client': 'ville',
      'code_postal_client': 'code_postal',
      'site_web_client': 'site_web_client',
      'nom_destinataire': 'nom_destinataire',
      'email_destinataire': 'email_destinataire',
      'telephone_destinataire': 'telephone_destinataire',
      'adresse_destinataire': 'adresse_destinataire',
    };
    return fieldMap[fieldName] || fieldName;
  }

  /**
   * Extrait un champ du contact selon la config
   */
  private async getContactField(
    contact: any,
    config: FieldMappingConfig
  ): Promise<string> {
    if (!contact) return '';

    let value: any;
    const mappedField = config.field ? this.mapContactField(config.field) : '';

    // Gérer les fallbacks (ex: destinataire → client si vide)
    if (config.fallback && !contact[mappedField]) {
      const mappedFallback = this.mapContactField(config.fallback);
      value = contact[mappedFallback];
    } else {
      value = mappedField ? contact[mappedField] : '';
    }

    return this.formatValue(value, config);
  }

  /**
   * Map les noms de variables vers les vrais champs Prisma Talent
   */
  private mapTalentField(fieldName: string): string {
    // Les champs talent correspondent déjà (prenom_talent, nom_talent, etc.)
    return fieldName;
  }

  /**
   * Extrait un champ du talent selon la config
   */
  private async getTalentField(
    talent: any,
    config: FieldMappingConfig
  ): Promise<string> {
    if (!talent || !config.field) return '';

    let value: any;
    const mappedField = this.mapTalentField(config.field);

    // Gérer les fallbacks spéciaux (split du name)
    if (config.fallback === 'name_split_first') {
      // Extraire le prénom depuis "Prénom Nom"
      const nameParts = talent.name?.split(' ') || [];
      value = talent.prenom_talent || nameParts.slice(0, -1).join(' ');
    } else if (config.fallback === 'name_split_last') {
      // Extraire le nom depuis "Prénom Nom"
      const nameParts = talent.name?.split(' ') || [];
      value = talent.nom_talent || nameParts[nameParts.length - 1];
    } else {
      value = talent[mappedField];
    }

    return this.formatValue(value, config);
  }

  /**
   * Génère une valeur automatique (date, numéro de document, etc.)
   */
  private async generateAutoValue(
    config: FieldMappingConfig,
    documentType: string
  ): Promise<string> {
    if (!config.field) return '';

    switch (config.field) {
      case 'today':
        return formatDateFrench(new Date());

      case 'documentNumber':
        // Sera généré lors de la sauvegarde finale
        return '[AUTO-GÉNÉRÉ]';

      default:
        return '';
    }
  }

  /**
   * Formate une valeur selon la config
   */
  private formatValue(value: any, config: FieldMappingConfig): string {
    if (value === null || value === undefined) return '';

    // Format date
    if (config.format === 'DD/MM/YYYY' && value instanceof Date) {
      return value.toLocaleDateString('fr-FR');
    }

    if (config.format?.includes('MMMM')) {
      // Format date français long
      if (value instanceof Date) {
        return formatDateFrench(value);
      }
    }

    // Format currency
    if (config.format === 'currency' && typeof value === 'number') {
      return formatCurrencyEuro(value);
    }

    // Valeur par défaut : conversion en string
    return String(value);
  }

  /**
   * Crée le mapping par défaut pour un template selon les champs détectés
   */
  static createDefaultMapping(
    variables: string[],
    templateType: string,
    templateCategory: string
  ): Record<string, FieldMappingConfig> {
    const mapping: Record<string, FieldMappingConfig> = {};

    for (const variable of variables) {
      // Déterminer automatiquement la source selon le nom du champ

      // Champs agence (finissant par _agence OU champs juridiques sans suffix)
      if (variable.includes('_agence') ||
          variable === 'capital' ||
          variable === 'ville_rcs' ||
          variable === 'numero_rcs' ||
          variable === 'forme_juridique') {
        mapping[variable] = {
          source: 'agency',
          field: variable,
          autoFill: true,
          required: true,
          label: this.formatLabel(variable),
        };
      } else if (variable.includes('_client') || variable.includes('_destinataire')) {
        mapping[variable] = {
          source: 'contact',
          field: variable,
          autoFill: true,
          required: variable.includes('nom_') || variable.includes('email_'),
          label: this.formatLabel(variable),
        };
      } else if (variable.includes('_talent')) {
        mapping[variable] = {
          source: 'talent',
          field: variable,
          autoFill: true,
          required: true,
          label: this.formatLabel(variable),
        };
      } else if (variable.includes('date_')) {
        mapping[variable] = {
          source: variable === 'date_devis' || variable === 'date_signature' ? 'auto' : 'manual',
          field: variable === 'date_devis' || variable === 'date_signature' ? 'today' : undefined,
          autoFill: variable === 'date_devis' || variable === 'date_signature',
          type: 'date',
          format: 'DD MMMM YYYY',
          label: this.formatLabel(variable),
        };
      } else if (variable.includes('numero_')) {
        mapping[variable] = {
          source: 'auto',
          field: 'documentNumber',
          autoFill: true,
          label: this.formatLabel(variable),
        };
      } else if (variable.includes('_total') || variable.includes('sous_total') || variable.includes('tva_montant')) {
        mapping[variable] = {
          source: 'calculated',
          autoFill: true,
          format: 'currency',
          label: this.formatLabel(variable),
        };
      } else if (variable === 'tva_pourcentage') {
        mapping[variable] = {
          source: 'fixed',
          defaultValue: 20,
          autoFill: true,
          label: 'TVA (%)',
        };
      } else if (variable === 'validite_jours') {
        mapping[variable] = {
          source: 'agency',
          field: 'validite_devis_defaut',
          autoFill: true,
          type: 'number',
          label: 'Validité (jours)',
          suffix: 'jours'
        };
      } else if (variable === 'delai_paiement') {
        mapping[variable] = {
          source: 'agency',
          field: 'delai_paiement_defaut',
          autoFill: true,
          type: 'text',
          label: 'Délai de paiement'
        };
      } else if (variable === 'acompte_pourcentage') {
        mapping[variable] = {
          source: 'fixed',
          defaultValue: 30,
          autoFill: true,
          type: 'number',
          label: 'Acompte (%)',
          suffix: '%'
        };
      } else if (variable.includes('ligne_') && (variable.includes('_description') || variable.includes('_prix') || variable.includes('_quantite'))) {
        mapping[variable] = {
          source: 'manual',
          autoFill: false,
          required: variable.includes('ligne_1_'), // Première ligne obligatoire
          type: variable.includes('_description') ? 'textarea' : 'number',
          defaultValue: variable.includes('_quantite') ? 1 : undefined,
          label: this.formatLabel(variable),
        };
      } else {
        // Champ manuel par défaut
        mapping[variable] = {
          source: 'manual',
          autoFill: false,
          required: false,
          type: 'text',
          label: this.formatLabel(variable),
        };
      }
    }

    return mapping;
  }

  /**
   * Formate un nom de variable en label lisible
   */
  private static formatLabel(variable: string): string {
    return variable
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

export default DocumentDataMapper;
