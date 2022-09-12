exports.createPages = async ({ actions }) => {
	const { createPage } = actions
	createPage({
		path: "/search",
		component: require.resolve("./src/templates/search/index.js"),
		context: {},
		defer: true,
	})
}
