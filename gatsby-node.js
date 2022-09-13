exports.createPages = async ({ actions }) => {
	const { createPage } = actions
	createPage({
		path: "/search",
		component: require.resolve("./src/templates/search/index.js"),
		context: {},
		defer: true,
	})

	// Search V1
	createPage({
		path: "/searchv1",
		component: require.resolve("./src/templates/searchV1/searchV1Page.js"),
		context: {},
		defer: true,
	})
}
