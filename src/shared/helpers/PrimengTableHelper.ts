import { Paginator } from 'primeng/paginator';

import { LazyLoadEvent } from 'primeng/api';

import { Table } from 'primeng/table';

export class PrimengTableHelper {
  // //   predefinedRecordsCountPerPage = [5, 10, 25, 50, 100, 250, 500];
  predefinedRecordsCountPerPage = [1, 2, 3, 4, 5, 10, 15];
  defaultRecordsCountPerPage =5;

  isResponsive = true;

  resizableColumns: boolean = false;

  totalRecordsCount = 0;

  records: any[];

  isLoading = false;

  showLoadingIndicator(): void {
    setTimeout(() => {
      this.isLoading = true;
    }, 0);
  }

  hideLoadingIndicator(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 0);
  }

  getSorting(table: Table): string {
    let sorting: string = '';

    if (table.sortField) {
      sorting = table.sortField;

      if (table.sortOrder === 1) sorting += ' ASC';
      else if (table.sortOrder === -1) sorting += ' DESC';
    }

    return sorting;
  }

  getMaxResultCount(paginator: Paginator, event: LazyLoadEvent): number {
    if (paginator.rows) return paginator.rows;

    if (!event) return 0;

    return event.rows as number;
  }

  getSkipCount(paginator: Paginator, event: LazyLoadEvent): number {
    if (paginator.first) return paginator.first;

    if (!event) return 0;

    return event.first as number;
  }

  shouldResetPaging(event: LazyLoadEvent): boolean {
    if (!event /*|| event.sortField*/)
      // if you want to reset after sorting, comment out parameter

      return true;

    return false;
  }
}
