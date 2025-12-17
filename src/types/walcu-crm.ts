// Tipos base para Walcu CRM
export interface WalcuBaseEntity {
  _id?: string;
  dealer_id: string;
  created_by: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
  custom?: string;
}

// Tipos para contactos
export interface WalcuContactName {
  first_name: string;
  last_name: string;
  gender?: 'male' | 'female';
  salutation?: string;
  title?: string;
  raw_name?: string;
  parsed?: boolean;
}

export interface WalcuContact {
  _id?: string;
  name: WalcuContactName;
  phones: string[];
  emails: string[];
  government_id?: string;
  custom?: string;
}

// Tipos para direcciones
export interface WalcuCoordinates {
  lat: number;
  lng: number;
}

export interface WalcuAddress {
  _id?: string;
  coordinates?: WalcuCoordinates;
  url?: string;
  place_id?: string;
  country?: string;
  area_level_1?: string;
  area_level_2?: string;
  area_level_3?: string;
  postal_code?: string;
  locality?: string;
  route?: string;
  street_number?: string;
  address_details?: string;
}

// Tipos para detalles de negocio
export interface WalcuBusinessDetails {
  _id?: string;
  name?: string;
  phones?: string[];
  emails?: string[];
  tax_id?: string;
  website?: string;
  is_business?: boolean;
  custom?: string;
}

// Tipos para clientes
export interface WalcuClientData extends WalcuBaseEntity {
  app_id?: string; // ID de la aplicación para autenticación
  address?: WalcuAddress;
  contacts: WalcuContact[];
  primary_contact: WalcuContact;
  business_details?: WalcuBusinessDetails;
  contacts_emails?: string[];
  contacts_phones?: string[];
  contacts_names?: string[];
  contacts_government_ids?: string[];
  pinned_note_id?: string;
  bulk_import_ids?: string[];
  lead_import_ids?: string[];
  foreign_ids?: string[];
}

export interface WalcuClient extends WalcuClientData {
  _id: string;
  computed?: {
    appointments_created_by?: string[];
    client_call_durations?: number[];
    client_call_notes?: string[];
    client_last_aftersale_lead_date?: string;
    client_last_appraisal_lead_date?: string;
    client_last_call_date?: string;
    client_last_communication_date?: string;
    client_last_communication_direction?: string;
    client_last_communication_user?: string;
    client_last_email_date?: string;
    client_last_inbound_call_date?: string;
    client_last_inbound_communication_date?: string;
    client_last_inbound_email_date?: string;
    client_last_inbound_sms_date?: string;
    client_last_inbound_whatsapp_date?: string;
    client_last_outbound_call_date?: string;
    client_last_outbound_communication_date?: string;
    client_last_outbound_email_date?: string;
    client_last_outbound_sms_date?: string;
    client_last_outbound_whatsapp_date?: string;
    client_last_read_email_date?: string;
    client_last_sale_lead_date?: string;
    client_last_sms_date?: string;
    client_number_of_aftersale_leads?: number;
    client_number_of_appraisal_leads?: number;
    client_number_of_calls?: number;
    client_number_of_communications?: number;
    client_number_of_exchanged_emails?: number;
    client_number_of_inbound_calls?: number;
    client_number_of_inbound_communications?: number;
    client_number_of_inbound_emails?: number;
    client_number_of_inbound_sms?: number;
    client_number_of_inbound_whatsapp_sessions?: number;
    client_number_of_leads?: number;
    client_number_of_outbound_calls?: number;
    client_number_of_outbound_communications?: number;
    client_number_of_outbound_emails?: number;
    client_number_of_outbound_sms?: number;
    client_number_of_outbound_whatsapp_sessions?: number;
    client_number_of_sale_leads?: number;
    client_number_of_sms?: number;
    client_number_of_whatsapp_sessions?: number;
    notes?: string[];
    number_of_appointments?: number;
    number_of_completed_tasks?: number;
    number_of_notes?: number;
    number_of_offers?: number;
    number_of_tasks?: number;
    number_of_uncompleted_tasks?: number;
  };
}

// Tipos para vehículos
export interface WalcuCar {
  _id?: string;
  make: string;
  model: string;
  year: number;
  version?: string;
  license_plate?: string;
  stock_number?: string;
  price?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  power?: number;
  doors?: number;
  seats?: number;
  body_style?: string;
  color?: string;
  vin?: string;
  category?: 'car' | 'truck' | 'motorcycle';
  type?: 'new' | 'used';
  images?: string[];
  ad_urls?: string[];
  custom?: string;
}

