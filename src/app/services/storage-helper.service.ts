import {Injectable} from '@angular/core';

@Injectable()
export class StorageHelperService {

  static PushData(newItemName, newData) {
    const alldataRaw = sessionStorage.getItem('Caterbook-dataTransferStorage');
    let allData = null;
    if (!alldataRaw) {
      allData = [];
    } else {
      allData = JSON.parse(alldataRaw);
    }
    allData.push({name: newItemName, data: newData});
    sessionStorage.setItem('WebShop-dataTransferStorage', JSON.stringify(allData));
  }

  static PullData(name) {
    let result = null;
    let index = 0;
    const dataRaw = sessionStorage.getItem('WebShop-dataTransferStorage');
    if (!dataRaw) {
      return null;
    } else {
      const data = JSON.parse(dataRaw);
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === name) {
          result = data[i].data;
          index = i;
          break;
        }
      }
      if (result !== null) {
        data.splice(index, 1);
      }
      sessionStorage.setItem('WebShop-dataTransferStorage', JSON.stringify(data));
      return result;
    }
  }

  static GetData(name) {
    let result = null;
    const dataRaw = sessionStorage.getItem('WebShop-dataTransferStorage');
    if (!dataRaw) {
      return null;
    } else {
      const data = JSON.parse(dataRaw);
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === name) {
          result = data[i].data;
          break;
        }
      }
      return result;
    }
  }

  constructor() {
  }
}
