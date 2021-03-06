export default class Comment {
  constructor(data) {
    this.id = data.id;
    this.text = data.comment;
    this.emotion = data.emotion;
    this.author = data.author;
    this.date = data.date;
  }

  toRAW() {
    return {
      "comment": this.text,
      "date": this.date,
      "emotion": this.emotion,
    };
  }

  toRAWforStore() {
    return {
      "author": this.author,
      "comment": this.text,
      "date": this.date,
      "emotion": this.emotion,
      "id": this.id,
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
