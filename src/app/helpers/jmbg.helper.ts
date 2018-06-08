export class JmbgHelper {

  static getYearOfBirth(jmbg: string): number {
    const year = jmbg.toString().substring(4, 7);
    return +year;
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

  static isJmbgValid(jmbg: string): boolean {
    const day = jmbg.toString().substring(0, 2);
    const month = jmbg.toString().substring(2, 4);
    let year = jmbg.toString().substring(4, 7);

    if (isNaN(+jmbg)) {
      return false;
    }

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
}
