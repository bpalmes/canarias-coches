// Tipos compartidos para el sistema de leads

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  carId?: number;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  carLicensePlate?: string;
  carStockNumber?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  sheetName?: string;
  leadType: 'sales' | 'appraisal';
  facebookLeadId?: string;
  walcuLeadId?: string;
  walcuStatus: 'pending' | 'sent' | 'failed';
  walcuError?: string;
  createdAt: string;
  updatedAt: string;
  car?: {
    id: number;
    make?: string;
    model?: string;
    version?: string;
    year?: number;
    numberplate?: string;
    sku?: string;
    regularPrice?: number;
    images: { url: string }[];
  };
}

export interface LeadsResponse {
  success: boolean;
  data: {
    leads: Lead[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    statusSummary: Record<string, number>;
  };
}

export interface ImportResult {
  success: boolean;
  message?: string;
  data?: {
    processed: number;
    created: number;
    updated: number;
    errors: string[];
    totalLeads: number;
  };
  error?: string;
}

export interface SheetInfo {
  title: string;
  sheets: Array<{
    title: string;
    sheetId: number;
    rowCount: number;
    columnCount: number;
  }>;
  headers: string[];
  sampleData: string[][];
  totalRows: number;
}