export interface WalcuCarListItem {
  car: WalcuCar;
  car_id?: string;
  quantity?: number;
  price_to?: number;
  year_from?: number;
  mileage_to?: number;
  power_from?: number;
}

// Tipos para leads
export interface WalcuLeadBase extends WalcuBaseEntity {
  status_history?: WalcuStatusHistory[];
  status?: WalcuStatus;
  notification?: WalcuNotification;
  bulk_import_ids?: string[];
  lead_import_ids?: string[];
  links?: string[];
  origin: WalcuOrigin;
  inquiry: string;
  provider?: WalcuProvider;
  type: string;
  location: string;
  email_id?: string;
  imported_from?: string;
  assigned?: WalcuAssignment[];
  current_assigned?: WalcuAssignment;
  client_id: string; // Requerido por la API de Walcu CRM
  investments?: WalcuInvestment[];
  cost?: number;
  foreign_ids?: string[];
}

export interface WalcuSaleLeadData extends WalcuLeadBase {
  car_list: WalcuCarListItem[];
  finance?: WalcuFinance;
}

export interface WalcuSaleLead extends WalcuSaleLeadData {
  _id: string;
  computed?: {
    appointments?: WalcuAppointment[];
    appointments_created_by?: string[];
    car_ad_urls?: string[];
    car_body_style?: string;
    car_category?: string;
    car_current_price?: number;
    car_customs?: string;
    car_dealer_ad_url?: string;
    car_doors?: number;
    car_fuel?: string;
    car_id?: string;
    car_images?: string[];
    car_license_plate?: string;
    car_list?: WalcuCarListItem[];
    car_make?: string;
    car_mileage?: number;
    car_model?: string;
    car_number_of_photos?: number;
    car_power?: number;
    car_seats?: number;
    car_stock_number?: string;
    car_transmission?: string;
    car_type?: string;
    car_version?: string;
    car_vin?: string;
    car_year?: number;
    client_address?: WalcuAddress;
    client_business_details?: WalcuBusinessDetails;
    client_call_durations?: number[];
    client_call_notes?: string[];
    client_contacts?: WalcuContact[];
    client_contacts_names?: string[];
    client_created_at?: string;
    client_customs?: string;
    client_emails?: string[];
    client_gdpr?: WalcuGDPR;
    client_last_call_date?: string;
    client_last_communication_date?: string;
    client_last_communication_direction?: string;
    client_last_communication_user?: string;
    client_last_email_date?: string;
    client_last_inbound_call_date?: string;
    client_last_inbound_communication_date?: string;
    client_last_inbound_email_date?: string;
    client_last_inbound_sms_date?: string;
    client_last_outbound_call_date?: string;
    client_last_outbound_communication_date?: string;
    client_last_outbound_email_date?: string;
    client_last_outbound_sms_date?: string;
    client_last_read_email_date?: string;
    client_last_sms_date?: string;
    client_number_of_aftersale_leads?: number;
    client_number_of_appraisal_leads?: number;
    client_number_of_calls?: number;
    client_number_of_communications?: number;
    client_number_of_email_addresses?: number;
    client_number_of_exchanged_emails?: number;
    client_number_of_inbound_calls?: number;
    client_number_of_inbound_communications?: number;
    client_number_of_leads?: number;
    client_number_of_outbound_calls?: number;
    client_number_of_outbound_communications?: number;
    client_number_of_phone_numbers?: number;
    client_number_of_sale_leads?: number;
    client_number_of_whatsapp_sessions?: number;
    client_oldest_undone_notification?: string;
    client_phones?: string[];
    client_primary_contact?: WalcuContact;
    first_offer_date?: string;
    last_offer_date?: string;
    notes?: string[];
    number_of_appointments?: number;
    number_of_completed_tasks?: number;
    number_of_notes?: number;
    number_of_offers?: number;
    number_of_tasks?: number;
    number_of_uncompleted_tasks?: number;
    previous_assigned_to?: string[];
    response_time?: number;
    tasks?: WalcuTask[];
    tasks_assigned_to?: string[];
    tasks_date?: string[];
    total_price_of_lead?: number;
  };
}

export interface WalcuAftersaleLeadData extends WalcuLeadBase {
  vehicle_id?: string;
  vehicle?: WalcuCar[];
}

