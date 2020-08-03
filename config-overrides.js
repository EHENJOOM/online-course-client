const {override, addLessLoader} = require('customize-cra')

module.exports = override(
    addLessLoader({
        modifyVars: { '@primary-color': '#f759ab' },
        javascriptEnabled: true,
        localIdentName: '[local]--[hash:base64:5]'
    })
)