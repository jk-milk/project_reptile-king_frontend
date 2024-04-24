export interface Cage {
  id: number;
  name: string;
  serial_code: string;
  user_id: number;
  reptile_serial_code: string | null;
  memo: string;
  set_temp: number;
  set_hum: number;
  img_urls: string[];
  created_at: string;
  updated_at: string;
  expired_at: string | null;
}

export interface Reptile {
  id: number;
  name: string;
  serial_code:string;
  user_id: number;
  species: string;
  gender: string;
  birth: string;
  memo: string;
  img_urls: string[];
  created_at: string;
  updated_at: string;
  expired_at: string | null;
}

export interface AvgTempHum {
  year: string;
  month: string;
  day: string;
  avgtemp: string;
  avghum: string;
}
