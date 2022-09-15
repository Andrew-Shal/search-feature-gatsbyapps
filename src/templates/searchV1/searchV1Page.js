import React, { useState } from 'react'
import { graphql } from 'gatsby'
import './searchV1Page.scss'
import SearchV1 from './components/Search/searchV1'
import Listings from './components/ListingContainer/Listings'

const SearchV1Page = ({ data }) => {
    const mockPageCountry = 'Honduras'
    const country = mockPageCountry

    const ALL_REAL_ESTATES = data.allRealEstates.nodes
    const ALL_LANDS = data.allLands.nodes
    const ALL_HOTELS = data.allHotels.nodes

    console.log('all real estates: ', ALL_REAL_ESTATES)
    console.log('all lands: ', ALL_LANDS)
    console.log('all hotels: ', ALL_HOTELS)
    const [searchResults, setSearchResults] = useState([...ALL_REAL_ESTATES])

    const consumeSearchResults = (filteredResults) => {
        console.log('consumeSearchResults: ', searchResults)
        setSearchResults(filteredResults)
    }

    const handleOnSearchButtonClicked = (SearchParameters) => {
        console.log('handleOnSearchButtonClicked: ', SearchParameters)
    }

    const handleOnShouldUpdateData = (newSearchByValue) => {
        console.log('handleOnShouldUpdateData: ', newSearchByValue)

        switch (newSearchByValue.value) {
            case newSearchByValue.value == 'itemRealEstates':
                console.log('case itemRealEstates')
                setSearchResults([...ALL_REAL_ESTATES])
                break
            case newSearchByValue.value == 'itemHotels':
                console.log('case itemHotels')
                setSearchResults([...ALL_HOTELS])
                break
            case newSearchByValue.value == 'itemLands':
                console.log('case itemLands')
                setSearchResults([...ALL_LANDS])
                break
        }
    }

    return (
        <React.Fragment>
            <h1>Search V1</h1>
            <p> This search example uses all build time data</p>
            <SearchV1 data={searchResults} onShouldUpdateData={handleOnShouldUpdateData} country={country} onSearchResults={consumeSearchResults} onSearchButtonClicked={handleOnSearchButtonClicked} />
            <Listings listingsData={searchResults} />
        </React.Fragment>
    )
}

// get all data
export const query = graphql`
    query GetAllRealEstates {
        allRealEstates: allGraphCmsItemRealEstate {
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
        allLands: allGraphCmsItemLand {
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
        allHotels: allGraphCmsItemHotel {
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
