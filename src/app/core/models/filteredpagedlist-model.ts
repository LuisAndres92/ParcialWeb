export interface FilteredPagedList {
  valueSearch: string | null;
  orderColumn: string | null;
  orderList: string | null;
  page: number;
  pageSize: number;
}