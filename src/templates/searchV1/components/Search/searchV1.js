import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import FilterByDropDown from './components/FilterByDropDown'
import SearchByButtons from './components/SearchByButtons'

// styled component
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

// If country set as null, then we assume search all countries else search based on country
// this search component use data generated at build time.
const SearchV1 = ({ country, onSearchResults, data, onSearchButtonClicked, onShouldUpdateData }) => {
    // this query gets all active enums that is being used by each listing type. This is done to ensure we dont have any
    // unnecessary filter options that would just clutter up our drop down boxes
    const { HotelFilterByEnums, LandFilterByEnums, RealEstateFilterByEnums } = useStaticQuery(graphql`
        query GetAllFilterEnums {
            RealEstateFilterByEnums: allGraphCmsItemRealEstate {
                buildingStatus: distinct(field: listingBuildingStatus)
                buildingStyle: distinct(field: listingStyle)
            }
            HotelFilterByEnums: allGraphCmsItemHotel {
                buildingStatus: distinct(field: listingBuildingStatus)
                buildingStyle: distinct(field: listingStyle)
            }
            LandFilterByEnums: allGraphCmsItemLand {
                buildingStatus: distinct(field: listingBuildingStatus)
                buildingStyle: distinct(field: listingStyle)
            }
        }
    `)

    // types that can be searched by
    // Add more if needed
    const searchByTypes = [
        { id: 1, value: 'itemRealEstates', label: 'Real Estate' },
        { id: 2, value: 'itemHotels', label: 'Hotels' },
        { id: 3, value: 'itemLands', label: 'Land' },
    ]

    // filter by states
    const [selectedBuildingStatus, setSelectedBuildingStatus] = useState('')
    const [selectedBuildingStyle, setSelectedBuildingType] = useState('')

    // updates filtered search when dropdown modified.
    useEffect(() => {
        handleSeachBtnClicked(onSearchButtonClicked)
    }, [selectedBuildingStatus])
    useEffect(() => {
        handleSeachBtnClicked(onSearchButtonClicked)
    }, [selectedBuildingStyle])
    /*     useEffect(() => {
        console.log('data changed: ', data)
    }, [data][0]) */

    // change handlers for filter by dropdowns
    const handleBuildingStatusChange = (selectedValue) => {
        console.log('selectedBuildingStatus: ', selectedValue)
        setSelectedBuildingStatus(selectedValue)
    }

    const onClearFilters = () => {
        setSelectedBuildingType('')
        setSelectedBuildingStatus('')
    }

    const handleBuildingTypesChange = (selectedValue) => {
        console.log('selectedBuildingStyle: ', selectedValue)
        setSelectedBuildingType(selectedValue)
    }

    // using default for searchByTypes[0] which is real estate
    const [searchByTypeFilterOptions, setSearchByTypeFilterOptions] = useState({
        buildingStatus: RealEstateFilterByEnums.buildingStatus,
        buildingStyle: RealEstateFilterByEnums.buildingStyle,
    })

    // search by state
    // defaults to idx 0 == real estates
    const [searchBy, setSearchBy] = useState(searchByTypes[0])

    // search by handler
    const handleSearchByChange = (updatedValue) => {
        console.log('search by updated to: ', updatedValue.label)

        // update filters
        switch (updatedValue.value) {
            case 'itemRealEstates':
                setSearchByTypeFilterOptions({
                    buildingStatus: RealEstateFilterByEnums.buildingStatus,
                    buildingStyle: RealEstateFilterByEnums.buildingStyle,
                })
                break
            case 'itemHotels':
                setSearchByTypeFilterOptions({
                    buildingStatus: HotelFilterByEnums.buildingStatus,
                    buildingStyle: HotelFilterByEnums.buildingStyle,
                })
                break
            case 'itemLands':
                setSearchByTypeFilterOptions({
                    buildingStatus: LandFilterByEnums.buildingStatus,
                    buildingStyle: HotelFilterByEnums.buildingStyle,
                })
                break
        }

        onShouldUpdateData(updatedValue)

        setSearchBy(updatedValue)
    }

    // Search text
    const [searchText, setSearchText] = useState('')

    // search input handlers
    const handleSearchTextChange = (e) => {
        console.log('search text: ', e.target.value)
        setSearchText(e.target.value)
    }

    // send complied data to caller's cb
    const handleSeachBtnClicked = (onSearch) => {
        // building a standardized search params object to be fed in callback function of callee
        const searchParams = {
            text: searchText,
            searchBy: searchBy,
            filters: {
                buildingType: selectedBuildingStyle,
                buildStatus: selectedBuildingStatus,
            },
        }

        // send this data first
        onSearch(searchParams)

        // js code to do filtering based on search params
        const hasCountryFilter = country ? true : false
        const hasBuildingTypeFilter = searchParams.filters.buildingType ? true : false
        const hasBuildingStatusFilter = searchParams.filters.buildStatus ? true : false
        // you may want to sanitize these values
        const searchingBy = searchParams.searchBy.value
        const text = searchParams.searchText

        // this section to actually filter the data will be based on how we get it initially on build time. Will need to structure this is the easiest way for us
        // to perform the filtering/search.

        const filteredData = data.reduce((filteredArr, currentListing) => {
            // sets to true for all listings and updates to false when a criteria is not met
            let meetsCriteria = true

            // filter for building types
            if (hasBuildingTypeFilter && currentListing.listingStyle !== searchParams.filters.buildingType) {
                meetsCriteria = false
            }

            // filter for building statuses
            if (hasBuildingStatusFilter && currentListing.listingBuildingStatus !== searchParams.filters.buildStatus) {
                meetsCriteria = false
            }

            // filter for either real estate, hotels, land, etc.
            // TODO

            // filter by country
            if (hasCountryFilter && currentListing.itemCountry.countryName !== country) {
                meetsCriteria = false
            }

            // determines if items should be in filtered listing
            if (meetsCriteria) {
                filteredArr.push(currentListing)
            }

            // only item left to do is to handle search by

            return filteredArr
        }, [])

        // do filtering then send data back to parent component cb fn
        onSearchResults(filteredData)
    }

    return (
        <React.Fragment>
            <S.SearchBarContainer>
                <SearchByButtons selected={searchBy} searchByTypes={searchByTypes} onSearchByChange={handleSearchByChange} />
                <input className="searchbar" type="text" value={searchText} onChange={handleSearchTextChange} placeholder={`Search ${searchBy.label}`} />
                <input className="searchSubmit" type="button" onClick={handleSeachBtnClicked.bind(this, onSearchButtonClicked)} value="Ok" />
                <S.FilterByGroup>
                    {searchByTypeFilterOptions?.buildingStatus.length ? (
                        <FilterByDropDown selected={selectedBuildingStatus} options={searchByTypeFilterOptions.buildingStatus} placeholder={'Building Status'} onChange={handleBuildingStatusChange} />
                    ) : null}
                    {searchByTypeFilterOptions?.buildingStyle.length ? (
                        <FilterByDropDown selected={selectedBuildingStyle} options={searchByTypeFilterOptions.buildingStyle} placeholder={'Building Style'} onChange={handleBuildingTypesChange} />
                    ) : null}
                </S.FilterByGroup>
                {selectedBuildingStatus || selectedBuildingStyle ? <a onClick={onClearFilters}>clear</a> : null}
            </S.SearchBarContainer>
        </React.Fragment>
    )
}

export default SearchV1
