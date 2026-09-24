import { frappeApi } from '@/api/frappeApi';

interface FrappeListResponse<T> {
  data: T[];
}

interface FrappeResourceResponse<T> {
  data: T;
}

interface DocTypeListItem {
  name: string;
  module?: string;
  istable?: 0 | 1;
  issingle?: 0 | 1;
  is_virtual?: 0 | 1;
}

interface DocFieldMeta {
  fieldname?: string;
  fieldtype?: string;
  label?: string;
  options?: string;
  reqd?: 0 | 1;
  read_only?: 0 | 1;
  hidden?: 0 | 1;
}

interface DocTypeMeta {
  name: string;
  module?: string;
  fields?: DocFieldMeta[];
}

interface SeedOptions {
  recordsPerDocType?: number;
  docTypesPerApp?: number;
  includeOptionalFields?: boolean;
  maxPasses?: number;
  warmupRequiredOnly?: boolean;
  bootstrapMasters?: boolean;
  autoCreateMissingLinks?: boolean;
  maxLinkAutocreateDepth?: number;
  maxExistingLinkFetch?: number;
}

interface AppSeedConfig {
  repo: string;
  branch: string;
  displayName: string;
  preferredDocTypes: string[];
  doctypePrefixes: string[];
  moduleKeywords: string[];
}

interface SeedAppResult {
  app: string;
  created: number;
  failed: number;
  skipped: number;
}

interface SeedSummary {
  created: number;
  failed: number;
  skipped: number;
  perApp: SeedAppResult[];
}

interface SeedTask {
  appKey: string;
  doctype: string;
  counter: number;
}

interface CreateRecordResult {
  ok: boolean;
  name?: string;
  error?: string;
}

const APP_SEED_PLAN: AppSeedConfig[] = [
  {
    repo: 'frappe/lms',
    branch: 'v2.16.0',
    displayName: 'LMS',
    preferredDocTypes: ['LMS Course', 'LMS Program', 'LMS Batch'],
    doctypePrefixes: ['LMS '],
    moduleKeywords: ['LMS'],
  },
  {
    repo: 'frappe/erpnext',
    branch: 'version-15',
    displayName: 'ERPNext',
    preferredDocTypes: [
      'Customer',
      'Supplier',
      'Item',
      'Address',
      'Contact',
      'Project',
      'Task',
      'User',
    ],
    doctypePrefixes: [],
    moduleKeywords: [
      'Selling',
      'Buying',
      'Stock',
      'Projects',
      'Accounts',
      'CRM',
    ],
  },
  {
    repo: 'frappe/hrms',
    branch: 'version-15',
    displayName: 'HRMS',
    preferredDocTypes: [
      'Employee',
      'Job Applicant',
      'Leave Application',
      'Expense Claim',
    ],
    doctypePrefixes: ['HRMS '],
    moduleKeywords: ['HR', 'Payroll'],
  },
  {
    repo: 'frappe/lending',
    branch: 'v1.5.4',
    displayName: 'Lending',
    preferredDocTypes: ['Loan Application', 'Loan Product', 'Loan'],
    doctypePrefixes: ['Loan '],
    moduleKeywords: ['Lending'],
  },
  {
    repo: 'frappe/builder',
    branch: 'v1.22.5',
    displayName: 'Builder',
    preferredDocTypes: ['Builder Page', 'Builder Component', 'Builder Theme'],
    doctypePrefixes: ['Builder '],
    moduleKeywords: ['Builder'],
  },
  {
    repo: 'frappe/drive',
    branch: 'main',
    displayName: 'Drive',
    preferredDocTypes: ['Drive Team', 'Drive File'],
    doctypePrefixes: ['Drive '],
    moduleKeywords: ['Drive'],
  },
  {
    repo: 'frappe/insights',
    branch: 'main',
    displayName: 'Insights',
    preferredDocTypes: ['Insights Dashboard', 'Insights Query'],
    doctypePrefixes: ['Insights '],
    moduleKeywords: ['Insights'],
  },
  {
    repo: 'frappe/crm',
    branch: 'v1.0.0',
    displayName: 'CRM',
    preferredDocTypes: ['CRM Lead', 'CRM Deal', 'CRM Organization'],
    doctypePrefixes: ['CRM '],
    moduleKeywords: ['CRM'],
  },
  {
    repo: 'frappe/helpdesk',
    branch: 'main',
    displayName: 'Helpdesk',
    preferredDocTypes: ['HD Ticket', 'HD Team', 'HD Customer'],
    doctypePrefixes: ['HD ', 'Helpdesk '],
    moduleKeywords: ['Helpdesk'],
  },
  {
    repo: 'frappe/gameplan',
    branch: 'main',
    displayName: 'Gameplan',
    preferredDocTypes: ['GP Goal', 'GP Team', 'Gameplan Goal'],
    doctypePrefixes: ['GP ', 'Gameplan '],
    moduleKeywords: ['Gameplan'],
  },
  {
    repo: 'The-Commit-Company/raven',
    branch: 'main',
    displayName: 'Raven',
    preferredDocTypes: ['Raven Channel', 'Raven Message'],
    doctypePrefixes: ['Raven '],
    moduleKeywords: ['Raven'],
  },
];

