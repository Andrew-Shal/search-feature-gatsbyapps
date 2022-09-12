import React, { useState } from "react"
import { graphql } from "gatsby"

const SearchPage = ({ data }) => {
	const countries = data.allGraphCmsCountry.nodes

	const CountryLiWrapper = ({ country }) => {
		return (
			<React.Fragment>
				<li>
					<ul>
						<li>id: {country.id}</li>
						<li>name: {country.name}</li>
						<li>description: {country.description}</li>
					</ul>
				</li>
				<br />
				<br />
			</React.Fragment>
		)
	}

	const SelectElement = ({ selected, items, onChange }) => {
		const handleOnChange = (e) => {
			console.log("new value: ", e.target.value)
			onChange(
				items.find((item) => item.value == e.target.value) || selected
			)
		}

		return (
			<select value={selected.value} onChange={handleOnChange}>
				{items.map((item) => (
					<option key={item.value} value={item.value}>
						{item.label}
					</option>
				))}
			</select>
		)
	}

	const CountriesULWrapper = ({ countries }) => {
		return (
			<ul>
				{countries.map((country) => (
					<CountryLiWrapper key={country.id} country={country} />
				))}
			</ul>
		)
	}

	const buildingTypesData = [
		{ value: 1, label: "BT - 1" },
		{ value: 2, label: "BT - 2" },
		{ value: 3, label: "BT - 3" },
	]
	const BuildStatusData = [
		{ value: 1, label: "BS - 1" },
		{ value: 2, label: "BS - 2" },
		{ value: 3, label: "BS - 3" },
	]
	const OtherFilter1Data = [
		{ value: 1, label: "OF1 - 1" },
		{ value: 2, label: "OF1 - 2" },
		{ value: 3, label: "OF1 - 3" },
	]

	const [buildingTypes, setBuildingTypes] = useState(buildingTypesData)
	const [buildStatus, setBuildStatus] = useState(BuildStatusData)
	const [otherFilter1, setOtherFilter1] = useState(OtherFilter1Data)

	// types to search by
	const searchByTypes = [
		{
			id: 1,
			name: "Real Estate",
		},
		{
			id: 2,
			name: "Hotels",
		},
		{
			id: 3,
			name: "Apartments",
		},
		{
			id: 4,
			name: "Land",
		},
	]

	const SearchByBtns = ({ searchByTypes, onSearchByChange }) => {
		const handleSearchByBtnClick = (sbt, e) => {
			e.preventDefault()
			onSearchByChange(sbt)
		}

		return (
			<div className="search-by-types">
				{searchByTypes.map((sbt) => (
					<a
						key={sbt.id}
						href="#"
						onClick={handleSearchByBtnClick.bind(this, sbt)}
						className="search-by-types-btns"
					>
						{sbt.name}
					</a>
				))}
			</div>
		)
	}

	// default seach by
	let defaultSearchBy = 2

	// defaults to idx 1 if defaultsearchby is set to invalid number
	const [searchBy, setSearchBy] = useState(
		searchByTypes.find((sbt) => sbt.id == defaultSearchBy) || searchByTypes[0]
	)

	// default to null
	const [searchResults, setSearchResults] = useState(null)

	const handleSearchByChange = (updatedValue) => {
		console.log("search by updated to: ", updatedValue.name)
		setSearchBy(updatedValue)
	}

	const [searchText, setSearchText] = useState("")

	const doSearch = async () => {
		console.log("searchBy: ", searchText)
		if (searchText == "") {
			setSearchResults(null)
			return
		}

		const searchByType = searchBy.name

		console.log(
			`searching by ${searchByType} and searching for ${searchText}`
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
                        countries(where: {_search: "${searchText}"}) {
                            name
                            description
                            id
                          }
                    }`,
				}),
			}
		)

		const resultSet = await res.json()
		let countries = null

		if (resultSet.data) {
			console.log("result set: ", resultSet.data.countries)
			countries = resultSet.data.countries
			setSearchResults(countries)
		} else {
			// some error occured
			// set error text and display on site
			console.error("an error occured!")

			setSearchResults([])
		}
	}

	const SearchResultContainer = ({ searchResults, searchingBy }) => {
		if (searchResults == null) return <p>nothing to see here</p>
		if (searchResults.length == 0)
			return <p>{`no results found for ${searchingBy.name}`}</p>

		// we have data, display listings

		console.log("searchResults: ", searchResults)
		return (
			<div className="search-results-container">
				<div className="results-count">{`displaying ${searchResults.length} results`}</div>
				<div className="results">
					<CountriesULWrapper countries={searchResults} />
				</div>
			</div>
		)
	}

	const handleSearchTextChange = (e) => {
		console.log("search text: ", e.target.value)
		setSearchText(e.target.value || "")
	}

	const [selectedBuildingType, setSelectedBuildingType] = useState(
		buildingTypes[0]
	)
	const [selectedBuildStatus, setSelectedBuildStatus] = useState(
		buildStatus[1]
	)
	const [selectedOtherFilter1, setSelectedOtherFilter1] = useState(
		otherFilter1[2]
	)

	const handleBuildingTypesChange = (selectedValue) => {
		console.log("selectedBuildingType: ", selectedBuildingType)
		setSelectedBuildingType(selectedValue)
	}
	const handleBuildStatusChange = (selectedValue) => {
		console.log("selectedBuildStatus: ", selectedBuildStatus)
		setSelectedBuildStatus(selectedValue)
	}
	const handleOtherFilter1Change = (selectedValue) => {
		console.log("selectedOtherFilter1", selectedOtherFilter1)
		setSelectedOtherFilter1(selectedValue)
	}

	return (
		<React.Fragment>
			{/* Search Page */}
			<div>
				<div className="search-by-container">
					<SearchByBtns
						searchByTypes={searchByTypes}
						onSearchByChange={handleSearchByChange}
					/>
					<input
						type="text"
						value={searchText}
						onChange={handleSearchTextChange}
						placeholder={`Search ${searchBy.name}`}
					/>
					<input type="button" onClick={doSearch} value="Ok" />
					<SelectElement
						selected={selectedBuildingType}
						items={buildingTypes}
						onChange={handleBuildingTypesChange}
					/>
					<SelectElement
						selected={selectedBuildStatus}
						items={buildStatus}
						onChange={handleBuildStatusChange}
					/>
					<SelectElement
						selected={selectedOtherFilter1}
						items={otherFilter1}
						onChange={handleOtherFilter1Change}
					/>
				</div>
				<SearchResultContainer
					searchResults={searchResults}
					searchingBy={searchBy}
				/>
				<ul>
					static from json
					<CountriesULWrapper countries={countries} />
				</ul>
			</div>
		</React.Fragment>
	)
}

export const query = graphql`
	query GetAllCountires {
		allGraphCmsCountry {
			nodes {
				name
				id
				description
			}
		}
	}
`

export default SearchPage
