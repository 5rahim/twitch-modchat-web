export class ChatMessageUser {
   constructor(
      public readonly id: string,
      public readonly username: string,
      public readonly displayName: string,
      public readonly color: string,
   ) {}
}
