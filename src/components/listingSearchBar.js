import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import SearchByButtons from './SearchByButtons'
import FilterByDropDown from './FilterByDropDown'

import { useSearchParams } from 'react-router-dom'

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
        onSearchResults(doSearch(buildSearchParams()))
    }, [dataSource])

    /* CONSTANTS ACTING AS DATASOURCE FOR DROPDOWNS */
    const REAL_ESTATE_FILTERS = filterByEnums.RealEstateFilterByEnums
    const HOTEL_FILTERS = filterByEnums.HotelFilterByEnums
    const LAND_FILTERS = filterByEnums.LandFilterByEnums

    const FILTERS = {
        [REAL_ESTATE_FILTERS.id]: { data: REAL_ESTATE_FILTERS.data },
        [HOTEL_FILTERS.id]: { data: HOTEL_FILTERS.data },
        [LAND_FILTERS.id]: { data: LAND_FILTERS.data },
    }

    // HANDLE QUERY PARAMS IF PASSED IN THE URL TO INITALIZE STATES
    const [queryParams, setQueryParams] = useSearchParams()
    const qp_searchKeyword = queryParams.get('search')
    const qp_BuildingStyle = queryParams.get('style')
    const qp_BuildingStatus = queryParams.get('status')
    const qp_ListingType = queryParams.get('type')

    console.log('queryParams: ', queryParams)

    // STATES
    const [searchText, setSearchText] = useState(qp_searchKeyword || '')

    const possibleListingType = listingTypes.find((lt) => lt.value === qp_ListingType)
    const [selectedListingType, setSelectedListingType] = useState(possibleListingType || defaultListingType || listingTypes[0])

    const [filterGroupByListingType, setFilterGroupByListingType] = useState(FILTERS[selectedListingType.value])

    const validBuildingStatus = filterGroupByListingType?.data?.buildingStatus.includes(qp_BuildingStatus)
    const validBuildingType = filterGroupByListingType?.data?.buildingStyle.includes(qp_BuildingStyle)

    const [selectedBuildingStatus, setSelectedBuildingStatus] = useState(validBuildingStatus ? qp_BuildingStatus : '')
    const [selectedBuildingStyle, setSelectedBuildingStyle] = useState(validBuildingType ? qp_BuildingStyle : '')

    const init = () => {
        // update datasource based on starting states.
        onSelectedListingTypeChanged(null, selectedListingType)
    }

    useEffect(() => {
        init()
    }, [])

    const handleSearchByChange = (updatedValue) => {
        console.log('[handleSearchByChange]: ', updatedValue.value)
        setFilterGroupByListingType(FILTERS[updatedValue.value])

        setSelectedBuildingStatus('')
        setSelectedBuildingStyle('')

        onSelectedListingTypeChanged(selectedListingType, updatedValue)
        setSelectedListingType(updatedValue)
    }

    const updateURLSearchParam = (keys, values) => {
        console.log('[updateURLSearchParam]', keys, values)
        let updatedSearchParams = new URLSearchParams(queryParams.toString())

        for (let i = 0; i < keys.length; i++) {
            if (values[i] == '' || values[i] == null) {
                updatedSearchParams.delete(keys[i])
            } else {
                updatedSearchParams.set(keys[i], values[i])
            }
        }
        setQueryParams(updatedSearchParams.toString())
    }

    const handleSearchTextChange = (e) => {
        console.log('[handleSearchTextChange]')
        setSearchText(e.target.value)
        updateURLSearchParam(['search'], [e.target.value])
    }

    const buildSearchParams = () => {
        return {
            buildingStatus: selectedBuildingStatus,
            buildingStyle: selectedBuildingStyle,
            listingType: selectedListingType,
            searchingFor: searchText,
        }
    }

    const doSearch = (searchParams) => {
        console.log('searching...')
        console.log('searchParams: ', searchParams)

        // js code to do filtering based on search params
        // const hasCountryFilter = country ? true : false
        const hasBuildingTypeFilter = searchParams.buildingStyle ? true : false
        const hasBuildingStatusFilter = searchParams.buildingStatus ? true : false

        // const searchingBy = searchParams.listingType.value
        const text = searchParams.searchingFor

        const filteredData = dataSource.reduce((filteredArr, currentListing) => {
            const validate = (needle, haystack) => haystack.toLowerCase().includes(needle)

            // sets to true for all listings and updates to false when a criteria is not met
            let meetsCriteria = true

            // filter for building types
            if (hasBuildingTypeFilter && currentListing.listingStyle !== searchParams.buildingStyle) meetsCriteria = false
            // filter for building statuses
            if (hasBuildingStatusFilter && currentListing.listingBuildingStatus !== searchParams.buildingStatus) meetsCriteria = false

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

            // determines if items should be in filtered listing
            if (meetsCriteria) filteredArr.push(currentListing)

            return filteredArr
        }, [])

        console.log('filteredData: ', filteredData)
        return filteredData
    }

    useEffect(() => {
        onSearchResults(doSearch(buildSearchParams()))
    }, [selectedBuildingStatus, selectedBuildingStyle])

    const handleBuildingStatusChange = (selectedValue) => {
        console.log('[handleBuildingStatusChange]')
        updateURLSearchParam(['status'], [selectedValue])
        setSelectedBuildingStatus(selectedValue)
    }

    const handleBuildingTypesChange = (selectedValue) => {
        console.log('handleBuildingTypesChange')
        updateURLSearchParam(['style'], [selectedValue])
        setSelectedBuildingStyle(selectedValue)
    }

    const onClearFilters = (e) => {
        e.preventDefault()
        updateURLSearchParam(['status', 'style'], [null, null])
        setSelectedBuildingStatus('')
        setSelectedBuildingStyle('')
    }

    const handleSubmit = (e) => {
        console.log('[handleSubmit]')
        e.preventDefault()
        onSearchResults(doSearch(buildSearchParams()))
    }

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                <S.SearchBarContainer>
                    <SearchByButtons selected={selectedListingType} searchByTypes={listingTypes} onSearchByChange={handleSearchByChange} />
                    <input
                        className="searchbar"
                        type="text"
                        value={searchText}
                        onSubmit={handleSearchTextChange}
                        onChange={handleSearchTextChange}
                        placeholder={`Search ${selectedListingType.label}`}
                    />
                    <input className="searchSubmit" type="submit" value="Ok" />
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
                            <FilterByDropDown
                                selected={selectedBuildingStyle}
                                options={filterGroupByListingType.data.buildingStyle}
                                placeholder={'Building Style'}
                                onChange={handleBuildingTypesChange}
                            />
                        ) : null}
                        {selectedBuildingStatus || selectedBuildingStyle ? (
                            <S.ClearBtn href="#" onClick={onClearFilters}>
                                clear
                            </S.ClearBtn>
                        ) : null}
                    </S.FilterByGroup>
                </S.SearchBarContainer>
            </form>
        </React.Fragment>
    )
}

export default ListingSearchBar