const CORE_BOOTSTRAP_DOCTYPES = [
  'Country',
  'Territory',
  'Customer Group',
  'Supplier Group',
  'Item Group',
  'UOM',
  'Department',
  'Designation',
];

const DEFAULT_SEED_OPTIONS: Required<SeedOptions> = {
  recordsPerDocType: 15,
  docTypesPerApp: 2,
  includeOptionalFields: true,
  maxPasses: 4,
  warmupRequiredOnly: true,
  bootstrapMasters: true,
  autoCreateMissingLinks: true,
  maxLinkAutocreateDepth: 2,
  maxExistingLinkFetch: 25,
};

const SYSTEM_FIELDNAMES = new Set([
  'name',
  'owner',
  'creation',
  'modified',
  'modified_by',
  'idx',
  'docstatus',
  'parent',
  'parenttype',
  'parentfield',
  'amended_from',
]);

const SKIP_FIELDTYPES = new Set([
  'Section Break',
  'Column Break',
  'Tab Break',
  'Button',
  'HTML',
  'Heading',
  'Fold',
  'Read Only',
  'Image',
  'Signature',
  'Dynamic Link',
  'Table MultiSelect',
]);

const NON_SEEDABLE_KEYWORDS = [
  'setting',
  'permission',
  'role',
  'log',
  'report',
  'workspace',
  'notification',
  'workflow',
  'print format',
  'property setter',
  'translation',
  'version',
  'access',
  'error',
  'session',
  'token',
];

const doctypeMetaCache = new Map<string, DocTypeMeta>();
const linkValueCache = new Map<string, string[]>();
let currentSeedOptions: Required<SeedOptions> = DEFAULT_SEED_OPTIONS;

const pad2 = (value: number): string => String(value).padStart(2, '0');

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseSelectOptions = (rawOptions?: string): string[] => {
  if (!rawOptions) {
    return [];
  }

  return rawOptions
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const lower = value.toLowerCase();
      return (
        lower !== 'select' &&
        lower !== 'select...' &&
        lower !== '--select--' &&
        lower !== 'none'
      );
    });
};

const toDateString = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);

  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());

  return `${year}-${month}-${day}`;
};

const toDatetimeString = (offsetHours: number): string => {
  const date = new Date();
  date.setHours(date.getHours() + offsetHours);

  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const pickCachedLinkValue = (
  values: string[],
  counter: number
): string | undefined => {
  if (values.length === 0) {
    return undefined;
  }

  return values[counter % values.length];
};

const cacheLinkValues = (doctype: string, values: string[]): void => {
  const uniqueValues = Array.from(new Set(values.filter(Boolean)));
  linkValueCache.set(doctype, uniqueValues);
};

const addCachedLinkValue = (doctype: string, value: string): void => {
  const currentValues = linkValueCache.get(doctype) ?? [];
  if (currentValues.includes(value)) {
    return;
  }

  const nextValues = [...currentValues, value];
  linkValueCache.set(doctype, nextValues);
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error !== 'object' || error === null) {
    return String(error);
  }

  const asError = error as {
    message?: string;
    response?: {
      data?: {
        message?: string;
        exception?: string;
        _server_messages?: string;
      };
    };
  };

  const serverData = asError.response?.data;
  if (serverData?.message) {
    return serverData.message;
  }
  if (serverData?.exception) {
    return serverData.exception;
  }
  if (serverData?._server_messages) {
    return serverData._server_messages;
  }

  return asError.message ?? 'Error desconocido';
};

