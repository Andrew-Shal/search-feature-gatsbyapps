import React, { useState } from "react"
import { graphql } from "gatsby"
import "./searchV1Page.scss"
import SearchV1 from "./components/Search/searchV1"
import Listings from "./components/ListingContainer/Listings"

const SearchV1Page = ({ data }) => {
	const mockPageCountry = "Honduras"
	const country = mockPageCountry

	const ALL_REAL_ESTATES = data.allRealEstates.nodes

	console.log("all real estates: ", ALL_REAL_ESTATES)
	const [searchResults, setSearchResults] = useState(ALL_REAL_ESTATES)
	const consumeSearchResults = (filteredResults) => {
		console.log("searchResults: ", searchResults)
		setSearchResults(filteredResults)
	}

	const handleOnSearchButtonClicked = (SearchParameters) => {
		console.log("SearchParameters: ", SearchParameters)
	}

	return (
		<React.Fragment>
			<h1>Search V1</h1>
			<p> This search example uses all build time data</p>
			<SearchV1
				data={ALL_REAL_ESTATES}
				country={country}
				onSearchResults={consumeSearchResults}
				onSearchButtonClicked={handleOnSearchButtonClicked}
			/>
			<Listings listingsData={searchResults} />
		</React.Fragment>
	)
}

// get all data
export const query = graphql`
	query GetAllRealEstates {
		allRealEstates: allGraphCmsItemRealEstate(
			filter: { itemCountry: { countryName: { eq: "Honduras" } } }
		) {
			nodes {
				id
				createdAt
				listingBuildingStatus
				listingLocation
				listingPriceRange
				listingStyle
				listingTitle
				slug
				itemCountry {
					id
					countrySlug
					countryName
				}
			}
		}
	}
`

export default SearchV1Page
