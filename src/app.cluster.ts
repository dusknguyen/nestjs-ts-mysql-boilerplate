import cluster from 'cluster';
import os from 'os';

/**
 *
 */
export function appCluster(callback: Function) {
  const numCPUs = os.cpus().length;
  if (cluster.isPrimary) {
    console.log(`Primary server started on ${process.pid}`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker: any, _code: any, _signal: any) => {
      console.log(`Worker ${worker.process.pid} died. Restarting`);
      cluster.fork();
    });
  } else {
    console.log(`Cluster server started on ${process.pid}`);
    callback();
  }
}
