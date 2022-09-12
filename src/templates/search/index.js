import React, { useState } from "react"
import styled from "styled-components"
import SearchBarContainer from "./components/SearchBarContainer"

const SP = {
	SearchPage: styled.div``,
}

const SearchResultsContainer = () => {
	return <h1>Search Results Container</h1>
}

const SearchPage = () => {
	const [searchParams, setSearchParams] = useState(null)
	const [searchResults, setearchResults] = useState([])

	const handleSearch = (searchParams) => {
		console.log("search params: ", searchParams)
		// useSearchParams(searchParams)
	}
	return (
		<SP.SearchPage>
			<SearchBarContainer onSearchButtonClicked={handleSearch} />
			<SearchResultsContainer />
		</SP.SearchPage>
	)
}

export default SearchPage
