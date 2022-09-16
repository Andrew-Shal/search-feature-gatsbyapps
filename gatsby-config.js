require('dotenv').config()

module.exports = {
    siteMetadata: {
        title: `search-feature`,
        siteUrl: `https://www.yourdomain.tld`,
    },
    plugins: [
        'gatsby-plugin-sass',
        'gatsby-plugin-styled-components',
        'gatsby-plugin-image',
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        'gatsby-plugin-use-query-params',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'images',
                path: './src/images/',
            },
            __key: 'images',
        },
        {
            resolve: 'gatsby-source-graphcms',
            options: {
                endpoint: process.env.HYGRAPH_ENDPOINT,
                token: process.env.HYGRAPH_TOKEN,
            },
        },
    ],
}
