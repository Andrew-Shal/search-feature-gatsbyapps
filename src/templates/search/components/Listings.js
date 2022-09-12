import React from "react"
import styled from "styled-components"
import ListingCard from "./ListingCard"

const L = {
	StyledListings: styled.div`
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	`,
}

// generates listings based on what data is provided in props
const Listings = ({ listingsData }) => {
	return (
		<L.StyledListings>
			{listingsData.map((listing) => (
				<ListingCard key={listing.id} listingCardData={listing} />
			))}
		</L.StyledListings>
	)
}

export default Listings