const isWritableField = (
  field: DocFieldMeta,
  includeOptionalFields: boolean
): boolean => {
  const fieldname = field.fieldname?.trim();
  const fieldtype = field.fieldtype?.trim();

  if (!fieldname || !fieldtype) {
    return false;
  }
  if (SYSTEM_FIELDNAMES.has(fieldname)) {
    return false;
  }
  if (field.read_only === 1 || field.hidden === 1) {
    return false;
  }
  if (SKIP_FIELDTYPES.has(fieldtype)) {
    return false;
  }
  if (!includeOptionalFields && field.reqd !== 1) {
    return false;
  }

  return true;
};

const isSeedableDocTypeName = (doctypeName: string): boolean => {
  const lower = doctypeName.toLowerCase();
  return !NON_SEEDABLE_KEYWORDS.some((keyword) => lower.includes(keyword));
};

const getAllDocTypes = async (): Promise<DocTypeListItem[]> => {
  const response = await frappeApi.get<FrappeListResponse<DocTypeListItem>>(
    '/api/resource/DocType',
    {
      params: {
        fields: JSON.stringify([
          'name',
          'module',
          'istable',
          'issingle',
          'is_virtual',
        ]),
        filters: JSON.stringify([
          ['DocType', 'istable', '=', 0],
          ['DocType', 'issingle', '=', 0],
        ]),
        limit_page_length: 5000,
      },
    }
  );

  return response.data.data.filter((doctype) => doctype.is_virtual !== 1);
};

const getDocTypeMeta = async (doctype: string): Promise<DocTypeMeta | null> => {
  const cached = doctypeMetaCache.get(doctype);
  if (cached) {
    return cached;
  }

  try {
    const response = await frappeApi.get<FrappeResourceResponse<DocTypeMeta>>(
      `/api/resource/DocType/${encodeURIComponent(doctype)}`
    );

    doctypeMetaCache.set(doctype, response.data.data);
    return response.data.data;
  } catch (error) {
    console.warn(
      `[Seeder] No se pudo leer metadata de ${doctype}:`,
      getErrorMessage(error)
    );
    return null;
  }
};

const getLinkValue = async (
  linkDoctype: string,
  currentDoctype: string,
  counter: number,
  linkTrail: string[]
): Promise<string | undefined> => {
  if (!linkDoctype || linkDoctype === currentDoctype) {
    return undefined;
  }

  const cachedValues = linkValueCache.get(linkDoctype);
  if (cachedValues && cachedValues.length > 0) {
    return pickCachedLinkValue(cachedValues, counter);
  }

  if (!cachedValues) {
    try {
      const response = await frappeApi.get<
        FrappeListResponse<{ name: string }>
      >(`/api/resource/${encodeURIComponent(linkDoctype)}`, {
        params: {
          fields: JSON.stringify(['name']),
          limit_page_length: currentSeedOptions.maxExistingLinkFetch,
        },
      });

      const values = response.data.data
        .map((record) => record.name)
        .filter((name): name is string => Boolean(name));

      cacheLinkValues(linkDoctype, values);
      const selected = pickCachedLinkValue(values, counter);
      if (selected) {
        return selected;
      }
    } catch (error) {
      console.warn(
        `[Seeder] No se pudo resolver Link (${linkDoctype}) para ${currentDoctype}:`,
        getErrorMessage(error)
      );
      cacheLinkValues(linkDoctype, []);
    }
  }

  if (!currentSeedOptions.autoCreateMissingLinks) {
    return undefined;
  }
  if (linkTrail.includes(linkDoctype)) {
    return undefined;
  }
  if (linkTrail.length >= currentSeedOptions.maxLinkAutocreateDepth) {
    return undefined;
  }

  const creationTrail = [...linkTrail, currentDoctype];
  const linkPayload = await buildPayloadForDocType(
    linkDoctype,
    counter,
    false,
    creationTrail
  );
  if (Object.keys(linkPayload).length === 0) {
    return undefined;
  }

  const createResult = await createDocTypeRecord(linkDoctype, linkPayload);
  if (createResult.ok && createResult.name) {
    addCachedLinkValue(linkDoctype, createResult.name);
    return createResult.name;
  }

  return undefined;
};

