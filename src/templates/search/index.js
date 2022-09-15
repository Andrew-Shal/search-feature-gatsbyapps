import React, { useState } from 'react'
import styled from 'styled-components'
import SearchBarContainer from './components/SearchBarContainer'
import Listings from './components/Listings'
import { graphql } from 'gatsby'

const SP = {
    SearchPage: styled.div``,
}

const SearchResultsContainer = ({ results }) => {
    const title = <h1>Search Results Container</h1>
    console.log('listings: ', results)

    // TODO: fix this, if ok clicked on empty string nothing found will display
    if (!results) return <h5>Nothing Found</h5>
    return (
        <React.Fragment>
            {title}
            <Listings listingsData={results} />
        </React.Fragment>
    )
}

const SearchPage = ({ data }) => {
    // enums from live data
    const { HotelFilterByEnums, LandFilterByEnums, RealEstateFilterByEnums } = data

    console.log('ListingBuildStatusEnums: ', HotelFilterByEnums, LandFilterByEnums, RealEstateFilterByEnums)

    const [searchParams, setSearchParams] = useState(null)
    const [searchResults, setSearchResults] = useState([])

    const handleSearch = async (searchParams) => {
        console.log('search params: ', searchParams)
        setSearchParams(searchParams)

        if (searchParams.searchText == '') {
            setSearchResults(null)
            return
        }

        const searchByType = searchParams.searchBy.name

        const commonListingFields = `\n\t\tid\n\t\tslug\n\t\tlistingTitle\n\t\tlistingBuildingStatus\n\t\tlistingPriceRange\n\t\tlistingLocation\n\t\tlistingStyle\n\t`

        const handleSearchByRealEstate = ({ filters, searchText }, fields) => {
            // build search query
            return `{\n\titemRealEstates(where: {_search: "${searchText}"}) {\n${fields}\n\t}\n}`
        }

        const handleSearchByHotels = ({ filters, searchText }, fields) => {
            // build search query
            return `{\n\titemHotels(where: {_search: "${searchText}"}) {\n${fields}\n\t}\n}`
        }
        const handleSearchByApartments = ({ filters, searchText }, fields) => {
            // build search query
            return `{\n\titemApartments(where: {_search: "${searchText}"}) {\n${fields}\n\t}\n}`
        }
        const handleSearchByLand = ({ filters, searchText }, fields) => {
            // build search query
            return `{\n\titemLands(where: {_search: "${searchText}"}) {\n${fields}\n\t}\n}`
        }

        let query = null

        // using what name has.
        // TODO: will have to update this
        switch (searchByType) {
            case 'Real Estate':
                query = handleSearchByRealEstate(searchParams, commonListingFields)
                break
            case 'Hotels':
                const innerFields = `\n\t\tid\n\t\tslug\n\t\tlistingTitle\n\t\tlistingBuildStatus\n\t\tlistingPriceRange\n\t\tlistingLocation\n\t\tlistingStyle\n\t`
                query = handleSearchByHotels(searchParams, innerFields)
                break
            case 'Apartments':
                query = handleSearchByApartments(searchParams, commonListingFields)
                break
            case 'Land':
                query = handleSearchByLand(searchParams, commonListingFields)
                break
            default:
                console.log('dropped in default mode')
                // TODO: do something here
                break
        }

        if (!query) {
            // TODO: do something here
            console.log('no query built due to invalid searchbytype')
            return
        }

        console.log('gql: ', query)

        // if null, just dont filter by
        const buildStatus = searchParams.filters.buildStatus.value
        const buildingType = searchParams.filters.buildingType.value
        const otherFilter1 = searchParams.filters.otherFilter1.value

        let hasFilters = buildStatus && buildingType && otherFilter1

        console.log(
            `searching by ${searchByType}, searching for ${searchParams.searchText} \n\n
			${hasFilters ? 'Filters \n' : ''}
			${buildStatus ? 'Build Status: ' + buildStatus + '\n' : ''}
			${buildingType ? 'Building Type: ' + buildingType + '\n' : ''}
			${otherFilter1 ? 'other Filter 1: ' + otherFilter1 + '\n' : ''}
			`
        )

        // do fetch here
        // You can either do this or, when the page loads use graph ql to get everything and the we just query that json data
        const res = await fetch(
            //"https://api-us-west-2.hygraph.com/v2/cl7vdvevw1oja01ug3e1j1vsf/master",
            'https://api-us-east-1.hygraph.com/v2/cl7y4gder3a4r01rr8pqf2sio/master',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:
                        // "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NjI5MjQ2ODgsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY2w3dmR2ZXZ3MW9qYTAxdWczZTFqMXZzZi9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiNmVmODEzZmQtMmIyYS00ZDkyLWIyYWMtYjgyOWU4MmMzZWE0IiwianRpIjoiY2w3eHFmOWl3MzJwdTAxdWo2Nmg5ODBseCJ9.jSqw6sNhi57tTaeCkQrhEDus8rbpvEoAOt0P-tASvDBOA415S4ZYpIQNFDGuIW8BIdTVntqsA1Yia2lPnkRZ7tsUpyz-5BjBWGIwthBbthS_i4-dfOU-xIXFlcuP5o88LRpAUIfd-2zam0PvrRPBTrX3Dg9Txh1zUIW-DhL7dpwhF7A9RyI7VRtRtauoPYpEWOY1CkOLppSof-97qFBi64CZ0NzsA5KxvJCr9dQZiYSf19iJ5kBq8AQkeevbjx960tED0BFY1o0Ke3_VWGdRML-lg6L7HX-8YvqlF7leLWk6vQZ-sTxbr0WiK22IDZi0q7aVlWNaCS43MSqX1y-wfA24QLRzGT6q8DlcK6mt024c3GnU7FWn96tszPCbty8C03XzG4cr3KyscbnAzlmX_3HTQ3Cp807JaLGfW2ZvFC6hTYjStJHKJHnfzaHz0ANV-l4xxmoCLSxRdzYImij_vUwmUuP6ZPkm-JaxkDBUfPGSp4zwAPtFSxOQzFlRyWzcoNLDfvQDCb1Jt99Vxe1fj_XrDke57Ajl-tmtFzyLweXX90z_W0VASM9z3J0VNbg84HNx8-GsguqHnCOwqYg0W8UlvYm-u-nbjnUB4qv9w_Rci7-ZVUz0k_qKqtTFNq5x6Y3wIQRH_PTwOx7Ih-FnOykAr-1z3BVeU6ZIGR7oCKQ",
                        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NjI5NTUzMTQsImF1ZCI6WyJodHRwczovL2FwaS11cy1lYXN0LTEuaHlncmFwaC5jb20vdjIvY2w3eTRnZGVyM2E0cjAxcnI4cHFmMnNpby9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC5ncmFwaGNtcy5jb20vIiwic3ViIjoiNjAyNDNiYWItOGI0OC00YmQzLWFiZGEtOTc5N2I4OGE5NWM4IiwianRpIjoiY2w3eThub2syM2J4cTAxdWo0c3NkMjFoZiJ9.eWcSJuLzocaXbgHWMHmDpVT2qAmB2iNY8WhuiukLFlvtnXwbbxKcI6ftYCLL9whLoN_mytQzFbPn2KczL02YOfd6tKmyFwwnRAXp8qm1LorPy7C9cz9DbEbcy0Ugs4ZkOBEnAvu50MFKdpCnfN0BO5GTnY8UC92BW9yQYw0xDCRvJZTLb4N8VsXFkJ_mRTDEgWMFF2FIlY-UJR9xG_jXfCyxNcVrKY_Uu7dq07PMQsLe7KaLKdrxhCRFvoFoKaUB9OHR2eC3cZxxFcQBb572QOuEsCBy0RBQmIOMNelUu3vWDKeLCoh5SawtOo8dFXHTlIdIDGcBcnUe_HKLQYMil0jnWvKjQbhnzqSU0snFYzJ3k3bdEXaL0g3lHOZD9577uTUk5D1qCzPdMAcQ2FJOCJcuHNvmGA8_O4ES0xHk3PMJ5OrJPCjjGp3KMt492HX_vsUmjx8iJm6lB4o4Aqf9zC-Kzn9OgkC3y-SeHSF0a_a9ThMZvBgGJWPoI4yqvNGvWBTPjkuhxGE1DcFnp8ygS6e69L5mcWZIdzsPPH1qfWnvozZd0Ni9bSA1TCVv3AaT1bGIIvXtPmrgHu-tiZA7Qm_xstnjHY9Nnu_BpW28hG7YsWL5vw-uuU3o72QonZzrRcQdHtMz5_wSUCL0RfgZwshv8cMuRdE-Z6LwnmdgITU',
                },
                body: JSON.stringify({
                    query: query,
                }),
            }
        )

        const resultSet = await res.json()
        let data = null

        if (resultSet.data) {
            console.log('result set: ', resultSet.data)
            //
            switch (searchByType) {
                case 'Real Estate':
                    data = resultSet.data.itemRealEstates
                    break
                case 'Hotels':
                    data = resultSet.data.itemHotels
                    break
                case 'Apartments':
                    data = resultSet.data.itemApartments
                    break
                case 'Land':
                    data = resultSet.data.itemLands
                    break
                default:
                    console.log('dropped in default mode')
                    // TODO: do something here
                    break
            }
            setSearchResults(data)
        } else {
            // some error occured
            // set error text and display on site
            console.error('an error occured!')

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

/* export const query = graphql`
	query GetSearchFilterEnums {
		RealEstateFilterByEnums: allGraphCmsItemRealEstate {
			buildingStatus: distinct(field: listingBuildingStatus)
			buildingStyle: distinct(field: listingStyle)
		}
		HotelFilterByEnums: allGraphCmsItemHotel {
			buildingStatus: distinct(field: listingBuildStatus)
			buildStyle: distinct(field: listingStyle)
		}
		LandFilterByEnums: allGraphCmsItemLand {
			buildingStatus: distinct(field: listingBuildStatus)
			buildingStyle: distinct(field: listingStyle)
		}
	}
` */

export default SearchPage
