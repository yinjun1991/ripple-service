module.exports = {
  apps : [{
    name: 'ripple-service',
    script: 'main.js',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    cwd: "dist",
    env: {
      HOST: '0.0.0.0',
      PORT: '4000'
    }
  }]
};
