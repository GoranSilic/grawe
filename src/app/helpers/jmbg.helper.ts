export class JmbgHelper {

  static isAdult (jmbg: string, insuranceBeginDate: Date): boolean {
    const day = jmbg.toString().substring(0, 2);
    const month = jmbg.toString().substring(2, 4);
    let year = jmbg.toString().substring(4, 7);

    if (year.charAt(0) === '9') {
      year = '1' + year;
    } else if (year.charAt(0) === '0') {
      year = '2' + year;
    }

    const dateOfBirth: Date = new Date(+year, (+month) - 1, +day);

    const age: number = JmbgHelper.calculateAgeOnInsuranceBeginDate(dateOfBirth, insuranceBeginDate);

    return age >= 18;
  }

  static formatDate(jmbg: string): string {
    if (JmbgHelper.isJmbgValid(jmbg)) {
      const day = jmbg.toString().substring(0, 2);
      const month = jmbg.toString().substring(2, 4);
      let year = jmbg.toString().substring(4, 7);

      if (year.charAt(0) === '9') {
        year = '1' + year;
      } else if (year.charAt(0) === '0') {
        year = '2' + year;
      }

      return day + '.' + month + '.' + year + '.';
    }

    return '-';
  }

  static getSalutatoryAddress(jmbg: string): number {
    const salutatoryAddress = jmbg.toString().substring(9, 12);
    return +salutatoryAddress < 500 ? 1 : 2;
  }

  static validateNumbers(jmbg: string): boolean {
    if (jmbg) {
      const isNum = /^\d+$/.test(jmbg.toString());
      return isNum;
    }
  }

  static isJmbgValid(jmbg: string): boolean {
    if (!JmbgHelper.validateNumbers(jmbg)) {
      return false;
    }
    const day = jmbg.toString().substring(0, 2);
    const month = jmbg.toString().substring(2, 4);
    let year = jmbg.toString().substring(4, 7);

    if (year.charAt(0) === '9') {
      year = '1' + year;
    } else if (year.charAt(0) === '0') {
      year = '2' + year;
    } else {
      return false;
    }

    if (+month > 12 || +month < 1) {
      return false;
    }

    const daysOfMonth: number = new Date(+year, +month, 0).getDate();

    if (+day < 1 || +day > daysOfMonth) {
      return false;
    }

    return true;
  }

  static calculateAgeOnInsuranceBeginDate(dob: Date, insuranceBeginDate: Date): number {
    const diff_ms = insuranceBeginDate.getTime() - dob.getTime();
    const age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  static convertTextToCapital(text: string) {
    const newWord = text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
    return newWord;
  }
}
