import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export interface Pagination<T> {
	limit: number;
	page: number;
	totalPage: number;
	item: T;
	totalItem?: number;
};
export interface IResponse<T = object | any> {
	code: HttpStatus;
	success: boolean;
	message: string | ValidationError[];
	data?: T | Pagination<T>;
	errors?: unknown
}
