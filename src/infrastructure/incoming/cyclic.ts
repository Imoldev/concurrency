import { setTimeout } from 'timers';

export class Cyclic {
  private delayTimer: NodeJS.Timeout | null = null;

  private lastPullDuration: number;

  private name: string;

  private payload: (args?: any[] | any) => Promise<void>;

  constructor(cyclicName: string, payloadFunction: (args?: any[] | any) => Promise<void>) {
    //super();
    this.name = cyclicName;
    this.payload = payloadFunction;
  }

  public run = async (sleepTime: number, args?: any[] | any) => {
    const startTime = Date.now();
    //this.emit(`CyclicStart`, startTime, this.name);
    this.delayTimer = null;
    try {
      await this.payload(args);
    } catch (err) {
      //  this.emit(`CyclicCrash`, this.name);
      console.error(err);
    }
    this.delayTimer = setTimeout(() => {
      this.run(sleepTime, args);
    }, sleepTime);
    const finishTime = Date.now();
    this.lastPullDuration = finishTime - startTime;
    // this.emit(`CyclicFinish`, finishTime, this.name);

    console.log(this.name + ' last duration: ', this.lastPullDuration);
  };

  public getLastPullDuration = () => {
    return this.getLastPullDuration;
  };
}