export interface WalcuAftersaleLead extends WalcuAftersaleLeadData {
  _id: string;
  computed?: {
    appointments?: WalcuAppointment[];
    appointments_created_by?: string[];
    client_address?: WalcuAddress;
    client_business_details?: WalcuBusinessDetails;
    client_call_durations?: number[];
    client_call_notes?: string[];
    client_contacts?: WalcuContact[];
    client_contacts_names?: string[];
    client_created_at?: string;
    client_customs?: string;
    client_emails?: string[];
    client_gdpr?: WalcuGDPR;
    client_last_call_date?: string;
    client_last_communication_date?: string;
    client_last_communication_direction?: string;
    client_last_communication_user?: string;
    client_last_email_date?: string;
    client_last_inbound_call_date?: string;
    client_last_inbound_communication_date?: string;
    client_last_inbound_email_date?: string;
    client_last_inbound_sms_date?: string;
    client_last_outbound_call_date?: string;
    client_last_outbound_communication_date?: string;
    client_last_outbound_email_date?: string;
    client_last_outbound_sms_date?: string;
    client_last_read_email_date?: string;
    client_last_sms_date?: string;
    client_number_of_aftersale_leads?: number;
    client_number_of_appraisal_leads?: number;
    client_number_of_calls?: number;
    client_number_of_communications?: number;
    client_number_of_email_addresses?: number;
    client_number_of_exchanged_emails?: number;
    client_number_of_inbound_calls?: number;
    client_number_of_inbound_communications?: number;
    client_number_of_leads?: number;
    client_number_of_outbound_calls?: number;
    client_number_of_outbound_communications?: number;
    client_number_of_phone_numbers?: number;
    client_number_of_sale_leads?: number;
    client_number_of_whatsapp_sessions?: number;
    client_oldest_undone_notification?: string;
    client_phones?: string[];
    client_primary_contact?: WalcuContact;
    first_offer_date?: string;
    last_offer_date?: string;
    notes?: string[];
    number_of_appointments?: number;
    number_of_completed_tasks?: number;
    number_of_notes?: number;
    number_of_offers?: number;
    number_of_tasks?: number;
    number_of_uncompleted_tasks?: number;
    previous_assigned_to?: string[];
    response_time?: number;
    tasks?: WalcuTask[];
    tasks_assigned_to?: string[];
    tasks_date?: string[];
    total_price_of_lead?: number;
    vehicle?: WalcuCar[];
  };
}

// Tipos auxiliares
export interface WalcuStatusHistory {
  assigned_at: string;
  user: string;
  status: string;
  substatus_history?: WalcuSubstatusHistory[];
  _id: string;
}

export interface WalcuSubstatusHistory {
  substatus: string;
  user: string;
  assigned_at: string;
  _id: string;
}

export interface WalcuStatus {
  assigned_at: string;
  user: string;
  status: string;
  substatus?: WalcuSubstatus;
  _id: string;
}

export interface WalcuSubstatus {
  substatus: string;
  user: string;
  assigned_at: string;
  _id: string;
}

export interface WalcuNotification {
  notify_at: string;
  notify_to: string[];
  done: boolean;
  done_at?: string;
  done_by?: string;
  _id: string;
}

export interface WalcuOrigin {
  source: string;
  medium: string;
  campaign: string;
  _id?: string;
}

export interface WalcuProvider {
  name: string;
  from: string;
  subject: string;
  _id?: string;
}

export interface WalcuAssignment {
  to: string;
  at: string;
  by: string;
  _id: string;
}

export interface WalcuInvestment {
  provider_id: string;
  investment_id: string;
  cycle_id: string;
  cost: number;
  _id: string;
}

export interface WalcuFinance {
  rate: number;
  period_unit: 'week' | 'month' | 'year';
  duration: number;
  payment_value: number;
  yearly_mileage: number;
  down_payment: number;
  finance_type: string;
  _id?: string;
}

export interface WalcuAppointment {
  date: string;
  start_date: string;
  end_date: string;
  showed_up: boolean;
  assigned_to: string[];
  appointment_id: string;
  appointment_customs?: string;
}

export interface WalcuTask {
  description: string;
  assigned_to: string[];
  task_id: string;
  done: boolean;
  due_date: string;
  task_customs?: string;
}

export interface WalcuGDPR {
  gdprentry_id: string;
  location: string;
  consents: {
    profiling: boolean;
    marketing: boolean;
    third_party: boolean;
    _id?: string;
  };
  granted_on: string;
  expires_on: string;
  custom?: string;
  _id?: string;
}

// Tipos para respuestas de la API
export interface WalcuApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface WalcuErrorResponse {
  error: string;
  message: string;
  status: number;
  timestamp: string;
}
