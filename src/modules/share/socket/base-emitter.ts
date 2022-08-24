export class BaseEmitter {
  private static instance: BaseEmitter;

  public static getInstance(): BaseEmitter {
    if (!BaseEmitter.instance) {
      BaseEmitter.instance = new BaseEmitter();
    }
    return BaseEmitter.instance;
  }
}
