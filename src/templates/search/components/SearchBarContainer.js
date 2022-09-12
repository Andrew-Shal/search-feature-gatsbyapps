import React, { useState } from "react"
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

// STYLED COMPONENTS
const S = {
	SearchBarContainer: styled.div`
		width: 800px;
		margin: 0 auto;
		.searchbar {
			width: calc(100% - 60px);
		}
		.searchSubmit {
			width: 50px;
			padding: 0px 10px;
		}
	`,
	FilterByGroup: styled.div`
		display: flex;
		width: 450px;
	`,
}

// MAIN COMPONENT
const SearchBarContainer = ({ onSearchButtonClicked }) => {
	// defaults to idx 1 if defaultsearchby is set to invalid number
	const [searchBy, setSearchBy] = useState(
		searchByTypes.find((sbt) => sbt.id == defaultSearchBy) || searchByTypes[0]
	)
	// search by handler
	const handleSearchByChange = (updatedValue) => {
		console.log("search by updated to: ", updatedValue.name)
		setSearchBy(updatedValue)
	}

	const [selectedBuildingType, setSelectedBuildingType] = useState(
		buildingTypesData.find((bt) => bt.id == defaultBuildingType) ||
			buildingTypesData[0]
	)
	const [selectedBuildStatus, setSelectedBuildStatus] = useState(
		BuildStatusData.find((bs) => bs.id == defaultBuildStatus) ||
			BuildStatusData[0]
	)
	const [selectedOtherFilter1, setSelectedOtherFilter1] = useState(
		OtherFilter1Data.find((of1) => of1.id == defaultOtherFilter1) ||
			OtherFilter1Data[0]
	)

	// Filter By handlers
	const handleBuildingTypesChange = (selectedValue) => {
		console.log("selectedBuildingType: ", selectedValue)
		setSelectedBuildingType(selectedValue)
	}
	const handleBuildStatusChange = (selectedValue) => {
		console.log("selectedBuildStatus: ", selectedValue)
		setSelectedBuildStatus(selectedValue)
	}
	const handleOtherFilter1Change = (selectedValue) => {
		console.log("selectedOtherFilter1: ", selectedValue)
		setSelectedOtherFilter1(selectedValue)
	}

	// Search text
	const [searchText, setSearchText] = useState("")

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

	return (
		<S.SearchBarContainer>
			<SearchByButtons
				searchByTypes={searchByTypes}
				onSearchByChange={handleSearchByChange}
			/>
			<input
				className="searchbar"
				type="text"
				value={searchText}
				onChange={handleSearchTextChange}
				placeholder={`Search ${searchBy.name}`}
			/>
			<input
				className="searchSubmit"
				type="button"
				onClick={handleSeachBtnClicked.bind(this, onSearchButtonClicked)}
				value="Ok"
			/>
			<S.FilterByGroup>
				<FilterByDropDown
					selected={selectedBuildingType}
					options={buildingTypesData}
					onChange={handleBuildingTypesChange}
				/>
				<FilterByDropDown
					selected={selectedBuildStatus}
					options={BuildStatusData}
					onChange={handleBuildStatusChange}
				/>
				<FilterByDropDown
					selected={selectedOtherFilter1}
					options={OtherFilter1Data}
					onChange={handleOtherFilter1Change}
				/>
			</S.FilterByGroup>
		</S.SearchBarContainer>
	)
}

export default SearchBarContainer