const buildSemanticDataValue = (
  field: DocFieldMeta,
  counter: number
): string => {
  const fieldname = (field.fieldname ?? '').toLowerCase();
  const label = (field.label ?? '').toLowerCase();
  const semantic = `${fieldname} ${label}`;

  if (semantic.includes('email')) {
    return `seed.${counter}.${slugify(fieldname || 'mail')}@example.test`;
  }
  if (semantic.includes('phone') || semantic.includes('mobile')) {
    return `+5730012${String(1000 + counter).slice(-4)}`;
  }
  if (semantic.includes('city')) {
    return 'Bogota';
  }
  if (
    semantic.includes('postal') ||
    semantic.includes('zip') ||
    semantic.includes('pincode')
  ) {
    return `11${String(1000 + counter).slice(-4)}`;
  }
  if (semantic.includes('country')) {
    return 'Colombia';
  }
  if (semantic.includes('state')) {
    return 'Cundinamarca';
  }
  if (semantic.includes('address')) {
    return `Calle ${counter} # ${10 + counter}-45`;
  }
  if (semantic.includes('first_name')) {
    return `Nombre${counter}`;
  }
  if (semantic.includes('last_name')) {
    return `Apellido${counter}`;
  }
  if (semantic.includes('title') || semantic.includes('subject')) {
    return `Registro de prueba ${counter}`;
  }
  if (semantic.includes('description')) {
    return `Descripcion de prueba para ${field.fieldname ?? 'campo'} (${counter})`;
  }

  return `Seed ${field.fieldname ?? 'field'} ${counter}`;
};

const buildTableRow = async (
  childDoctype: string,
  counter: number,
  linkTrail: string[]
): Promise<Record<string, unknown> | null> => {
  const childMeta = await getDocTypeMeta(childDoctype);
  if (!childMeta?.fields) {
    return null;
  }

  const row: Record<string, unknown> = { doctype: childDoctype };
  for (const childField of childMeta.fields) {
    if (!isWritableField(childField, true)) {
      continue;
    }
    if (childField.fieldtype === 'Table') {
      continue;
    }

    const value = await buildFieldValue(
      childField,
      childDoctype,
      counter,
      false,
      linkTrail
    );
    if (value !== undefined) {
      row[childField.fieldname as string] = value;
    }
  }

  const rowKeys = Object.keys(row);
  if (rowKeys.length <= 1) {
    return null;
  }
  return row;
};

