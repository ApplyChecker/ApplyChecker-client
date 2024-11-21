export interface Job {
  status: string;
  logo_img: string;
  company_name: string;
  position: string;
}

export interface Application {
  status: string;
  company_id: number;
  job: Job;
  create_time: string;
  open_time: string | null;
}

export interface ApiResponse {
  applications: Application[];
  total: number;
  summary: {
    hire: number;
    complete: number;
    pass: number;
    accept: number;
    write: number;
    reject: number;
    active: number;
  };
}
