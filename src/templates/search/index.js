import React, { useState } from "react"
import styled from "styled-components"
import SearchBarContainer from "./components/SearchBarContainer"
import Listings from "./components/Listings"

const SP = {
	SearchPage: styled.div``,
}

const SearchResultsContainer = ({ results }) => {
	const title = <h1>Search Results Container</h1>
	console.log("listings: ", results)

	// TODO: fix this, if ok clicked on empty string nothing found will display
	if (!results) return <h5>Nothing Found</h5>
	return (
		<React.Fragment>
			{title}
			<Listings listingsData={results} />
		</React.Fragment>
	)
}

const SearchPage = () => {
	const [searchParams, setSearchParams] = useState(null)
	const [searchResults, setSearchResults] = useState([])

	const handleSearch = async (searchParams) => {
		console.log("search params: ", searchParams)
		setSearchParams(searchParams)

		if (searchParams.searchText == "") {
			setSearchResults(null)
			return
		}

		const searchByType = searchParams.searchBy.name

		// if null, just dont filter by
		const buildStatus = searchParams.filters.buildStatus.value
		const buildingType = searchParams.filters.buildingType.value
		const otherFilter1 = searchParams.filters.otherFilter1.value

		let hasFilters = buildStatus && buildingType && otherFilter1

		console.log(
			`searching by ${searchByType}, searching for ${
				searchParams.searchText
			} \n\n
			${hasFilters ? "Filters \n" : ""}
			${buildStatus ? "Build Status: " + buildStatus + "\n" : ""}
			${buildingType ? "Building Type: " + buildingType + "\n" : ""}
			${otherFilter1 ? "other Filter 1: " + otherFilter1 + "\n" : ""}
			`
		)

		// do fetch here
		const res = await fetch(
			"https://api-us-west-2.hygraph.com/v2/cl7vdvevw1oja01ug3e1j1vsf/master",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization:
						"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NjI5MjQ2ODgsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY2w3dmR2ZXZ3MW9qYTAxdWczZTFqMXZzZi9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiNmVmODEzZmQtMmIyYS00ZDkyLWIyYWMtYjgyOWU4MmMzZWE0IiwianRpIjoiY2w3eHFmOWl3MzJwdTAxdWo2Nmg5ODBseCJ9.jSqw6sNhi57tTaeCkQrhEDus8rbpvEoAOt0P-tASvDBOA415S4ZYpIQNFDGuIW8BIdTVntqsA1Yia2lPnkRZ7tsUpyz-5BjBWGIwthBbthS_i4-dfOU-xIXFlcuP5o88LRpAUIfd-2zam0PvrRPBTrX3Dg9Txh1zUIW-DhL7dpwhF7A9RyI7VRtRtauoPYpEWOY1CkOLppSof-97qFBi64CZ0NzsA5KxvJCr9dQZiYSf19iJ5kBq8AQkeevbjx960tED0BFY1o0Ke3_VWGdRML-lg6L7HX-8YvqlF7leLWk6vQZ-sTxbr0WiK22IDZi0q7aVlWNaCS43MSqX1y-wfA24QLRzGT6q8DlcK6mt024c3GnU7FWn96tszPCbty8C03XzG4cr3KyscbnAzlmX_3HTQ3Cp807JaLGfW2ZvFC6hTYjStJHKJHnfzaHz0ANV-l4xxmoCLSxRdzYImij_vUwmUuP6ZPkm-JaxkDBUfPGSp4zwAPtFSxOQzFlRyWzcoNLDfvQDCb1Jt99Vxe1fj_XrDke57Ajl-tmtFzyLweXX90z_W0VASM9z3J0VNbg84HNx8-GsguqHnCOwqYg0W8UlvYm-u-nbjnUB4qv9w_Rci7-ZVUz0k_qKqtTFNq5x6Y3wIQRH_PTwOx7Ih-FnOykAr-1z3BVeU6ZIGR7oCKQ",
				},
				body: JSON.stringify({
					query: `{
                        countries(where: {_search: "${searchParams.searchText}"}) {
                            name
                            description
                            id
                          }
                    }`,
				}),
			}
		)

		const resultSet = await res.json()
		let data = null

		if (resultSet.data) {
			console.log("result set: ", resultSet.data.countries)
			data = resultSet.data.countries
			setSearchResults(data)
		} else {
			// some error occured
			// set error text and display on site
			console.error("an error occured!")

			setSearchResults([])
		}
	}
	return (
		<SP.SearchPage>
			<SearchBarContainer onSearchButtonClicked={handleSearch} />
			<SearchResultsContainer results={searchResults} />
		</SP.SearchPage>
	)
}

export default SearchPage
