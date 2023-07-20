export class NewsModel{
  public description:string;
  public image_url:string;
  public location:string;

  constructor(description:string,image_url:string,location:string) {
    this.description = description;
    this.image_url = image_url;
    this.location = location;
  }
}