const buildFieldValue = async (
  field: DocFieldMeta,
  currentDoctype: string,
  counter: number,
  allowChildTable: boolean,
  linkTrail: string[]
): Promise<unknown> => {
  const fieldtype = field.fieldtype?.trim();
  if (!fieldtype) {
    return undefined;
  }

  switch (fieldtype) {
    case 'Data':
    case 'Small Text':
    case 'Text':
    case 'Long Text':
    case 'Text Editor':
    case 'Markdown Editor':
    case 'Autocomplete':
      return buildSemanticDataValue(field, counter);

    case 'Password':
      return `Seeder${counter}!123`;

    case 'Code':
      return `// Seed generado automaticamente (${counter})`;

    case 'Duration':
      return `${pad2((counter % 8) + 1)}:00:00`;

    case 'Int':
    case 'Rating':
      return counter;

    case 'Float':
    case 'Currency':
      return Number((counter * 10.75).toFixed(2));

    case 'Percent':
      return (counter * 7) % 100;

    case 'Check':
      return counter % 2;

    case 'Date':
      return toDateString(counter);

    case 'Datetime':
      return toDatetimeString(counter);

    case 'Time':
      return `${pad2((8 + counter) % 23)}:00:00`;

    case 'Select': {
      const options = parseSelectOptions(field.options);
      if (options.length > 0) {
        return options[counter % options.length];
      }
      return undefined;
    }

    case 'Link': {
      const linkDoctype = (field.options ?? '').trim();
      return getLinkValue(linkDoctype, currentDoctype, counter, linkTrail);
    }

    case 'Phone':
      return `+5731020${String(1000 + counter).slice(-4)}`;

    case 'Email':
      return `contacto.${counter}@example.test`;

    case 'URL':
      return `https://example.test/${slugify(currentDoctype)}/${counter}`;

    case 'Attach':
    case 'Attach Image':
      return 'https://picsum.photos/seed/frappe-seeder/640/360';

    case 'Color':
      return ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444'][counter % 4];

    case 'JSON':
      return JSON.stringify({
        generated: true,
        counter,
        doctype: currentDoctype,
      });

    case 'Geolocation':
      return JSON.stringify({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [-74.0721, 4.711],
            },
          },
        ],
      });

    case 'MultiSelect': {
      const options = parseSelectOptions(field.options);
      if (options.length > 0) {
        return options[counter % options.length];
      }
      return undefined;
    }

    case 'Table': {
      if (!allowChildTable) {
        return undefined;
      }

      const childDoctype = (field.options ?? '').trim();
      if (!childDoctype) {
        return undefined;
      }

      const row = await buildTableRow(childDoctype, counter, [
        ...linkTrail,
        currentDoctype,
      ]);
      if (!row) {
        return undefined;
      }

      return [row];
    }

    default:
      return undefined;
  }
};

const buildPayloadForDocType = async (
  doctype: string,
  counter: number,
  includeOptionalFields: boolean,
  linkTrail: string[] = []
): Promise<Record<string, unknown>> => {
  const meta = await getDocTypeMeta(doctype);
  if (!meta?.fields) {
    return {};
  }

  const payload: Record<string, unknown> = {};
  const orderedFields = [...meta.fields].sort(
    (a, b) => Number(b.reqd ?? 0) - Number(a.reqd ?? 0)
  );

  for (const field of orderedFields) {
    if (!isWritableField(field, includeOptionalFields)) {
      continue;
    }

    const fieldname = field.fieldname?.trim();
    if (!fieldname) {
      continue;
    }

    const value = await buildFieldValue(field, doctype, counter, true, [
      ...linkTrail,
      doctype,
    ]);
    if (value !== undefined) {
      payload[fieldname] = value;
    }
  }

  return payload;
};

const selectDocTypesForApp = (
  app: AppSeedConfig,
  allDocTypes: DocTypeListItem[],
  maxDocTypes: number
): string[] => {
  const availableNames = new Set(allDocTypes.map((doctype) => doctype.name));

  const selected = new Set<string>();
  for (const preferred of app.preferredDocTypes) {
    if (availableNames.has(preferred) && isSeedableDocTypeName(preferred)) {
      selected.add(preferred);
    }
  }

  for (const doctype of allDocTypes) {
    if (selected.size >= maxDocTypes) {
      break;
    }
    if (!isSeedableDocTypeName(doctype.name)) {
      continue;
    }

    const hasPrefix = app.doctypePrefixes.some((prefix) =>
      doctype.name.startsWith(prefix)
    );
    const moduleName = (doctype.module ?? '').toLowerCase();
    const moduleMatch = app.moduleKeywords.some((keyword) =>
      moduleName.includes(keyword.toLowerCase())
    );

    if (hasPrefix || moduleMatch) {
      selected.add(doctype.name);
    }
  }

  return Array.from(selected).slice(0, maxDocTypes);
};

const getRequiredLinkDependencies = async (
  doctype: string
): Promise<string[]> => {
  const meta = await getDocTypeMeta(doctype);
  if (!meta?.fields) {
    return [];
  }

  const dependencies = new Set<string>();
  for (const field of meta.fields) {
    if (field.fieldtype !== 'Link' || field.reqd !== 1) {
      continue;
    }

    const linkDoctype = (field.options ?? '').trim();
    if (linkDoctype && linkDoctype !== doctype) {
      dependencies.add(linkDoctype);
    }
  }

  return Array.from(dependencies);
};

