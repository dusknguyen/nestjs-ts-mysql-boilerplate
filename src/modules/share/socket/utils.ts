/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable no-promise-executor-return */
export const sleep = async (time: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, time));
