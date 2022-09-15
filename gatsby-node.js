/* exports.createPages = async ({ actions }) => {
    const { createPage } = actions
    createPage({
        path: '/search',
        component: require.resolve('./src/templates/search/index.js'),
        context: {},
        defer: true,
    })

    // Search V1
    createPage({
        path: '/searchv1',
        component: require.resolve('./src/templates/searchV1/searchV1Page.js'),
        context: {},
        defer: true,
    })
} */

exports.createPages = async ({ actions, graphql }) => {
    const { createPage } = actions

    // used to build country pages
    const { data } = await graphql(`
        {
            allGraphCmsItemCountry {
                edges {
                    node {
                        countrySlug
                        id
                    }
                }
            }
        }
    `)

    const countries = data.allGraphCmsItemCountry.edges

    countries.forEach((country) => {
        // create country pages
        createPage({
            path: `/${country.node.countrySlug}/`,
            component: require.resolve('./src/templates/Country/listingPageByCountry.js'),
            context: {
                slug: country.node.countrySlug,
                id: country.node.id,
            },
            defer: country.node.countrySlug > 3,
        })
    })
}