const orderDocTypesByDependencies = async (
  docTypes: string[]
): Promise<string[]> => {
  const candidates = new Set(docTypes);
  const indegree = new Map<string, number>();
  const graph = new Map<string, Set<string>>();

  for (const doctype of candidates) {
    indegree.set(doctype, 0);
    graph.set(doctype, new Set());
  }

  for (const doctype of candidates) {
    const dependencies = await getRequiredLinkDependencies(doctype);
    for (const dependency of dependencies) {
      if (!candidates.has(dependency)) {
        continue;
      }

      const targets = graph.get(dependency);
      if (!targets || targets.has(doctype)) {
        continue;
      }

      targets.add(doctype);
      indegree.set(doctype, (indegree.get(doctype) ?? 0) + 1);
    }
  }

  const queue: string[] = Array.from(candidates)
    .filter((doctype) => (indegree.get(doctype) ?? 0) === 0)
    .sort();
  const ordered: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    ordered.push(current);
    const neighbors = graph.get(current);
    if (!neighbors) {
      continue;
    }

    for (const dependent of neighbors) {
      const nextIndegree = (indegree.get(dependent) ?? 0) - 1;
      indegree.set(dependent, nextIndegree);
      if (nextIndegree === 0) {
        queue.push(dependent);
        queue.sort();
      }
    }
  }

  if (ordered.length === docTypes.length) {
    return ordered;
  }

  const unresolved = docTypes.filter((doctype) => !ordered.includes(doctype));
  return [...ordered, ...unresolved.sort()];
};

const createDocTypeRecord = async (
  doctype: string,
  payload: Record<string, unknown>
): Promise<CreateRecordResult> => {
  try {
    const response = await frappeApi.post<
      FrappeResourceResponse<Record<string, unknown>>
    >(`/api/resource/${encodeURIComponent(doctype)}`, payload);

    const nameValue = response.data.data?.name;
    const name = typeof nameValue === 'string' ? nameValue : undefined;
    return { ok: true, name };
  } catch (error) {
    const message = getErrorMessage(error);
    console.warn(
      `[Seeder] Error creando ${doctype} con ${Object.keys(payload).length} campos:`,
      message
    );
    return { ok: false, error: message };
  }
};

