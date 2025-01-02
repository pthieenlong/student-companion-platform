import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export interface Pagination {
	limit: number;
	page: number;
	totalPage: number;
	totalItem?: number;
};
export interface IResponse<T = object> {
	code: HttpStatus;
	success: boolean;
	message: string | ValidationError[];
	pagination?: Pagination;
	data?: T;
	errors?: unknown
}
