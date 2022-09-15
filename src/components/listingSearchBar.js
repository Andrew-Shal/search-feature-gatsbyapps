import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import SearchByButtons from './SearchByButtons'
import FilterByDropDown from './FilterByDropDown'

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
    ClearBtn: styled.a`
        background: #2e6a76;
        color: #fff;
        text-decoration: none;
        min-width: 80px;
        max-width: 100px;
        margin: 0px 5px;
        padding: 5px 10px;
        border-radius: 4px;
        text-align: center;
        :hover {
            background: #63a4b1;
        }
    `,
}

const ListingSearchBar = ({ onSelectedListingTypeChanged, defaultListingType, listingTypes, filterByEnums, dataSource, onSearchResults }) => {
    useEffect(() => {
        console.log('data source changed: ', dataSource)
    }, [dataSource])

    const [selectedListingType, setSelectedListingType] = useState(defaultListingType || listingTypes[0])

    const REAL_ESTATE_FILTERS = filterByEnums.RealEstateFilterByEnums
    const HOTEL_FILTERS = filterByEnums.HotelFilterByEnums
    const LAND_FILTERS = filterByEnums.LandFilterByEnums

    const FILTERS = {
        [REAL_ESTATE_FILTERS.id]: { data: REAL_ESTATE_FILTERS.data },
        [HOTEL_FILTERS.id]: { data: HOTEL_FILTERS.data },
        [LAND_FILTERS.id]: { data: LAND_FILTERS.data },
    }

    console.log('FILTERS: ', FILTERS)

    const handleSearchByChange = (updatedValue) => {
        console.log('[handleSearchByChange]')

        // update filters
        console.log('handleSearchByChange: ', updatedValue.value)
        setFilterGroupByListingType(FILTERS[updatedValue.value])

        setSelectedBuildingStatus('')
        setSelectedBuildingStyle('')

        onSelectedListingTypeChanged(selectedListingType, updatedValue)
        setSelectedListingType(updatedValue)
    }

    const [filterGroupByListingType, setFilterGroupByListingType] = useState(FILTERS[selectedListingType.value])

    const [searchText, setSearchText] = useState('')

    const handleSearchTextChange = (e) => {
        console.log('[handleSearchTextChange]')
        setSearchText(e.target.value)
    }

    const buildSearchParams = () => {
        return {
            buildingStatus: selectedBuildingStatus,
            buildingStyle: selectedBuildingStyle,
            listingType: selectedListingType,
            searchingFor: searchText,
        }
    }

    const handleSearchBtnClicked = () => {
        console.log('[handleSeachBtnClicked]')

        onSearchResults(doSearch(buildSearchParams()))
    }

    const doSearch = (searchParams) => {
        // onSearchResults()
        console.log('searching...')

        console.log('searchParams: ', searchParams)

        // js code to do filtering based on search params
        // const hasCountryFilter = country ? true : false
        const hasBuildingTypeFilter = searchParams.buildingStyle ? true : false
        const hasBuildingStatusFilter = searchParams.buildingStatus ? true : false

        // const searchingBy = searchParams.listingType.value
        const text = searchParams.searchingFor

        const filteredData = dataSource.reduce((filteredArr, currentListing) => {
            // sets to true for all listings and updates to false when a criteria is not met
            let meetsCriteria = true

            // filter for building types
            if (hasBuildingTypeFilter && currentListing.listingStyle !== searchParams.buildingStyle) {
                meetsCriteria = false
            }

            // filter for building statuses
            if (hasBuildingStatusFilter && currentListing.listingBuildingStatus !== searchParams.buildingStatus) {
                meetsCriteria = false
            }

            /* 
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
            */
            const validate = (input, search) => {
                return input.indexOf(search) == -1 ? false : true
            }

            if (
                text.trim() != '' &&
                !(
                    validate(text, currentListing.createdAt) ||
                    validate(text, currentListing.listingBuildingStatus) ||
                    validate(text, currentListing.listingLocation) ||
                    validate(text, currentListing.listingPriceRange) ||
                    validate(text, currentListing.listingStyle) ||
                    validate(text, currentListing.listingTitle) ||
                    validate(text, currentListing.slug) ||
                    validate(text, currentListing.itemCountry.countryName)
                )
            ) {
                meetsCriteria = false
            }

            // filter by country
            /* if (hasCountryFilter && currentListing.itemCountry.countryName !== country) {
                meetsCriteria = false
            } */

            // determines if items should be in filtered listing
            if (meetsCriteria) {
                filteredArr.push(currentListing)
            }

            // only item left to do is to handle search by

            return filteredArr
        }, [])

        console.log('filteredData: ', filteredData)
        return filteredData
    }

    const [selectedBuildingStatus, setSelectedBuildingStatus] = useState('')
    const [selectedBuildingStyle, setSelectedBuildingStyle] = useState('')

    useEffect(() => {
        console.log('selectedBuildingStatus,selectedBuildingStyle has been updated')
        onSearchResults(doSearch(buildSearchParams()))
    }, [selectedBuildingStatus, selectedBuildingStyle])

    const handleBuildingStatusChange = (selectedValue) => {
        console.log('[handleBuildingStatusChange]')
        setSelectedBuildingStatus(selectedValue)
    }

    const handleBuildingTypesChange = (selectedValue) => {
        console.log('handleBuildingTypesChange')
        setSelectedBuildingStyle(selectedValue)
    }

    const onClearFilters = () => {
        setSelectedBuildingStatus('')
        setSelectedBuildingStyle('')
    }

    return (
        <React.Fragment>
            <S.SearchBarContainer>
                <SearchByButtons selected={selectedListingType} searchByTypes={listingTypes} onSearchByChange={handleSearchByChange} />
                <input className="searchbar" type="text" value={searchText} onChange={handleSearchTextChange} placeholder={`Search ${selectedListingType.label}`} />
                <input className="searchSubmit" type="button" onClick={handleSearchBtnClicked} value="Ok" />
                <S.FilterByGroup>
                    {filterGroupByListingType.data?.buildingStatus.length ? (
                        <FilterByDropDown
                            selected={selectedBuildingStatus}
                            options={filterGroupByListingType.data.buildingStatus}
                            placeholder={'Building Status'}
                            onChange={handleBuildingStatusChange}
                        />
                    ) : null}
                    {filterGroupByListingType.data?.buildingStyle.length ? (
                        <FilterByDropDown selected={selectedBuildingStyle} options={filterGroupByListingType.data.buildingStyle} placeholder={'Building Style'} onChange={handleBuildingTypesChange} />
                    ) : null}
                    {selectedBuildingStatus || selectedBuildingStyle ? (
                        <S.ClearBtn href="#" onClick={onClearFilters}>
                            clear
                        </S.ClearBtn>
                    ) : null}
                </S.FilterByGroup>
            </S.SearchBarContainer>
        </React.Fragment>
    )
}

export default ListingSearchBar
