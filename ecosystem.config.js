module.exports = {
    apps: [
        {
            name: "express-ts codebase",
            script: "dist/server.js",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
            },
            node_args: ["-r", "ts-node/register"],
        },
    ],
};
