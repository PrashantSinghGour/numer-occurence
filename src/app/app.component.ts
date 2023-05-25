import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public searchInput: string = '';
  //default array
  public twoDigitArray: number[][] = [
    [45, 87, 23, 68, 57, 12],
    [76, 34, 98, 21, 76, 89],
    [54, 32, 45, 78, 91, 36],
    [10, 65, 43, 87, 23, 54],
    [33, 56, 78, 12, 65, 98],
    [89, 44, 21, 76, 32, 67],
  ];
  constructor() { }

  ngOnInit() {
    const data = localStorage.getItem('_data');
    if (data) {
      this.twoDigitArray = JSON.parse(data);
    }
  }

  public uploadData(e: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(<unknown>event!.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }); // to get 2d array pass 2nd parameter as object {header: 1}
      this.twoDigitArray = this.convertArrayOfObjectsToArrays(data);
      this.twoDigitArray = this.twoDigitArray.reverse();
      localStorage.setItem('_data', JSON.stringify(this.twoDigitArray));
    };
  }

  checkIfHighlightRequire(input: number) {
    let isHighlight = false;
    const searchInput = this.searchInput.split(',');
    searchInput.some((sInput) => {
      if (input.toString().split('').includes(sInput.trim())) {
        isHighlight = true;
        return true;
      }
      return false;
    });
    return isHighlight;
  }

  convertArrayOfObjectsToArrays(arr: any) {
    console.log(arr);
    const result: any[] = [];

    for (let obj of arr) {
      const values: any = Object.values(obj);
      result.push(values);
    }

    result.forEach(mainArray => {
      let counter = 0;
      while (counter < 6) {
        if (!mainArray[counter]) {
          mainArray[counter] = '';
        }
        counter++;
      }
    });

    return result;
  }
}
