import { exec } from 'child_process';
const command = `npx ts-node -r tsconfig-paths/register node_modules/typeorm/cli.js migration:create migrations/${process.argv[2]}`;
(() =>
  exec(command, (error, stdout, stderr) => {
    if (error !== null) {
      console.error(stderr);
    }
    console.log(stdout);
  }))();
