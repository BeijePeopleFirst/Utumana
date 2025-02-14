export class Service {
  constructor(
    public id: number,
    public title: string,
    public icon_url: string
  ) {}

  /*equals(oth: Object) {
    if (oth instanceof Service) {
      return this.id === oth.id;
    }

    return false;
  }*/
}