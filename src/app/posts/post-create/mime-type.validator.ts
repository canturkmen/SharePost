import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

export const mimeType = (control: AbstractControl): Observable<{[key: string]: any}> | Promise<{[key: string]: any}> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObservable = Observable.create((observer: Observer<{[key: string]: any}>) => {
    fileReader.addEventListener("loadend", () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let data = "";
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        data += arr[i].toString(16);
      }
      switch (data) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }

      if(isValid) {
        observer.next(null);
      } else {
        observer.next({invalidMimeType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return frObservable;
};
