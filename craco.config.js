const CracoLessPlugin = require('craco-less');

module.exports = {
    style: {
      modules: {
          localIdentName: '[local]--[hash:base64:5]'
      },
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#f759ab' },
                        javascriptEnabled: true,
                        localIdentName: '[local]--[hash:base64:5]'
                    },
                },
            },
        },
    ],
};