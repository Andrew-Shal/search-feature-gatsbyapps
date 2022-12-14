import React from "react"
import styled from "styled-components"

const LC = {
	StyledListingCard: styled.div`
		border: 1px solid #f88080;
		padding: 10px 15px;
		width: 100%;
		@media (min-width: 768px) {
			width: 50%;
		}
		@media (min-width: 992px) {
			width: 33.33%;
		}
		@media (min-width: 1200px) {
			width: 25%;
		}
	`,
	StyledItemData: styled.div`
		display: block;
	`,
}

// this will be the generic card for all listings
const ListingCard = ({ listingCardData }) => {
	return (
		<LC.StyledListingCard>
			<LC.StyledItemData>{listingCardData.id}</LC.StyledItemData>
			<LC.StyledItemData> {listingCardData.listingTitle}</LC.StyledItemData>
			<LC.StyledItemData>
				{listingCardData.listingLocation}
			</LC.StyledItemData>
			<LC.StyledItemData> {listingCardData.slug}</LC.StyledItemData>
			<LC.StyledItemData>
				{listingCardData.listingBuildingStatus ||
					listingCardData.listingBuildStatus}
			</LC.StyledItemData>
			<LC.StyledItemData> {listingCardData.listingStyle}</LC.StyledItemData>
			<LC.StyledItemData>
				{listingCardData.listingPriceRange}
			</LC.StyledItemData>
		</LC.StyledListingCard>
	)
}

export default ListingCard
