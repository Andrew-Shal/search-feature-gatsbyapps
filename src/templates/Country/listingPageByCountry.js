import React from 'react'
import { graphql } from 'gatsby'
import { useState } from 'react'
import Listings from '../searchV1/components/ListingContainer/Listings'
import ListingSearchBar from '../../components/listingSearchBar'

// This will be the listing page by country
const ListingPageByCountry = ({ data }) => {
    // necessary data for search bar. Each listing page will act as a single page application.
    // the search bar will filter and return a new filtered array based on these datasets.
    const ALL_REAL_ESTATE_LISTINGS = data.allRealEstateListings.nodes
    const ALL_LAND_LISTINGS = data.allLandListings.nodes
    const ALL_HOTELS = data.allHotels.nodes
    const COUNTRY = data.country

    // ids should match what listing types value has
    const FILTER_BY_ENUMS = {
        RealEstateFilterByEnums: {
            id: 'realEstate',
            // shouldShow: true,
            data: { ...data.RealEstateFilterByEnums },
        },
        HotelFilterByEnums: {
            id: 'hotel',
            // shouldShow: true,
            data: { ...data.HotelFilterByEnums },
        },
        LandFilterByEnums: {
            id: 'land',
            // shouldShow: true,
            data: { ...data.LandFilterByEnums },
        },
    }

    const LISTING_TYPES = [
        { id: 1, value: 'realEstate', label: 'Real Estate' },
        { id: 2, value: 'hotel', label: 'Hotels' },
        { id: 3, value: 'land', label: 'Land' },
    ]

    // before setting the default state of search results, we will have to check if any query paarameter is set in the url amd if
    // there is, then we start filtering based on that

    // for now I am defaulting it to the real estates listings
    const [searchResults, setSearchResults] = useState([...ALL_REAL_ESTATE_LISTINGS])

    const handleSearchResults = (searchResults) => {
        console.log('[handleSearchResults]')
        setSearchResults(searchResults)
    }

    // acts as our API/database
    const [dataSource, setDataSource] = useState([...ALL_REAL_ESTATE_LISTINGS])

    const handleListingTypeChanged = (previousListingType, newListingType) => {
        console.log('[handleListingTypeChanged]')

        if (newListingType === previousListingType) return

        // this will have to be modified when new entires needs to be added in listing types
        switch (newListingType.value) {
            case 'realEstate':
                setDataSource([...ALL_REAL_ESTATE_LISTINGS])
                break
            case 'hotel':
                setDataSource([...ALL_HOTELS])
                break
            case 'land':
                setDataSource([...ALL_LAND_LISTINGS])
                break
        }
    }

    // TODO: add filters to show functionality
    return (
        <div>
            <h1>Listings for {COUNTRY.countryName}</h1>
            <ListingSearchBar
                onSelectedListingTypeChanged={handleListingTypeChanged}
                listingTypes={LISTING_TYPES}
                defaultListingType={LISTING_TYPES[0]}
                filterByEnums={FILTER_BY_ENUMS}
                dataSource={dataSource}
                onSearchResults={handleSearchResults}
            />
            {searchResults?.length ? <Listings listingsData={searchResults} /> : <h3>No results found</h3>}
        </div>
    )
}

// gets the current country's data and all the listings(real estates, lands, hotels) grouped
export const query = graphql`
    query SingleCountryQuery($id: String!) {
        RealEstateFilterByEnums: allGraphCmsItemRealEstate(filter: { itemCountry: { id: { eq: $id } } }) {
            buildingStatus: distinct(field: listingBuildingStatus)
            buildingStyle: distinct(field: listingStyle)
        }
        HotelFilterByEnums: allGraphCmsItemHotel(filter: { itemCountry: { id: { eq: $id } } }) {
            buildingStatus: distinct(field: listingBuildingStatus)
            buildingStyle: distinct(field: listingStyle)
        }
        LandFilterByEnums: allGraphCmsItemLand(filter: { itemCountry: { elemMatch: { id: { eq: $id } } } }) {
            buildingStatus: distinct(field: listingBuildingStatus)
            buildingStyle: distinct(field: listingStyle)
        }
        country: graphCmsItemCountry(id: { eq: $id }) {
            id
            countrySlug
            countryName
        }
        allRealEstateListings: allGraphCmsItemRealEstate(filter: { itemCountry: { id: { eq: $id } } }) {
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
        allLandListings: allGraphCmsItemLand(filter: { itemCountry: { elemMatch: { id: { eq: $id } } } }) {
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
        allHotels: allGraphCmsItemHotel(filter: { itemCountry: { id: { eq: $id } } }) {
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

export default ListingPageByCountry
