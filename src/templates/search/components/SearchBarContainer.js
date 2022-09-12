import React from "react"
import styled from "styled-components"
import SearchByButtons from "./SearchByButtons"
import FilterByDropDown from "./FilterByDropDown"

// DATA SECTION

// SEARCH BY DATA SECTION
// types to search by
const searchByTypes = [
	{ id: 1, name: "Real Estate" },
	{ id: 2, name: "Hotels" },
	{ id: 3, name: "Apartments" },
	{ id: 4, name: "Land" },
]

// default search by
let defaultSearchBy = 2

// defaults to idx 1 if defaultsearchby is set to invalid number
const [searchBy, setSearchBy] = useState(
	searchByTypes.find((sbt) => sbt.id == defaultSearchBy) || searchByTypes[0]
)

// FILTER BY DATA SECTION
// Filter By types
const buildingTypesData = [
	{ id: 1, value: 1, label: "BT - 1" },
	{ id: 2, value: 2, label: "BT - 2" },
	{ id: 3, value: 3, label: "BT - 3" },
]
const BuildStatusData = [
	{ id: 1, value: 1, label: "BS - 1" },
	{ id: 2, value: 2, label: "BS - 2" },
	{ id: 3, value: 3, label: "BS - 3" },
]
const OtherFilter1Data = [
	{ id: 1, value: 1, label: "OF1 - 1" },
	{ id: 2, value: 2, label: "OF1 - 2" },
	{ id: 3, value: 3, label: "OF1 - 3" },
]

const defaultBuildingType = 1
const defaultBuildStatus = 2
const defaultOtherFilter1 = 3

const [selectedBuildingType, setSelectedBuildingType] = useState(
	buildingTypes.find((bt) => bt.id == defaultBuildingType) ||
		defaultBuildingType[0]
)
const [selectedBuildStatus, setSelectedBuildStatus] = useState(
	buildStatus.find((bs) => bs.id == defaultBuildStatus) || buildStatus[0]
)
const [selectedOtherFilter1, setSelectedOtherFilter1] = useState(
	otherFilter1.find((of1) => of1.id == defaultOtherFilter1) || otherFilter1[0]
)

// Search text
const [searchText, setSearchText] = useState("")

// HANDLERS

// search by handler
const handleSearchByChange = (updatedValue) => {
	console.log("search by updated to: ", updatedValue.name)
	setSearchBy(updatedValue)
}

// Filter By handlers
const handleBuildingTypesChange = (selectedValue) => {
	console.log("selectedBuildingType: ", selectedBuildingType)
	setSelectedBuildingType(selectedValue)
}
const handleBuildStatusChange = (selectedValue) => {
	console.log("selectedBuildStatus: ", selectedBuildStatus)
	setSelectedBuildStatus(selectedValue)
}
const handleOtherFilter1Change = (selectedValue) => {
	console.log("selectedOtherFilter1: ", selectedOtherFilter1)
	setSelectedOtherFilter1(selectedValue)
}

// search input handlers
const handleSearchTextChange = (e) => {
	console.log("search text: ", e.target.value)
	setSearchText(e.target.value || "")
}

// send complied data to caller's cb
const handleSeachBtnClicked = (onSearchButtonClicked) => {
	// send search data to search page
	const searchParams = {
		searchText: searchText,
		searchBy: searchBy,
		filters: {
			buildingType: selectedBuildingType,
			buildStatus: selectedBuildStatus,
			otherFilter1: selectedOtherFilter1,
		},
	}
	onSearchButtonClicked(searchParams)
}

// STYLED COMPONENTS
const S = {
	SearchBarContainer: styled.div`
		width: 800px;
	`,
}

// MAIN COMPONENT
const SearchBarContainer = ({ onSearchButtonClicked }) => {
	return (
		<S.SearchBarContainer>
			<SearchByButtons
				searchByTypes={searchByTypes}
				onSearchByChange={handleSearchByChange}
			/>
			<input
				type="text"
				value={searchText}
				onChange={handleSearchTextChange}
				placeholder={`Search ${searchBy.name}`}
			/>
			<input
				type="button"
				onClick={handleSeachBtnClicked.bind(this, onSearchButtonClicked)}
				value="Ok"
			/>
			<FilterByDropDown
				selected={selectedBuildingType}
				options={buildingTypes}
				onChange={handleBuildingTypesChange}
			/>
			<FilterByDropDown
				selected={selectedBuildStatus}
				options={buildStatus}
				onChange={handleBuildStatusChange}
			/>
			<FilterByDropDown
				selected={selectedOtherFilter1}
				options={otherFilter1}
				onChange={handleOtherFilter1Change}
			/>
		</S.SearchBarContainer>
	)
}

export default SearchBarContainer