const updateDocTypeRecord = async (
  doctype: string,
  name: string,
  payload: Record<string, unknown>
): Promise<boolean> => {
  try {
    await frappeApi.put(
      `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
      payload
    );
    return true;
  } catch (error) {
    console.warn(
      `[Seeder] Error enriqueciendo ${doctype}/${name} con campos opcionales:`,
      getErrorMessage(error)
    );
    return false;
  }
};

export const seedTestData = async (
  options: SeedOptions = {}
): Promise<void> => {
  const seedOptions: Required<SeedOptions> = {
    ...DEFAULT_SEED_OPTIONS,
    ...options,
  };
  currentSeedOptions = seedOptions;

  const summary: SeedSummary = {
    created: 0,
    failed: 0,
    skipped: 0,
    perApp: [],
  };

  const resultByApp = new Map<string, SeedAppResult>();

  const ensureAppResult = (appKey: string): SeedAppResult => {
    const existing = resultByApp.get(appKey);
    if (existing) {
      return existing;
    }

    const created: SeedAppResult = {
      app: appKey,
      created: 0,
      failed: 0,
      skipped: 0,
    };
    resultByApp.set(appKey, created);
    return created;
  };

  try {
    console.log('[Seeder] Configuracion activa:', seedOptions);
    const allDocTypes = await getAllDocTypes();
    const allDocTypeNames = new Set(allDocTypes.map((doctype) => doctype.name));
    const tasks: SeedTask[] = [];

    if (seedOptions.bootstrapMasters) {
      const bootstrapKey = 'Core Masters (bootstrap)';
      const bootstrapResult = ensureAppResult(bootstrapKey);
      const bootstrapDocTypes = CORE_BOOTSTRAP_DOCTYPES.filter((doctype) =>
        allDocTypeNames.has(doctype)
      );

      if (bootstrapDocTypes.length === 0) {
        bootstrapResult.skipped += 1;
        summary.skipped += 1;
      }

      for (const doctype of bootstrapDocTypes) {
        tasks.push({
          appKey: bootstrapKey,
          doctype,
          counter: 1,
        });
      }
    }

    for (const app of APP_SEED_PLAN) {
      const appKey = `${app.displayName} (${app.repo}@${app.branch})`;
      const appResult = ensureAppResult(appKey);

      const appDocTypes = selectDocTypesForApp(
        app,
        allDocTypes,
        seedOptions.docTypesPerApp
      );

      if (appDocTypes.length === 0) {
        appResult.skipped += 1;
        summary.skipped += 1;
        continue;
      }

      const orderedDocTypes = await orderDocTypesByDependencies(appDocTypes);

      for (const doctype of orderedDocTypes) {
        for (
          let counter = 1;
          counter <= seedOptions.recordsPerDocType;
          counter++
        ) {
          tasks.push({
            appKey,
            doctype,
            counter,
          });
        }
      }
    }

    let pendingTasks = tasks;
    const createWithOptionalFields =
      !seedOptions.warmupRequiredOnly && seedOptions.includeOptionalFields;

    for (
      let pass = 1;
      pass <= seedOptions.maxPasses && pendingTasks.length > 0;
      pass++
    ) {
      console.log(
        `[Seeder] Pasada ${pass}/${seedOptions.maxPasses}. Pendientes: ${pendingTasks.length}`
      );

      let createdInPass = 0;
      const nextPendingTasks: SeedTask[] = [];

      for (const task of pendingTasks) {
        const appResult = resultByApp.get(task.appKey);
        if (!appResult) {
          continue;
        }

        const createPayload = await buildPayloadForDocType(
          task.doctype,
          task.counter,
          createWithOptionalFields
        );

        if (Object.keys(createPayload).length === 0) {
          appResult.skipped += 1;
          summary.skipped += 1;
          continue;
        }

        const createResult = await createDocTypeRecord(
          task.doctype,
          createPayload
        );
        if (createResult.ok) {
          appResult.created += 1;
          summary.created += 1;
          createdInPass += 1;

          if (createResult.name) {
            addCachedLinkValue(task.doctype, createResult.name);
          }

          if (
            seedOptions.includeOptionalFields &&
            seedOptions.warmupRequiredOnly &&
            createResult.name
          ) {
            const fullPayload = await buildPayloadForDocType(
              task.doctype,
              task.counter,
              true
            );
            if (Object.keys(fullPayload).length > 0) {
              await updateDocTypeRecord(
                task.doctype,
                createResult.name,
                fullPayload
              );
            }
          }

          continue;
        }

        if (pass >= seedOptions.maxPasses) {
          appResult.failed += 1;
          summary.failed += 1;
        } else {
          nextPendingTasks.push(task);
        }
      }

      if (nextPendingTasks.length > 0 && createdInPass === 0) {
        console.warn(
          '[Seeder] No hubo progreso en esta pasada. El resto se marca como fallido (dependencias faltantes o circulares).'
        );
        for (const task of nextPendingTasks) {
          const appResult = resultByApp.get(task.appKey);
          if (!appResult) {
            continue;
          }
          appResult.failed += 1;
          summary.failed += 1;
        }
        pendingTasks = [];
        break;
      }

      pendingTasks = nextPendingTasks;
    }

    summary.perApp = Array.from(resultByApp.values());

    console.table(summary.perApp);
    console.log('[Seeder] Resumen general:', summary);

    const executionMode = seedOptions.warmupRequiredOnly
      ? 'minimo requerido + enriquecimiento posterior'
      : 'creacion directa';

    alert(
      `Seed finalizado (${executionMode}). Creados: ${summary.created}, fallidos: ${summary.failed}, omitidos: ${summary.skipped}. Revisa la consola para el detalle.`
    );
  } catch (error) {
    console.error('[Seeder] Error general:', getErrorMessage(error));
    alert(
      'Error ejecutando el seed. Verifica permisos Create/Read sobre DocType y sobre los DocTypes de cada app.'
    );
  }
};
