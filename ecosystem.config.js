module.exports = {
  apps: [
    {
      name: "metagallery-immutable-x",
      script: ".next/standalone/server.js",
      args: "start",
      cwd: "./",
      instances: "1",
      exec_mode: "cluster",
      max_memory_restart: "500M",
      env: {
        PORT: 3001,
        NODE_ENV: "production",
      },
    },
  ],
};
