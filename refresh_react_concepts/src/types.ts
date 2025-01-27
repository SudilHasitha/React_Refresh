import { RowDataPacket } from 'mysql2/promise'

export interface CompanyLogoRow extends RowDataPacket {
    id: number;
    name: string;
    count: number;
    domain: string;
    logo_url: string;
}

export interface Company {
    name: string;  
    domain: string;
    logo_url: string;
}
