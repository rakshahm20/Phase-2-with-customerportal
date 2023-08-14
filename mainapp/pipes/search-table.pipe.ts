import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchTable'
})
export class SearchTablePipe implements PipeTransform {

  transform(items: any[], searchText: any): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = (searchText.customerName.toLowerCase()) || (searchText.applicationId.toLowerCase()) || (searchText.provider.toLowerCase());

    return items.filter(it => {
      return it.customerName?.toLowerCase().includes(searchText) || it.applicationId?.toLowerCase().includes(searchText) || it.provider?.toLowerCase().includes(searchText);
    });
  }

}
